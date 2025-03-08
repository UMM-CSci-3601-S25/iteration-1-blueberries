import { Round } from "./round";

export interface Game {
  _id: string;
  joincode: string;
  players: string[];
  currentRound: number;
  rounds?: Round[];
}
