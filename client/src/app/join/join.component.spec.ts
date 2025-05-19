import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { Location } from '@angular/common';
import { JoinComponent } from './join.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { GameService } from '../game/game.service';
import { MockGameService } from 'src/testing/game.service.mock';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { GameComponent } from '../game/game.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { Game } from '../game/game';

describe('JoinComponent', () => {
  let component: JoinComponent;
  let joinGameForm: FormGroup;
  let fixture: ComponentFixture<JoinComponent>;

  beforeEach(() => {
    TestBed.overrideProvider(GameService, { useValue: new MockGameService() });
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
          { path: 'games/1', component: GameComponent }
        ]),
        JoinComponent
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
      .compileComponents().catch(error => {
        expect(error).toBeNull();
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    joinGameForm = component.joinGameForm;
    TestBed.inject(HttpTestingController);
    expect(joinGameForm).toBeDefined();
    expect(joinGameForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      // The type statement is needed to ensure that `controlName` isn't just any
      // random string, but rather one of the keys of the `joinGameValidationMessages`
      // map in the component.
      const controlName: keyof typeof component.joinGameValidationMessages = 'gameId';
      component.joinGameForm.get(controlName).setErrors({'required': true});
      expect(component.getErrorMessage(controlName)).toEqual('Game ID is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      // The type statement is needed to ensure that `controlName` isn't just any
      // random string, but rather one of the keys of the `joinGameValidationMessages`
      // map in the component.
      const controlName: keyof typeof component.joinGameValidationMessages = 'gameId';
      component.joinGameForm.get(controlName).setErrors({'unknown': true});
      expect(component.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  })
});

describe('JoinGameComponent#submitForm()', () => {
  let component: JoinComponent;
  let fixture: ComponentFixture<JoinComponent>;
  let gameService: GameService;
  let location: Location;
  let expectedGame: Game;


  beforeEach(() => {
    TestBed.overrideProvider(GameService, { useValue: new MockGameService() });
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
          { path: 'games/111222333444555666777888', component: GameComponent }
        ]),
        JoinComponent, GameComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService);
    location = TestBed.inject(Location);
    // We need to inject the router and the HttpTestingController, but
    // never need to use them. So, we can just inject them into the TestBed
    // and ignore the returned values.
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    TestBed.runInInjectionContext(() => {
      expectedGame = {
        _id: '111222333444555666777888',
        joincode: '111',
        players: ['Kristin'],
        currentRound: 0
      };
    })
    fixture.detectChanges();
  });

  beforeEach(() => {
    // Set up the form with valid values.
    // We don't actually have to do this, but it does mean that when we
    // check that `submitForm()` is called with the right arguments below,
    // we have some reason to believe that that wasn't passing "by accident".
    component.joinGameForm.controls.gameId.setValue('111222333444555666777888');
    component.joinGameForm.controls.playerName.setValue('Kristin');
  });

  it('should call addGame() and handle success response', fakeAsync(() => {
    fixture.ngZone.run(() => {
      // make a spy that is waiting for addGame to be called so it can return '1'
      const addPlayerSpy = spyOn(gameService, 'addPlayer').and.returnValue(of(expectedGame));
      component.submitForm();
      expect(addPlayerSpy).toHaveBeenCalledWith(component.joinGameForm.value.gameId, component.joinGameForm.value.playerName);
      tick();
      expect(location.path()).toBe('/games/111222333444555666777888');
      flush();
    });
  }));

  it('should call addPlayer() and handle error response for illegal game', () => {
    // Save the original path so we can check that it doesn't change.
    const path = location.path();
    // A canned error response to be returned by the spy.
    const errorResponse = { status: 400, message: 'Illegal game error' };
    // "Spy" on the `.addPlayer()` method in the game service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const joinGameSpy = spyOn(gameService, 'addPlayer')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    // Check that `.addPlayer()` was called with the form's values which we set
    // up above.
    expect(joinGameSpy).toHaveBeenCalledWith(
      component.joinGameForm.controls.gameId.value,
      component.joinGameForm.controls.playerName.value,
    );
    // Confirm that we're still at the same path.
    expect(location.path()).toBe(path);
  });

  it('should call addPlayer() and handle server error response if it arises', () => {
    // Save the original path so we can check that it doesn't change.
    const path = location.path();
    // A canned error response to be returned by the spy.
    const errorResponse = { status: 500, message: 'Server error' };
    // "Spy" on the `.joinGame()` method in the game service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const joinGameSpy = spyOn(gameService, 'addPlayer')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    // Check that `.joinGame()` was called with the form's values which we set
    // up above.
    expect(joinGameSpy).toHaveBeenCalledWith(
      component.joinGameForm.controls.gameId.value,
      component.joinGameForm.controls.playerName.value,
    );
    // Confirm that we're still at the same path.
    expect(location.path()).toBe(path);
  });

  it('should call addPlayer() and handle unexpected error response if it arises', () => {
    // Save the original path so we can check that it doesn't change.
    const path = location.path();
    // A canned error response to be returned by the spy.
    const errorResponse = { status: 404, message: 'Not found' };
    // "Spy" on the `.joinGame()` method in the game service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const joinGameSpy = spyOn(gameService, 'addPlayer')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    // Check that `.joinGame()` was called with the form's values which we set
    // up above.
    expect(joinGameSpy).toHaveBeenCalledWith(
      component.joinGameForm.controls.gameId.value,
      component.joinGameForm.controls.playerName.value,
    );
    // Confirm that we're still at the same path.
    expect(location.path()).toBe(path);
  });
});

