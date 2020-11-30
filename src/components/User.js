import React from "react";
import leaderboard from "../assets/leaderboard.png";
import firebase from '../firebase';

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      userRanking: 0,
      topUsersList: {}
    }
    this.calculateRanking = this.calculateRanking.bind(this);
  }

  calculateRanking() {
    var list = [];
    var tempRanking;
    firebase.database().ref(`users/`)
      .orderByChild("totalScore")
      .on('child_added', function(snapshot) {
        list.push(snapshot.val().username);
      })
    Object.entries(list).reverse().map((currentVal, i) => {
      if (currentVal[1] === this.props.username) {
        // return <li>You: #{i + 1}</li>
        // this.setState({
        //   userRanking: i + 1
        // })
        tempRanking = i + 1;
      }
    })
    console.log("tempranking " + tempRanking);
    this.setState({
      userRanking: tempRanking
    })
    console.log("user ranking: " + this.state.userRanking);
  }

  componentDidMount() {
    this.calculateRanking();
    const list = [];
    firebase.database().ref(`users/`)
      .orderByChild("totalScore")
      .limitToLast(5)
      .on('child_added', function(snapshot) {
        list.push(snapshot.val().username);
      })
    if (list !== this.state.topUsersList) {
      console.log(list);
      this.setState({
        topUsersList:list
      });
    }
  }

  render() {
      //const listItems = this.state.topUsersList.map(user => <li>{user}</li>);
      var listItems = Object.entries(this.state.topUsersList).reverse().map((currentVal, i) => {
       return <li>{i+1}. {currentVal[1]}</li>
      })

      console.log("ranking is " + this.state.userRanking);
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
          <li>{!this.state.userRanking ? "" : this.props.username + ": #" + this.state.userRanking}</li>
        </ul>
        </div>
      );
  }
}
export default User;
