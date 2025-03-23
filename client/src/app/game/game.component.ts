import { Component, computed, inject, signal } from '@angular/core';
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

      if (
        // The websocket message is about adding a player and refers to
        // the game this GameComponent is displaying
        // (note: it may make more sense to look at how the websocket messaging
        // works and only broadcast to clients that are associated with *this* game,
        // but I don't know how to do that yet)
        msg.type === 'ADD_PLAYER' &&
        msg.gameId === this.gameId
      ) {
        this.updateGame(msg.playerName);
        //this.game().currentRound = this.game().currentRound + 1;
        console.log("client received broadcast for game: " + msg.gameId + " to add: " + msg.playerName);
        console.log("The game in this component is: " + this.game());
        //this.gameService.addPlayer(msg.gameId, msg.playerName);
      }
    });
  }

  // probably, this will be updated to have optional inputs about all the ways a game could change
  // and those things will be labeled and in a {}, but for now it's just one way to update
  updateGame(playerName: string) {
    // only push a new player to the array if the updateGame method was called from
    // someplace that has a game (if game is null, don't try to push to players array)
    if (this.game()) {
      // and, only push the new player if it hasn't happened yet
      // (without this, sometimes we get two of the new name)
      if (!this.game().players.includes(playerName)) {
        this.game().players.push(playerName);
      }
    }
    // send a note that the game was updated (only happens if game has changed)
    // turns out that we don't need to send this notice to the signal... it notices the change
    return computed(() => this.game());
  }
}
