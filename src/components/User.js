import React from "react";
import leaderboard from "../assets/leaderboard.png";
import firebase from '../firebase';

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      topUsersList: {},
      userRank: 0
    }
  }

  componentDidMount() {
    var list = [];
    
    firebase.database().ref(`users/`)
      .orderByChild("totalScore")
      .limitToLast(5)
      .on('child_added', function(snapshot) {
        list.push(snapshot.val().username);
      });
    this.setState({
      topUsersList:list
    });
  }

  render() {
    var leaderboardList = Object.entries(this.state.topUsersList)
      .reverse().map((currentVal, i) => {
        return <li>{i+1}. {currentVal[1]}</li>
      })

    return (
      <div>
      <div className="leadertext">
         <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
         <span>Leaderboard</span>
      </div>
      <ul>
        <b>
          {leaderboardList}
        </b>
      </ul>
      <ul>
        <b>
          <li>{this.props.userRanking === 0 ? "" : this.props.username + ": " + this.props.userRanking + "th"}</li>
        </b>
      </ul>
      </div>
    );

  }
}
export default User;
