import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from './game';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ProjectDefinitionCollection } from '@angular-devkit/core/src/workspace';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // The URL for the games part of the server API.
  readonly gameUrl: string = `${environment.apiUrl}games`;

  constructor(private httpClient: HttpClient) { }

  /**
   * Get the `Game` with the specified ID.
   *
   * @param id the ID of the desired game
   * @returns an `Observable` containing the resulting user.
   */
  getGameById(id: string): Observable<Game> {
    // The input to get could also be written as (this.userUrl + '/' + id)
    return this.httpClient.get<Game>(`${this.gameUrl}/${id}`);
  }

  addGame(newGame: Partial<Game>): Observable<string> {
    // Send post request to add a new game with the game data as the body.
    // `res.id` should be the MongoDB ID of the newly added `Game`.
    return this.httpClient.post<{id: string}>(this.gameUrl, newGame).pipe(map(response => response.id));
  }

  addPlayer(gameId: string, newPlayer: string): Observable<string[]> {
    const game = this.getGameById(gameId).pipe(map(value => value));
    // Look at the game with the given id, take all the values, but update the players to add the new one
    const gamePartial: Partial<Game> = {
      _id: gameId,
      joincode: game().joincode,
      players: game.players.concat(newPlayer),
      currentRound: game.currentRound,
      rounds: game.rounds,
    }
    return this.httpClient.post<Game>(this.gameUrl, gamePartial).pipe(map(response => response.players));
  }
}
