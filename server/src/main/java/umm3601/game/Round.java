package umm3601.game;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})
public class Round {

  @ObjectId @Id
  // By default Java field names shouldn't start with underscores.
  // Here, though, we *have* to use the name `_id` to match the
  // name of the field as used by MongoDB.
  @SuppressWarnings({"MemberName"})
  public String _id;

  public String[] players;
  public String judge;
  public String prompt;
  //public Response[] responses;
  //public Response winningResponse;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Round)) {
      return false;
    }
    Round other = (Round) obj;
    return _id.equals(other._id);
  }

  @Override
  public int hashCode() {
    // This means that equal Users will hash the same, which is good.
    return _id.hashCode();
  }

  @Override
  public String toString() {
    return "A round with judge: " + judge + ", and " + players.toString();
  }
}

