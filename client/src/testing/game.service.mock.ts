import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { Game } from '../app/game/game';
import { GameService } from '../app/game/game.service';

/**
 * A "mock" version of the `GameService` that can be used to test components
 * without having to create an actual service. It needs to be `Injectable` since
 * that's how services are typically provided to components.
 */
@Injectable({
  providedIn: AppComponent
})
export class MockGameService extends GameService {
  static testGames: Game[] =[
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

  constructor() {
    super(null);
  }

  // skipcq: JS-0105
  getGameById(id: string): Observable<Game> {
    // If the specified ID is for the first test game,
    // return that game, otherwise return `null` so
    // we can test illegal game requests.
    // If you need more, just add those in too.
    if (id !== MockGameService.testGames[0]._id) {
      return of(null);
    }
  }
}
