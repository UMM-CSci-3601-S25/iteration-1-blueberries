import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Game } from './game';
import { map, Observable } from 'rxjs';

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

  addPlayer(newPlayer: string, game: Game) {
    game.players = game.players.concat(newPlayer);
  }
}
