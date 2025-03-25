package umm3601.game;

import static com.mongodb.client.model.Filters.eq;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.bson.BsonArray;
import org.bson.BsonString;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;
import io.javalin.validation.BodyValidator;

class GameControllerSpec {

  private GameController gameController;

  private ObjectId gameId;

  private static MongoClient mongoClient;
  private static MongoDatabase db;

    // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<Game> gameCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build());
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    // Reset our mock context and argument captor (declared with Mockito
    // annotations @Mock and @Captor)
    MockitoAnnotations.openMocks(this);

    // Setup database
    MongoCollection<Document> gameDocuments = db.getCollection("games");
    gameDocuments.drop();
    List<Document> testGames = new ArrayList<>();
    testGames.add(
        new Document()
            .append("joincode", "1234"));
    testGames.add(
        new Document()
            .append("joincode", "5678"));
    testGames.add(
        new Document()
            .append("joincode", "5555"));
    gameId = new ObjectId();
    BsonArray thePlayers = new BsonArray();
    thePlayers.add(new BsonString("Kristin"));
    thePlayers.add(new BsonString("Jeff"));
    Document sam = new Document()
        .append("_id", gameId)
        .append("joincode", "0000")
        .append("players", thePlayers)
        .append("currentRound", 0);

    gameDocuments.insertMany(testGames);
    gameDocuments.insertOne(sam);

    gameController = new GameController(db);
  }

  @Test
  void addsRoutes() {
    Javalin mockServer = mock(Javalin.class);
    gameController.addRoutes(mockServer);
    verify(mockServer, Mockito.atLeastOnce()).get(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).post(any(), any());
    verify(mockServer, Mockito.atLeastOnce()).put(any(), any());
  }

  @Test
  void getGameWithExistentId() throws IOException {
    String id = gameId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    gameController.getGame(ctx);

    verify(ctx).json(gameCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals("0000", gameCaptor.getValue().joincode);
    assertEquals(gameId.toHexString(), gameCaptor.getValue()._id);
  }

  @Test
  void getGameWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      gameController.getGame(ctx);
    });

    assertEquals("The requested game id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getGameWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      gameController.getGame(ctx);
    });

    assertEquals("The requested game was not found", exception.getMessage());
  }


  @Test
  void addGame() throws IOException {
    // Create a new game to add
    Game newGame = new Game();
    newGame.joincode = "1234";

    // Use `javalinJackson` to convert the `Game` object to a JSON string representing that game.
    // This would be equivalent to:
    //   String newGame = """
    //       {
    //         "joincode": "1234",
    //       }
    //       """;
    // but using `javalinJackson` to generate the JSON avoids repeating all the field values,
    // which is then less error prone.
    String newGameJson = javalinJackson.toJsonString(newGame, Game.class);

    // A `BodyValidator` needs
    //   - The string (`newGameJson`) being validated
    //   - The class (`Game.class) it's trying to generate from that string
    //   - A function (`() -> Game`) which "shows" the validator how to convert
    //     the JSON string to a `Game` object. We'll again use `javalinJackson`,
    //     but in the other direction.
    when(ctx.bodyValidator(Game.class))
      .thenReturn(new BodyValidator<Game>(newGameJson, Game.class,
                    () -> javalinJackson.fromJsonString(newGameJson, Game.class)));

    gameController.addNewGame(ctx);
    verify(ctx).json(mapCaptor.capture());

    // Our status should be 201, i.e., our new game was successfully created.
    verify(ctx).status(HttpStatus.CREATED);

    // Verify that the game was added to the database with the correct ID
    Document addedGame = db.getCollection("games")
        .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    // Successfully adding the game should return the newly generated, non-empty
    // MongoDB ID for that game.
    assertNotEquals("", addedGame.get("_id"));
    // The new game in the database (`addedGame`) should have the same
    // field values as the game we asked it to add (`newGame`).
    assertEquals(newGame.joincode, addedGame.get(GameController.JOINCODE_KEY));
  }

  @Test
  void addPlayerToGame() {
    String id = gameId.toHexString();
    // What should the test pretend are the values in the path parameters?
    when(ctx.pathParam("id")).thenReturn(id);
    when(ctx.pathParam("playerName")).thenReturn("Nic");

    gameController.addPlayerToGame(ctx);

    // capture the game returned from this put request
    verify(ctx).json(gameCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(gameId.toHexString(), gameCaptor.getValue()._id);
    assertEquals("0000", gameCaptor.getValue().joincode);
    assertEquals(0, gameCaptor.getValue().currentRound);
    assertTrue(gameCaptor.getValue().players[0].equals("Kristin"));

  }
}
