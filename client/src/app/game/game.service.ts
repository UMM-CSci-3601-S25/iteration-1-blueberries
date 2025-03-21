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
   * @returns an `Observable` containing the resulting game.
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

  // Much of the structure of the addPlayer method is modeled after editWordList in this repo:
  // https://github.com/kidstech/word-river/blob/main/client/src/app/services/wordlist.service.ts
  // editWordList(name: string, wordList: WordList, id: string): Observable<WordList> {
  //   return this.httpClient.put<WordList>(this.wordListUrl + id + '/' + name, wordList).pipe(map(res => res));
  // }
  //
  // One thing I (KK) am still not sure about is this use of path parameters versus using a body for the request
  // or using query parameters (seems like query parameters are more for "get" operations)
  addPlayer(gameId: string, newPlayer: string): Observable<Game> {
    // Look at the game with the given id, take all the values, but update the players to add the new one
    return this.httpClient.put<Game>(`${this.gameUrl}/${gameId}/${newPlayer}`, null);
  }
}
