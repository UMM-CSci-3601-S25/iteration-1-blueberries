import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { of } from 'rxjs';

import { GameService } from './game.service';
import { Game } from './game';

describe('GameService', () => {
  let gameService: GameService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const testGames: Game[] =[
    {
      _id: 'kkGameId',
      joincode: '111',
      players: [ 'KK', 'Jeff', 'Maura', 'Anne' ],
      currentRound: 0
    },
    {
      _id: 'aaronGameId',
      joincode: '222',
      players: [ 'Aaron', 'Bob', 'Carol', 'Dan' ],
      currentRound: 0
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    // Construct an instance of the service with the mock
    // HTTP client.
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    gameService = new GameService(httpClient);

    //userService = new UserService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });


  describe('When getUserById() is given an ID', () => {
    /* We really don't care what `getGameById()` returns. Since all the
      * interesting work is happening on the server, `getGameById()`
      * is really just a "pass through" that returns whatever it receives,
      * without any "post processing" or manipulation. The test in this
      * `describe` confirms that the HTTP request is properly formed
      * and sent out in the world, but we don't _really_ care about
      * what `getGameById()` returns as long as it's what the HTTP
      * request returns.
      *
      * So in this test, we'll keep it simple and have
      * the (mocked) HTTP request return the `targetGame`
      * Furthermore, we won't actually check what got returned (there won't be an `expect`
      * about the returned value). Since we don't use the returned value in this test,
      * It might also be fine to not bother making the mock return it.
      */
    it('calls api/games/id with the correct ID', waitForAsync(() => {
      // We're just picking a User "at random" from our little
      // set of Users up at the top.
      const targetGame: Game = testGames[1];
      const targetId: string = targetGame._id;

      // Mock the `httpClient.get()` method so that instead of making an HTTP request
      // it just returns one user from our test data
      const mockedMethod = spyOn(httpClient, 'get').and.returnValue(of(targetGame));

      // Call `gameService.getGameById()` and confirm that the correct call has
      // been made with the correct arguments.
      //
      // We have to `subscribe()` to the `Observable` returned by `getUserById()`.
      // The `user` argument in the function below is the thing of type User returned by
      // the call to `getGameById()`.
      gameService.getGameById(targetId).subscribe(() => {
        // The `Game` returned by `getGameById()` should be targetGame, but
        // we don't bother with an `expect` here since we don't care what was returned.
        expect(mockedMethod)
          .withContext('one call')
          .toHaveBeenCalledTimes(1);
        expect(mockedMethod)
          .withContext('talks to the correct endpoint')
          .toHaveBeenCalledWith(`${gameService.gameUrl}/${targetId}`);
      });
    }));
  });

});
