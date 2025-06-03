import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { By } from '@angular/platform-browser';
import { HomeComponent } from './home.component';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockGameService } from '../../testing/game.service.mock';
import { GameService } from '../game/game.service';
import { ActivatedRoute } from '@angular/router';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  const mockGameService = new MockGameService();
  const chrisId = 'chris_id';
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub({
  // Using the constructor here lets us try that branch in `activated-route-stub.ts`
  // and then we can choose a new parameter map in the tests if we choose
    id: chrisId,
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule, HomeComponent],
      providers: [
        { provide: GameService, useValue: mockGameService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    });

    fixture = TestBed.createComponent(HomeComponent);

    component = fixture.componentInstance; // BannerComponent test instance

    // query for the link (<a> tag) by CSS element selector
    de = fixture.debugElement.query(By.css('[data-test=hostButton]'));
    el = de.nativeElement;
  });

  it('It has the basic home page text', () => {
    fixture.detectChanges();
    expect(el.textContent).toContain('Host');
    expect(component).toBeTruthy();
  });

});
