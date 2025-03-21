package umm3601.game;

import static com.mongodb.client.model.Filters.eq;

import java.util.Map;

import org.bson.UuidRepresentation;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.MongoException;
import com.mongodb.MongoWriteConcernException;
import com.mongodb.MongoWriteException;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Updates;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

/**
 * Controller that manages requests for info about games.
 */
public class GameController implements Controller {

  private static final String API_GAMES = "/api/games";
  private static final String API_GAME_BY_ID = "/api/games/{id}";
  private static final String API_ADD_PLAYER = "/api/games/{id}/{player}";
  static final String JOINCODE_KEY = "joincode";
  private final JacksonMongoCollection<Game> gameCollection;

  /**
   * Construct a controller for games.
   *
   * @param database the database containing game data
   */
  public GameController(MongoDatabase database) {
    gameCollection = JacksonMongoCollection.builder().build(
        database,
        "games",
        Game.class,
        UuidRepresentation.STANDARD);
  }

  /**
   * Set the JSON body of the response to be the single game
   * specified by the `id` parameter in the request
   *
   * @param ctx a Javalin HTTP context
   */
  public void getGame(Context ctx) {
    String id = ctx.pathParam("id");
    Game game;

    try {
      game = gameCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested game id wasn't a legal Mongo Object ID.");
    }
    if (game == null) {
      throw new NotFoundResponse("The requested game was not found");
    } else {
      ctx.json(game);
      ctx.status(HttpStatus.OK);
    }
  }

  /**
   * Add a new game using information from the context
   * (as long as the information gives "legal" values to Game fields)
   *
   * @param ctx a Javalin HTTP context that provides the game info
   *  in the JSON body of the request
   */
  public void addNewGame(Context ctx) {
    /*
     * The following chain of statements uses the Javalin validator system
     * to verify that instance of `Game` provided in this context is
     * a "legal" game. It checks the following things (in order):
     *
     * If any of these checks fail, the Javalin system will throw a
     * `BadRequestResponse` with an appropriate error message.
     */
    String body = ctx.body();
    Game newGame = ctx.bodyValidator(Game.class)
    .check(usr -> usr.joincode != null && usr.joincode.length() > 0,
        "Game must have a non-empty join code; body was " + body)
      .get();

    newGame.currentRound = 0;

    // Add the new game to the database
    gameCollection.insertOne(newGame);

    // Set the JSON response to be the `_id` of the newly created game.
    // This gives the client the opportunity to know the ID of the new game,
    // which it can then use to perform further operations (e.g., a GET request
    // to get and display the details of the new game).
    ctx.json(Map.of("id", newGame._id));
    // 201 (`HttpStatus.CREATED`) is the HTTP code for when we successfully
    // create a new resource (a game in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpStatus.CREATED);
  }

  /**
   * Add a player string to the array of players for the game
   * (as long as the information gives "legal" values to Game fields)
   *
   * @param ctx a Javalin HTTP context that provides the game info
   *  in the JSON body of the request
   */
  public void addPlayerToGame(Context ctx) {
    String id = ctx.pathParam("id");
    String newPlayer = ctx.pathParam("player");
    try {
      Game theGameToUpdate = gameCollection.findOneById(id);
      // Updates.addToSet documentation can be found here:
      // https://www.mongodb.com/docs/manual/reference/operator/update/addToSet/
      gameCollection.updateById(id, Updates.addToSet("players", newPlayer));
      theGameToUpdate = gameCollection.findOneById(id);
      ctx.json(theGameToUpdate);
      // 201 (`HttpStatus.CREATED`) is the HTTP code for when we successfully
      // create a new resource. In this case, we are updating a game, so maybe should be "OK" instead.
      // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      // for a description of the various response codes.
      ctx.status(HttpStatus.CREATED);
      // There are various exceptions that mongo might throw, and I wanted different messages for them, but probably
      // we won't really need to have quite this many. The illegal argument response has been helpful.
    } catch (MongoWriteException mwe) {
      throw new BadRequestResponse("the write failed due some other failure specific to the update command");
    } catch (MongoWriteConcernException mwc) {
      throw new BadRequestResponse("the write failed due being unable to fulfill the write concern");
    } catch (MongoException mongoException) {
      throw new NotFoundResponse("That game is not in the game collection (or, possibly some other error)");
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("An argument was illegal -- be sure you are requesting to add to a legal game id (24 character hex code)");
    }
  }

  /**
   * Sets up routes for the `game` collection endpoints.
   * A GameController instance handles the game endpoints,
   * and the addRoutes method adds the routes to this controller.
   *
   * GROUPS SHOULD CREATE THEIR OWN CONTROLLERS THAT IMPLEMENT THE
   * `Controller` INTERFACE FOR WHATEVER DATA THEY'RE WORKING WITH.
   * You'll then implement the `addRoutes` method for that controller,
   * which will set up the routes for that data. The `Server#setupRoutes`
   * method will then call `addRoutes` for each controller, which will
   * add the routes for that controller's data.
   *
   * @param server The Javalin server instance
   */
  @Override
  public void addRoutes(Javalin server) {
    // Get the specified game
    server.get(API_GAME_BY_ID, this::getGame);

    // Add new game with the game info being in the JSON body
    // of the HTTP request (if any)
    server.post(API_GAMES, this::addNewGame);

    // I (KK) modeled this after editWordList here:
    // https://github.com/kidstech/word-river/blob/main/server/src/main/java/umm3601/Server.java
    // Edits a Word list
    // server.put("/api/packs/:id/:name", wordRiverController::editWordList);
    // which uses path parameters (not sure if there was a switch from : to {} for that at some point)
    server.put(API_ADD_PLAYER, this::addPlayerToGame);
  }
}

