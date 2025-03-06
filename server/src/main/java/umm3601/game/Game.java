package umm3601.game;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Game {

  @ObjectId @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  @SuppressWarnings({"MemberName"})
  public String _id;

  public String joincode;
  public String[] players;
  public Round[] rounds;
  public int currentRound;
  //public int rounds; //optional - how many rounds to have

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Game)) {
      return false;
    }
    Game other = (Game) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    // This means that equal Games will hash the same, which is good.
    return _id.hashCode();
  }

  @Override
  public String toString() {
    return "A game with joincode: " + joincode + ", and " + players.length + " players.";
  }
}
