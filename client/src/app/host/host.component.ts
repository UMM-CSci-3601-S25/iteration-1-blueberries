import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GameService } from '../game/game.service';
import { WebSocketService } from '../game/web-socket.service';

@Component({
  selector: 'app-host',
  imports:
    [
      FormsModule,
      ReactiveFormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule
    ],
  templateUrl: './host.component.html',
  styleUrl: './host.component.scss'
})
export class HostComponent {

  addGameForm = new FormGroup({
    // We allow alphanumeric input and limit the length for name.
    joincode: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      // Long join codes are very inconvenient
      Validators.maxLength(10),
    ])),
    playerName: new FormControl('', Validators.compose([
      Validators.required,
      Validators.minLength(2),
      // length of the player name must be 2-100 characters
      Validators.maxLength(100),
    ])),
  });

  readonly addGameValidationMessages = {
    joincode: [
      {type: 'required', message: 'Join code is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 10 characters long'},
    ],
    playerName: [
      {type: 'required', message: 'Player name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 100 characters long'},
    ],
  };

  constructor(
    private webSocketService: WebSocketService,
    private gameService: GameService,
    private snackBar: MatSnackBar,
    private router: Router) {
  }

  formControlHasError(controlName: string): boolean {
    return this.addGameForm.get(controlName).invalid &&
      (this.addGameForm.get(controlName).dirty || this.addGameForm.get(controlName).touched);
  }

  getErrorMessage(name: keyof typeof this.addGameValidationMessages): string {
    for(const {type, message} of this.addGameValidationMessages[name]) {
      if (this.addGameForm.get(name).hasError(type)) {
        return message;
      }
    }
    return 'Unknown error';
  }

  submitForm() {
    // Make a new game with the host as the only initial player using the joincode the host chose
    // And, since we are using the id for the game, the joincode is probably not needed, but I (KK)
    // made joincode required in several places and haven't removed it yet (might still be useful
    // for something since it's much easier to recognize than the id). I initially also sent a
    // websocket message from here and I don't think we need to since this will be the first person
    // joining and the game will be brand new (this is almost like the join page, but without websocket stuff)
    this.gameService.addGame({joincode: this.addGameForm.value.joincode, players: [`${this.addGameForm.value.playerName}`], currentRound: 0}).subscribe({
      next: (newId) => {
        this.snackBar.open(
          `Added game with join code: ${this.addGameForm.value.joincode}`,
          null,
          { duration: 2000 }
        );
        this.router.navigate(['/games/', newId]);
        this.onFirstPlayerAdd(newId);
      },
      error: (err) => {
        if (err.status === 400) {
          this.snackBar.open(
            `Tried to add and host an illegal new game – Error Code: ${err.status}\nMessage: ${err.message}`,
            'OK',
            { duration: 5000 }
          );
        } else if (err.status === 500) {
          this.snackBar.open(
            `The server failed to process your request to add a new game to host. Is the server up? – Error Code: ${err.status}\nMessage: ${err.message}`,
            'OK',
            { duration: 5000 }
          );
        } else {
          this.snackBar.open(
            `An unexpected error occurred – Error Code: ${err.status}\nMessage: ${err.message}`,
            'OK',
            { duration: 5000 }
          );
        }
      },
    });
  }

  onFirstPlayerAdd(newId: string) {
    // Send a websocket message to add the first player to the game
    const message = {
      type: 'ADD_PLAYER_FIRST',
      gameId: newId,
      playerName: this.addGameForm.value.playerName,
    };

    this.webSocketService.sendMessage(message);
    sessionStorage.setItem('gameId', newId);
    // we probably won't want to (ultimately) store the player name in session storage,
    // but for now we will since we don't have a player object yet (from which to get an id)
    sessionStorage.setItem('playerName', this.addGameForm.value.playerName);
    sessionStorage.setItem('isHost', 'true');
    sessionStorage.setItem('isJudge', 'true');
    sessionStorage.setItem('roundsWon', '0');
  }
}
