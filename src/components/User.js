import React from "react";
import leaderboard from "../assets/leaderboard.png";

class User extends React.Component {
  render() {
    if (this.props.userRanking === 0) {
      console.log("in user");
      return (
        <div>
        <div className="leadertext">
         <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
         <span>Leaderboard</span>
      </div>
      <ul>
        <b>
        <li>1. User1</li>
        <li>2. User2</li>
        <li>3. User3</li>
        <li>4. User4</li>
        <li>5. User5</li>
        </b>
      </ul>
      </div>
      );
    } else {
      return (
        <div>
        <div className="leadertext">
           <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
           <span>Leaderboard</span>
        </div>
        <ul>
          <b>
          <li>1. User1</li>
          <li>2. User2</li>
          <li>3. User3</li>
          <li>4. User4</li>
          <li>5. User5</li>
          <li>{this.props.username}: {this.props.userRanking}th</li>
          </b>
        </ul>
        </div>
      );
    }
  }
}
export default User;
