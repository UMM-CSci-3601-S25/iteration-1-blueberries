export interface Round {
  _id: string;
  players: string[];
  responses: Response[];
  judge: string; // will be one of the strings from players
}
