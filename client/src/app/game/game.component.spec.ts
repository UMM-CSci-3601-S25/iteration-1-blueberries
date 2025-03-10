import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameComponent } from './game.component';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameService } from './game.service';
import { MockGameService } from 'src/testing/game.service.mock';
import { RouterModule } from '@angular/router';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  //let gameService: GameService;

  beforeEach(() => {
    TestBed.overrideProvider(GameService, { useValue: new MockGameService() });
    TestBed.configureTestingModule({
      imports: [
        GameComponent,
        MatListModule,
        BrowserAnimationsModule,
        RouterModule.forRoot([
          { path: 'games/1', component: GameComponent}
        ]),
      ],
    }).compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    //gameService = TestBed.inject(GameService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
