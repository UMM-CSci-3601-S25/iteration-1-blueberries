import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { HostComponent } from './host.component';
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
import { throwError } from 'rxjs';

describe('HostComponent', () => {
  let component: HostComponent;
  let addGameForm: FormGroup;
  let fixture: ComponentFixture<HostComponent>;

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
        HostComponent
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
      .compileComponents().catch(error => {
        expect(error).toBeNull();
      });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    addGameForm = component.addGameForm;
    TestBed.inject(HttpTestingController);
    expect(addGameForm).toBeDefined();
    expect(addGameForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getErrorMessage()', () => {
    it('should return the correct error message', () => {
      // The type statement is needed to ensure that `controlName` isn't just any
      // random string, but rather one of the keys of the `addUserValidationMessages`
      // map in the component.
      const controlName: keyof typeof component.addGameValidationMessages = 'joincode';
      component.addGameForm.get(controlName).setErrors({'required': true});
      expect(component.getErrorMessage(controlName)).toEqual('Join code is required');
    });

    it('should return "Unknown error" if no error message is found', () => {
      // The type statement is needed to ensure that `controlName` isn't just any
      // random string, but rather one of the keys of the `addGameValidationMessages`
      // map in the component.
      const controlName: keyof typeof component.addGameValidationMessages = 'joincode';
      component.addGameForm.get(controlName).setErrors({'unknown': true});
      expect(component.getErrorMessage(controlName)).toEqual('Unknown error');
    });
  })
});

describe('AddUserComponent#submitForm()', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let gameService: GameService;
  let location: Location;


  beforeEach(() => {
    TestBed.overrideProvider(GameService, { useValue: new MockGameService() });
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
          { path: 'games/1', component: GameComponent }
        ]),
        HostComponent, GameComponent],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    gameService = TestBed.inject(GameService);
    location = TestBed.inject(Location);
    // We need to inject the router and the HttpTestingController, but
    // never need to use them. So, we can just inject them into the TestBed
    // and ignore the returned values.
    TestBed.inject(Router);
    TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  beforeEach(() => {
    // Set up the form with valid values.
    // We don't actually have to do this, but it does mean that when we
    // check that `submitForm()` is called with the right arguments below,
    // we have some reason to believe that that wasn't passing "by accident".
    component.addGameForm.controls.joincode.setValue('111');
  });

  it('should call addGame() and handle error response for illegal game', () => {
    // Save the original path so we can check that it doesn't change.
    const path = location.path();
    // A canned error response to be returned by the spy.
    const errorResponse = { status: 400, message: 'Illegal game error' };
    // "Spy" on the `.addUser()` method in the user service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const addGameSpy = spyOn(gameService, 'addGame')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    // Check that `.addUser()` was called with the form's values which we set
    // up above.
    expect(addGameSpy).toHaveBeenCalledWith(component.addGameForm.value);
    // Confirm that we're still at the same path.
    expect(location.path()).toBe(path);
  });

  it('should call addGame() and handle unexpected error response if it arises', () => {
    // Save the original path so we can check that it doesn't change.
    const path = location.path();
    // A canned error response to be returned by the spy.
    const errorResponse = { status: 404, message: 'Not found' };
    // "Spy" on the `.addUser()` method in the user service. Here we basically
    // intercept any calls to that method and return the error response
    // defined above.
    const addGameSpy = spyOn(gameService, 'addGame')
      .and
      .returnValue(throwError(() => errorResponse));
    component.submitForm();
    // Check that `.addUser()` was called with the form's values which we set
    // up above.
    expect(addGameSpy).toHaveBeenCalledWith(component.addGameForm.value);
    // Confirm that we're still at the same path.
    expect(location.path()).toBe(path);
  });
});
