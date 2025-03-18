import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GameService } from './game.service';
import { WebSocketService } from './web-socket.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
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
  game = toSignal(
    this.route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('id')),
      switchMap((id: string) => this.gameService.getGameById(id)),
      catchError((_err) => {
        this.error.set({
          help: 'There was a problem loading the game – try again.',
          httpResponse: _err.message,
          message: _err.error?.title,
        });
        return of();
      })
    )
  );
  // The `error` will initially have empty strings for all its components.
  error = signal({ help: '', httpResponse: '', message: '' });

  constructor() {
    this.webSocketService.getMessage().subscribe((message: unknown) => {
      const msg = message as {
        type?: string;
        player?: string;
        game?: Game;
      }; // all of these are optional to allow heartbeat messages to pass through

      if (
        msg.type === 'ADD_PLAYER'
      ) {
        this.gameService.addPlayer(msg.player, msg.game);
      }
    });
  }

  onPlayerAdd(event: { player: string }) {
    const message = {
      type: 'ADD_PLAYER',
      player: event.player,
      game: this.game,
    };

    this.webSocketService.sendMessage(message);
  }

}
