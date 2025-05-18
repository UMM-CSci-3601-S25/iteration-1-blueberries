import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from './game.service';
import { WebSocketService } from './web-socket.service';
import { MatListModule } from '@angular/material/list';
import { Game } from './game';

@Component({
  selector: 'app-game',
  imports: [
    MatListModule,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  webSocketService = inject(WebSocketService);
  gameService = inject(GameService);
  route = inject(ActivatedRoute);
  game = signal<Game | null>(null);
  gameId: string = this.route.snapshot.params['id'];

  error = signal({ help: '', httpResponse: '', message: '' });

  constructor() {
    // I'm unsure if this is the best way to set the initial value of the signal.
    // I have noticed people seem to avoid putting things in the constructor
    this.gameService.getGameById(this.gameId).subscribe(
      (response) => {
        this.game.set(response);
      });

    this.webSocketService.getMessage().subscribe((message: unknown) => {
      const msg = message as {
        type?: string;
        gameId?: string;
        playerName?: string;
      };
      // This comment and much of how the websockets stuff works comes from
      // https://github.com/UMM-CSci-3601-F24/it-3-mary-shellys-cool-1918-howard-frankendogs-football-team/tree/main
      // "all of these are optional to allow heartbeat messages to pass through",
      // but I (KK) haven't done anything with heartbeat stuff yet... apparently it helps keep things connected

      if (this.game()) { // only update a game if this component has a game object already in view
        if (
        // The websocket message is about adding a player and refers to
        // the game this GameComponent is displaying
          msg.type === 'ADD_PLAYER' &&
          msg.gameId === this.gameId
        ) {
          // console.log("client received broadcast for game: " + msg.gameId + " to add: " + msg.playerName);
          this.game.update(currentGame => ({...currentGame, players: [...currentGame.players, `${msg.playerName} boom!`] }));
          // console.log("GameComponent: " + this + " added player: " + msg.playerName);
          //
          // Google Generative AI with prompt/search: "angular 19 update a property of a signal where the
          // property is an array, without changing the object directly"
          //
          // told me: The update method receives the current value of the signal.
          // A new object is then created, with the players array being replaced by a new array.
          // This new array is created by "spreading the old array" (that's what the `...` does) and adding a new element,
          // ensuring that the original array is not modified.
          //
          // Basically, the update says, "Hey, you have access to the old game as it was...
          // I want you to keep all the old stuff from that game, but update the players array
          // to be a new array that includes all the old players plus the new player",
          // which ensures *immutability*, which is crucial for Angular signals to detect changes.
          // (I previously was editing the old array more directly using 'push'.)
        }
      }
    });
  }
}
