export class GamePage {

  // Use this specific entry in the games collection for these tests
  private readonly url = '/games/588935f5597715f06f3e8f6c'
  private readonly player = '[data-test="player"]';

  navigateTo() {
    return cy.visit(this.url);
  }

  getPlayers() {
    return cy.get(this.player);
  }
}
