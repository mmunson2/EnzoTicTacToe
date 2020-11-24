import React from "react";
import leaderboard from "../assets/leaderboard.png";
import firebase from '../firebase';

class User extends React.Component {
  render() {
      var top5Users = [];
      var getTopUsers = firebase.database().ref(`users`)
        .orderByChild(`totalScore`)
        .limitToLast(5)
        .once('value', (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            console.log("Exists", data.totalScore);
            top5Users.push(data.username);
            console.log("name", data.username);
          })
        });

      return (
        <div>
        <div className="leadertext">
           <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
           <span>Leaderboard</span>
        </div>
        <ul>
          <b>
          <script>
            document.getElementById("first").innerHTML = top5Users[4];
            document.getElementById("second").innerHTML = top5Users[3];
            document.getElementById("third").innerHTML = top5Users[2];
            document.getElementById("fourth").innerHTML = top5Users[1];
            document.getElementById("fifth").innerHTML = top5Users[0];
          </script>
          <li>1. <p id="first"></p></li>
          <li>2. </li>
          <li>3. User3</li>
          <li>4. User4</li>
          <li>5. User5</li>
          <li>{this.props.userRanking === 0 ? "" : this.props.username + ": " + this.props.userRanking + "th"}</li>
          </b>
        </ul>
        </div>
      );

  }

  calculateRanking() {

  }
}
export default User;
