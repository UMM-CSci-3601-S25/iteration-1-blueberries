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
    // initially, Yvonne is not one of the players
    page.getPlayers().should('not.include.text', 'Yvonne');
    // send a websocket message like you would if another client added a new player 'Yvonne'
    cy.url().then((url) => {
      const aGameId = url.split("/").reverse()[0];
      cy.task('addPlayer', {
        type: 'ADD_PLAYER',
        gameId: aGameId,
        playerName: 'Yvonne',
      })
    });
    // this client (this page) should reflect that change (increased number of players)
    page.getPlayers().should('have.lengthOf', 5);
    // Yvonne will show as a player (even though *this* client didn't initiate that change)
    page.getPlayers().should('include.text', 'Yvonne');
  });

})
