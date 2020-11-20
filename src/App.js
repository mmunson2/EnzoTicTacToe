

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./components/Row";
import "./App.css";
import firebase from './firebase.js';
import Header from "./components/Header";
import Menu from "./components/Menu";

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
var mistakeProbability = 0.4;


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
         boardState: new Array(9).fill(2),
         turn: 0,
         active: true,
         mode: "AI",
         ID: 0
      },
      userName: "",
      firstLoad: true
    };

    this.handleNewMove = this.handleNewMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.processBoard = this.processBoard.bind(this);
    this.makeAIMove = this.makeAIMove.bind(this);
    this._getScore = this._getScore.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

   componentDidMount() {
      console.log("mounted!");
      //console.log(this.state.gameID);
      const boardRef = firebase.database().ref('board');
      boardRef.on('value', (snapshot) => {
         if(snapshot.val()!=null){
            this.setState({game: snapshot.val()}, () => {
               this.processBoard();
            });
         }  
      });
   }

  processBoard() {
     console.log("In processBoard");
    var won = false;
    patterns.forEach(pattern => {
      var firstMark = this.state.game.boardState[pattern[0]];

      if (firstMark !== 2) {
        var marks = this.state.game.boardState.filter((mark, index) => {
          return pattern.includes(index) && mark === firstMark; //looks for marks matching the first in pattern's index
        });

        if (marks.length === 3) {
          document.querySelector("#message1").innerHTML =
            String.fromCharCode(symbolsMap[marks[0]][1]) + " wins!";
          document.querySelector("#message1").style.display = "block";
          pattern.forEach(index => {
            var id = index + "-" + firstMark;
            document.getElementById(id).parentNode.style.background = "#d4edda";
          });
          var tempState = this.state.game;
          tempState.active = false;
          firebase.database().ref('board').set(tempState);
          //this.setState({ active: false });
          won = true;
        }
      }
    });

    if (!this.state.game.boardState.includes(2) && !won) {
      document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
      document.querySelector("#message2").style.display = "block";
      var tempState = this.state.game;
      tempState.active = false;
      firebase.database().ref('board').set(tempState);
      //this.setState({ active: false });
    } else if (this.state.game.mode === "AI" && this.state.game.turn === 1 && !won) {
      this.makeAIMove();
    }

  }

  makeAIMove() {
    var emptys = [];
    var scores = [];
    this.state.game.boardState.forEach((mark, index) => {
      if (mark === 2) emptys.push(index);
    });

    emptys.forEach(index => {
      var score = 0;
      patterns.forEach(pattern => {
        if (pattern.includes(index)) {
          var xCount = 0;
          var oCount = 0;
          pattern.forEach(p => {
            if (this.state.game.boardState[p] === 0) xCount += 1;
            else if (this.state.game.boardState[p] === 1) oCount += 1;

            score += p === index ? 0 : this._getScore(AIScore[this.state.game.boardState[p]]);

          });
          if (xCount >= 2) score += this._getScore(10);
          if (oCount >= 2) score += this._getScore(20);
        }
      });
      scores.push(score);
    });

    var maxIndex = 0;
    scores.reduce(function(maxVal, currentVal, currentIndex) {
      if (currentVal >= maxVal) {
        maxIndex = currentIndex;
        return currentVal;
      }
      return maxVal;
    });
    this.handleNewMove(emptys[maxIndex]);
  }

//Returns the passed in score with the chance of the AI making a mistake
//"Mistakes" will bias the score += 5
  _getScore(score) {
    //Check if AI should make a mistake
    if(Math.random() < mistakeProbability)
    {
        if(Math.random() > 0.5)
        {
            score += Math.round(Math.random() * 5);
        }
        else
        {
            score -= Math.round(Math.random() * 5);
        }
    }

    return score;
  }

  handleReset(e) {
    if (e) e.preventDefault();
    document
      .querySelectorAll(".alert")
      .forEach(el => (el.style.display = "none"));
    
      var tempState = this.state.game;
      tempState.boardState = new Array(9).fill(2);
      tempState.turn = 0;
      tempState.active = true;

      firebase.database().ref('board').set(tempState);
    
    /* ***OLD CODE --- OLD CODE --- OLD CODE --- OLD CODE***
      this.setState({
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true
    });
    */
  }

  //updates the board with newest move and flips the "turn" to the other player
  //  create new board state
  //     slice the board array upto the id the move is made in
  //     add the "turn" to that element
  //     appened the rest of the array after id
  //  update firebase with new array
  handleNewMove(id) {
   var tempState = this.state.game;
   
   tempState.boardState = this.state.game.boardState.slice(0, id)
      .concat(this.state.game.turn)
      .concat(this.state.game.boardState.slice(id+1));

   tempState.turn = (this.state.game.turn + 1) % 2;
   console.log(this.state.game);
   
   firebase.database().ref('board').set(tempState);

  /* ***OLD CODE --- OLD CODE --- OLD CODE --- OLD CODE***
   this.setState(
      prevState => {
        return {
          boardState: prevState.boardState
            .slice(0, id)
            .concat(prevState.turn)
            .concat(prevState.boardState.slice(id + 1)),
          turn: (prevState.turn + 1) % 2
        };
      },
      () => {
        this.processBoard();
      }
    );
    */
  }

  handleModeChange(e) {
    e.preventDefault();
    var tempState = this.state.game;
    if (e.target.getAttribute("href").includes("AI")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#twop").style.background = "none";
      //this.setState({ mode: "AI" });
      tempState.mode = "AI";
      firebase.database().ref('board').set(tempState);
      this.handleReset(null);
    } else if (e.target.getAttribute("href").includes("2P")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#ai").style.background = "none";
      //this.setState({ mode: "2P" });
      tempState.mode = "2P";
      firebase.database().ref('board').set(tempState);
      this.handleReset(null);
    }
  }

  //placeholder for username submit
  //currently just updates username state to placeholder 
  handleSubmit(event) {
    event.preventDefault();
    this.setState({userName: "PlaceHolder"});
  }

  // placeholder for menu click event
  // currently just updates firstload state to false
  handleMenuClick(event) {
    event.preventDefault();
    let dbRef = firebase.database().ref('board').push();
    let temp = this.state.game;
    temp.ID = dbRef.key;
    this.setState({firstLoad: false});
    this.setState({game: temp});
  }

  render() {
    const rows = [];
    for (var i = 0; i < 3; i++)
      rows.push(
        <Row
          row={i}
          boardState={this.state.game.boardState}
          onNewMove={this.handleNewMove}
          active={this.state.game.active}
        />
      );
      
      // checks if username is empty or not
      // render username page if empty
      if (this.state.userName === "") {
        return (
          <div>
            <Header />
              <div className="usernamediv">
                <form>
                  <label htmlFor="username">Enter your username:</label>
                  <br/>
                  <input type="text" id="username" name="username"></input>
                  <br/>
                  <button className="button" onClick={this.handleSubmit}>Submit</button>
                </form>
              </div>
          </div>
        );
      
      //checks its the component's first load
      //loads menu if it is
      } else if (this.state.firstLoad) {
        return (
          <div>
            <Header />
            <Menu handleMenuClick={this.handleMenuClick}/>
        </div>
        );

      // loads game board and functionality
      } else {

        return (
          <div>
            <Header />
            <div className="container jumbotron" id="container">
              <p>
                <div>Select Mode:</div>
                <button className="button" href="./?AI" onClick={this.handleModeChange} id="ai">Versus AI</button>
                <button className="button" href="./?2P" onClick={this.handleModeChange} id="twop">2 Player</button>
                <div className="reset">
                <button className="button" href="#" onClick={this.handleReset}>Reset Game</button>
                </div>
              </p>
              
              <div className="board">{rows}</div>
              <br/>
              <p>Next Player: <b>{String.fromCharCode(symbolsMap[this.state.game.turn][1])}</b></p>
              <p className="alert alert-success" role="alert" id="message1"></p>
              <p className="alert alert-info" role="alert" id="message2"></p>
            </div>
          </div>
        );
      }
  }
}

export default App;
