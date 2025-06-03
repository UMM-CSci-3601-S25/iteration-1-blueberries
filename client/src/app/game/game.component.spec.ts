import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameService } from './game.service';
import { MockGameService } from 'src/testing/game.service.mock';
import { RouterModule } from '@angular/router';
import { Game } from './game';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  const mockGameService = new MockGameService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        GameComponent,
        MatListModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
          { path: 'games/kkGameId', component: GameComponent}
        ]),
      ],
      providers: [
        { provide: GameService, useValue: mockGameService },
      ]
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should have a game service', () => {
    fixture.detectChanges();
    expect(component.gameService).toBeTruthy();
  });

  it('should navigate to a specific gameComponent', () => {
    const expectedGame: Game = MockGameService.testGames[0];
    // The game is a writable signal. We will set it and then check it.
    fixture.componentRef.instance.game.set(expectedGame);
    fixture.detectChanges();
    expect(component.game()).toEqual(expectedGame);
  });
});
