import React from "react";
import leaderboard from "../assets/leaderboard.png";
import firebase from '../firebase';

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      blehList: ["blah", "boo", "beh", "bleh"],
      topUsersList: {}
    }
  }

  componentDidMount() {
    var list = [];
    firebase.database().ref(`users/`)
      .orderByChild("totalScore")
      .limitToLast(5)
      .on('child_added', function(snapshot) {
        list.push(snapshot.val().username);
      })
    this.setState({
      topUsersList:list});
  }

  render() {
      //const listItems = this.state.topUsersList.map(user => <li>{user}</li>);
      var listItems = Object.entries(this.state.topUsersList).reverse().map((currentVal, i) => {
       return <li>{i+1}. {currentVal[1]}</li>
      })

      return (
        <div>
        <div className="leadertext">
           <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
           <span>Leaderboard</span>
        </div>
        <ul>
          {listItems}

        </ul>
        <ul>
          <li>{this.props.userRanking === 0 ? "" : this.props.username + ": #" + this.props.userRanking}</li>
        </ul>
        </div>
      );
  }
}
export default User;
