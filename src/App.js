

import React, { Component } from "react";
import Countdown from 'react-countdown';
import "bootstrap/dist/css/bootstrap.css";
import Row from "./components/Row";
import "./App.css";
import firebase from './firebase';
import Header from "./components/Header";
import Menu from "./components/Menu";
import MultiplayerMenu from "./components/MultiplayerMenu";
import Settings from "./components/Settings";
import Board from "./components/Board";

var symbolsMap = {
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};

var patterns = [
  //horizontal
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  //vertical
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  //diagonal
  [0, 4, 8],
  [2, 4, 6]
];

//Weights to determine how the AI scores a square containing:

var AIScore = { 2: 1,   //Empty given a score of 1
                0: 2,   //Player given a score of 2
                1: 0 }; //AI given a score of 0

//This is the primary means of setting difficulty, must be between 0 and 1
//Suggested: Easy=0.6 Medium=0.4, Hard=0.2
//var mistakeProbability = 0.4;

var fireInit = {
   boardState: new Array(9).fill(2),
   turn: 0,
   active: true,
   mode: "AI",
   playerMap: new Array(2).fill(2)
};

class App extends Component {
  timerRef = null;
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      enterSettings: false,
      userRanking: 0,
      gotName: false,
      firstLoad: true,
      timer: 30000,
      turnWarn: 20000,
      timerEnd: false,
      singlePlayer: false,
      mistakeProbability: 0.4,
      ID: 0,
      gameStart: false,
      userMap: 0
    };

    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleMenuClickMultiplayer = this.handleMenuClickMultiplayer.bind(this);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
    this.handleAiDiff = this.handleAiDiff.bind(this);
    this.handleBackToMenu = this.handleBackToMenu.bind(this);
    this.handleTimerUpdate = this.handleTimerUpdate.bind(this);
    this.handleNewGameClick = this.handleNewGameClick.bind(this);
    this.handleIDUpdate = this.handleIDUpdate.bind(this);
  }


  // Handles changes in the text form, updates state userName to user input
  handleChange(event) {
    this.setState({userName: event.target.value});
  }

  // Handles when the User clicks the submit button. Flips the boolean gotName to true/
  handleSubmit(event) {
    event.preventDefault();
    var usernameExists = true;
    firebase.database().ref(`users/${this.state.userName}/username`).once("value", snapshot => {
      // If the username does not exist in firebase, add it.
      if (!snapshot.exists()) {
        var userName = this.state.userName;
        var userRanking = this.state.userRanking;
        firebase.database().ref(`users/${this.state.userName}`)
          .set({
            username: userName,
            ranking: userRanking
          });
      }
    });

    this.setState({gotName: true});
  }

  // handles single player games
  // initializes with basic firebase
  // sets player map for both moves to be made by user
  handleMenuClick(event) {
    this.setState({singlePlayer: true});
    event.preventDefault();
    fireInit.playerMap = [this.state.userName,this.state.userName];
    let dbRef = firebase.database().ref('board').push(fireInit);
    this.setState({firstLoad: false});
    this.setState({gameStart: true});
    this.setState({ID: dbRef.key});
  }

  // update state so user moves from menu to multiplayer menu
  handleMenuClickMultiplayer(event) {
    this.setState({singlePlayer: false});
    this.setState({firstLoad: false});
  }

  // start a new game from scratch, initialize firebase with fireInit properties
  handleNewGameClick(event) {
    event.preventDefault();
    fireInit.playerMap[0] = this.state.userName;
    fireInit.mode = "2P"; //don't want the AI to be making moves
    let dbRef = firebase.database().ref('board').push(fireInit);//push basic board
    this.setState({gameStart: true});
    this.setState({ID: dbRef.key}); //add gameID so we can listen
  }

   //update game ID if someone wants to join a game with a friend
   handleIDUpdate(id){
      this.setState({ID: id}, ()=> {
         let boardRef = firebase.database().ref(`board/${this.state.ID}/playerMap`);
         //grab a snapshot of the current database value of playermap
         boardRef.once('value', (snapshot) => {
            if(snapshot.val()!=null){//don't do anything if its empty
               let newMap = snapshot.val();
               // set user as newMap[1] "o" for this game. don't change newmap 'x'
               firebase.database().ref(`board/${this.state.ID}/playerMap`).set([newMap[0],this.state.userName]);
            }
         });
      this.setState({gameStart: true});
      });
   }

  // handles component switch to settings component when menu selected
  handleSettingsClick() {
    this.setState({enterSettings: !this.state.enterSettings});
  }

  // handles changing AI difficulty
  // takes data from settings child component and updates state
  handleAiDiff = (updatedProbability) => {
    let gameState = this.state.game;
    gameState.mistakeProbability = updatedProbability;
    this.setState({game: gameState});
    //console.log(this.state.game.mistakeProbability);
  }

  //handles updating timer from settings component
  handleTimerUpdate = (newTimeLimit) => {
    this.setState({timer: newTimeLimit, turnWarn: newTimeLimit - 10000});
  }

  //placeholder for game to menu transition
  //may need additional game logic for player leaving game
  handleBackToMenu() {
    this.setState({firstLoad: true});
    this.setState({gameStart: false});
  }

  render() {  
      // checks if username is empty or not
      // render username page if empty
      if (!this.state.gotName) {
        return (
          <div>
            <Header />
              <div className="usernamediv">
                <form>
                  <label htmlFor="username">Enter your username:</label>
                  <br/>
                  <input type="text" onChange={this.handleChange}></input>
                  <br/>
                  <button className="button" onClick={this.handleSubmit}>Submit</button>
                </form>
              </div>
          </div>
        );

      //checks its the component's first load
      //loads menu if it is
      } else if (this.state.firstLoad && this.state.enterSettings === false) {
        return (
          <div>
            <Header />
            <Menu 
            handleMenuClick={this.handleMenuClick} 
            handleMenuClickMultiplayer={this.handleMenuClickMultiplayer}
            handleSettingsClick={this.handleSettingsClick} 
            username={this.state.userName} 
            userRanking={this.state.userRanking} 
            />
        </div>
        );

      // loads game board and functionality
    }
    else if (this.state.enterSettings) {
      return (
        <div>
          <Settings
          handleAiDiff={this.handleAiDiff}
          handleTimerUpdate={this.handleTimerUpdate}
          handleSettingsClick={this.handleSettingsClick}
          />
        </div>
      )
    }
    // load mutliplayer menu to join or start a new game
    else if (!this.state.gameStart && !this.state.singlePlayer){
      return (
        <>
        <Header />
            <MultiplayerMenu 
            handleNewGameClick={this.handleNewGameClick} 
            handleJoinGameClick={this.handleMenuClickMultiplayer}
            handleIDUpdate={this.handleIDUpdate}
            />
        </>
      )
    }
    // loads game board and functionality
    // pass settings, game info, etc. to board to start new game
    else {
      return (
        <>
        <Header />
        <Board
          singlePlayer = {this.state.singlePlayer}
          symbolsMap = {symbolsMap}
          handleBackToMenu = {this.handleBackToMenu}
          mistakeProbability = {this.state.mistakeProbability}
          ID = {this.state.ID}
          patterns = {patterns}
          AIScore = {AIScore}
          userName = {this.state.userName}
          timerEnd = {this.state.timerEnd}
          timer = {this.state.timer}
        />
        </>
      )
    }
  }
}


export default App;