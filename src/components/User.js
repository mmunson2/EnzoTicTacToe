import React from "react";
import leaderboard from "../assets/leaderboard.png";
import firebase from '../firebase';

class User extends React.Component {
  constructor() {
    super();
    this.state = {
      topUsersList: []
    }
  }

  componentDidMount() {
    firebase.database().ref(`users`)
      .orderByChild(`totalScore`)
      .limitToLast(5)
      .once('value', (snapshot) => {
        // this.setState({
        //   topUsersList:snapshot
        // })

        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          console.log("Exists", data.totalScore);
          this.state.topUsersList.push(data.username);
          console.log("name", data.username);
        })
      });
  }

  render() {
      // var top5Users = [];

      // firebase
      //   .firestore()
      //   .collection(`users`)
      //   .onSnapshot((snapshot) => {
      //     const newList = snapshot.docs.map((doc) => ({
      //       id: doc.id,
      //       ...doc.data()
      //     }))
      //   })
      console.log("Hi");
      console.log(this.state.topUsersList);
      // const listed = this.state.topUsersList.map((user) => {
      //   return (
      //     <b>
      //       <li>{user}</li>
      //     </b>)
      // });

      return (
        <div>
        <div className="leadertext">
           <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
           <span>Leaderboard</span>
        </div>


        <ul>
          <b>
          {this.state.topUsersList.map(user =>
          {return <li>{user}</li>})}
          <li>{this.props.userRanking === 0 ? "" : this.props.username + ": " + this.props.userRanking + "th"}</li>
          </b>
        </ul>
        </div>
      );
/*
<script>
  document.getElementById("first").innerHTML = top5Users[4];
  document.getElementById("second").innerHTML = top5Users[3];
  document.getElementById("third").innerHTML = top5Users[2];
  document.getElementById("fourth").innerHTML = top5Users[1];
  document.getElementById("fifth").innerHTML = top5Users[0];
</script>
<li>1. User1</li>
<li>2. User2</li>
<li>3. User3</li>
<li>4. User4</li>
<li>5. User5</li>
<li>{this.state.topUsersList[0]}</li>
*/
  }

  calculateRanking() {

  }
}
export default User;
