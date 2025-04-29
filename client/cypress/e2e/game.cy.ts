import { GamePage } from '../support/game.po';

const page = new GamePage();

describe('Game', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should show all four players for this game', () => {
    page.getPlayers().should('have.lengthOf', 4);
  });

  it('Should update the list of players when one is added', () => {
    cy.task("connect");
    cy.url().then((url) => {
      const aGameId = url.split("/").reverse()[0];
      cy.task('addPlayer', {
        type: 'ADD_PLAYER',
        gameId: aGameId,
        playerName: 'Yvonne',
      })
    });
    page.getPlayers().should('have.lengthOf', 5);
  });

})
