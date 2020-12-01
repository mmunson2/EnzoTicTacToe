import React from "react";
import leaderboard from "../assets/leaderboard.png";
import firebase from '../firebase';

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userRanking: 0,
      topUsersList: {},
      isLoading: true
    }
    this.calculateRanking = this.calculateRanking.bind(this);
  }

  calculateRanking() {
    var list = [];
    var tempRanking = 0;
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
    return tempRanking;
  }

  componentDidMount() {
    var ranking = this.calculateRanking();
    console.log(this.state.userRanking);
    console.log(this.state.topUsersList);
    if (!this.state.topUsersList.length) {
      console.log("enter list logic");
      var userList = [];
      firebase.database().ref(`users/`)
        .orderByChild("totalScore")
        .limitToLast(5)
        .on('child_added', function(snapshot) {
          userList.push(snapshot.val().username);
        })
      if (userList !== this.state.topUsersList) {
        this.setState({
          topUsersList:userList,
          userRanking: ranking,
          isLoading: false
        });
      }
    }
  }

  render() {
      //const listItems = this.state.topUsersList.map(user => <li>{user}</li>);
    var listItems = Object.entries(this.state.topUsersList).reverse().map((currentVal, i) => {
     return <li key={i}>{i+1}. {currentVal[1]}</li>
    })

    console.log("list = ");
    console.log(this.state.topUsersList);
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
