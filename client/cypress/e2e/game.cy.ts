import { GamePage } from '../support/game.po';

const page = new GamePage();

describe('Game', () => {

  before(() => {
    cy.task('seed:database');
  })

  beforeEach(() => {
    page.navigateTo();
  })

  it('Should show all four players for this game', () => {
    page.getPlayers().should('have.lengthOf', 4);
  })

})
