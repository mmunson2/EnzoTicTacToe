import React, { Component } from "react";
import Row from "./Row";
import clickSound from "../assets/sounds/pop-down.mp3"
import firebase from '../firebase';
import Countdown from 'react-countdown';

class Board extends React.Component {
   timerRef = null;
   constructor(props){
      super(props);
      this.state = {
         boardState: new Array(9).fill(2),
         turn: 0,
         active: true,
         mode: "2P",
         playerMap: new Array(2).fill(2),
      };

      this.handleNewMove = this.handleNewMove.bind(this);
      this.handleReset = this.handleReset.bind(this);
      this.handleModeChange = this.handleModeChange.bind(this);
      this.processBoard = this.processBoard.bind(this);
      this.makeAIMove = this.makeAIMove.bind(this);
      this._getScore = this._getScore.bind(this);
      this.renderTimer = this.renderTimer.bind(this);
      this.start = this.start.bind(this);
      this.handleSet = this.handleSet.bind(this);
      this.handleTimerEnd = this.handleTimerEnd.bind(this);
   }

   componentDidMount(){
      console.log("mounted!");
      //console.log(this.state.gameID);
      const boardRef = firebase.database().ref(`board/${this.props.ID}`);
      boardRef.on('value', (snapshot) => {
         if(snapshot.val()!=null){
            this.setState(snapshot.val(), () => {
               this.processBoard();
            });
         }
      });
   }

   //updates the board with newest move and flips the "turn" to the other player
  //  create new board state
  //     slice the board array upto the id the move is made in
  //     add the "turn" to that element
  //     appened the rest of the array after id
  //  update firebase with new array
  handleNewMove(id) {
   //this.start();
   if(this.state.playerMap[this.state.turn] === this.props.userName){
      var tempState = this.state;

      tempState.boardState = this.state.boardState.slice(0, id)
         .concat(this.state.turn)
         .concat(this.state.boardState.slice(id+1));

      tempState.turn = (this.state.turn + 1) % 2;
      console.log(this.state);

      firebase.database().ref(`board/${this.props.ID}`).set(tempState);
   }
  this.start();
 }

 handleReset(e) {
   if (e) e.preventDefault();
   document
     .querySelectorAll(".alert")
     .forEach(el => (el.style.display = "none"));
   document.querySelector("#message1").style.display = "none";


     var tempState = this.state;
     tempState.boardState = new Array(9).fill(2);
     tempState.turn = 0;
     tempState.active = true;

     this.setState({timerEnd: false});

     firebase.database().ref(`board/${this.props.ID}`).set(tempState);
 }

 handleModeChange(e) {
   e.preventDefault();
   if (e.target.getAttribute("href").includes("AI")) {
     e.target.style.background = "#d4edda";
     document.querySelector("#twop").style.background = "none";
     firebase.database().ref(`board/${this.props.ID}`).set({mode: "AI"});
     this.handleReset(null);
   } else if (e.target.getAttribute("href").includes("2P")) {
     e.target.style.background = "#d4edda";
     document.querySelector("#ai").style.background = "none";
     firebase.database().ref(`board/${this.props.ID}`).set({mode: "2P"});
     this.handleReset(null);
   }
 }

 processBoard() {
   console.log("In processBoard");
  var won = false;
  this.props.patterns.forEach(pattern => {
    var firstMark = this.state.boardState[pattern[0]];

    if (firstMark !== 2) {
      var marks = this.state.boardState.filter((mark, index) => {
        return pattern.includes(index) && mark === firstMark; //looks for marks matching the first in pattern's index
      });

      if (marks.length === 3) {
        document.querySelector("#message1").innerHTML =
          String.fromCharCode(this.props.symbolsMap[marks[0]][1]) + " wins!";
        document.querySelector("#message1").style.display = "block";
        pattern.forEach(index => {
          var id = index + "-" + firstMark;
          document.getElementById(id).parentNode.style.background = "#d4edda";
        });
        firebase.database().ref(`board/${this.props.ID}`).set({active: false});
        won = true;
      }
    }
  });

  if (!this.state.boardState.includes(2) && !won) {
    document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
    document.querySelector("#message2").style.display = "block";
    firebase.database().ref(`board/${this.props.ID}`).set({active: false});
  } else if (this.state.mode === "AI" && this.state.turn === 1 && !won) {
    this.makeAIMove();
  }
}


makeAIMove() {
   var emptys = [];
   var scores = [];
   this.state.boardState.forEach((mark, index) => {
     if (mark === 2) emptys.push(index);
   });

   emptys.forEach(index => {
     var score = 0;
     this.props.patterns.forEach(pattern => {
       if (pattern.includes(index)) {
         var xCount = 0;
         var oCount = 0;
         pattern.forEach(p => {
           if (this.state.boardState[p] === 0) xCount += 1;
           else if (this.state.boardState[p] === 1) oCount += 1;

           score += p === index ? 0 : this._getScore(this.props.AIScore[this.state.boardState[p]]);

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
   if(Math.random() < this.props.mistakeProbability)
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

  //custom renderer passed to countdown to conditionally
  //render countdown component
  renderTimer = ({minutes, seconds, completed}) => {
   //if timer runs out before a normal game ending
   if (completed) {
     //check whos turn it was when timer ended
     //if x declare o winner
     let winner = -1;
     if (this.state.turn === 0) {
       winner = 1;
     } else {
       winner = 0;
     }
     //custom end message
     document.querySelector("#message1").innerHTML =
     String.fromCharCode(this.props.symbolsMap[winner][1]) + " wins!";
     document.querySelector("#message1").style.display = "block";
     //updates game state
     this.handleTimerEnd();
     return <span>Times Up!</span>;
   }
   else {
     if (this.props.timerEnd) {
       return <span>Times Up!</span>
     } else if (this.state.active === false) {
       return <span>Game Over!</span>
     }
     return <span>{minutes}:{seconds}</span>;
   }
 }

 //uses reference to countdown component to start timer
 start() {
   this.timerRef.start();
 }

 //passed to countdown component to set refernce to access timer funcs
 handleSet(ref) {
   this.timerRef = ref;
 }

 //handles a game end when the timer runs out before a normal game end
 handleTimerEnd() {
   this.setState({active: false, timerEnd: true});
 }

   render() {
      const rows = [];
      for (var i = 0; i < 3; i++) {
        rows.push(
          <Row
            row={i}
            boardState={this.state.boardState}
            onNewMove={this.handleNewMove}
            active={this.state.active}
          />
        );
      }
    
      if (this.props.singlePlayer) {
      return (
        <div className="outDiv">
          <div className="container jumbotron" id="container">
            <p>
              <div>Select Mode:</div>
              <button className="button" href="./?AI" onClick={this.handleModeChange} id="ai">Versus AI</button>
              <button className="button" href="./?2P" onClick={this.handleModeChange} id="twop">2 Player</button>
              <div className="reset">
              <button className="button" href="#" onClick={this.handleReset}>Reset Game</button>
              <button className="button" onClick={this.props.handleBackToMenu}>Back to Menu</button>
              </div>
            </p>

            <div className="board">{rows}</div>
            <br/>
            <p>Next Player: <b>{String.fromCharCode(this.props.symbolsMap[this.state.turn][1])}</b></p>
            <p className="alert alert-success" role="alert" id="message1"></p>
            <p className="alert alert-info" role="alert" id="message2"></p>
			<audio id="click-sound" src={clickSound} preload="auto"></audio>
          </div>
          <div className="countdown">
          <div className="timerText">Turn Timer:</div>
          <Countdown
            date={Date.now() + this.props.timer}
            renderer={this.renderTimer}
            ref={this.handleSet}
            autoStart={false}
            />
        </div>
        </div>
      );
    }
    else {
      return (
        <div className="outDiv">
          <div className="container jumbotron" id="container">
            <div id="game-ID">
            <p> Game ID: {this.props.ID} </p>
            </div>
            <div className="reset">
            <p>
            <button className="button" href="#" onClick={this.handleReset}>Reset Game</button>
            <button className="button" onClick={this.props.handleBackToMenu}>Back to Menu</button>
            </p>
            </div>

            <div className="board">{rows}</div>
            <br/>
            <p>Next Player: <b>{String.fromCharCode(this.props.symbolsMap[this.state.turn][1])}</b></p>
            <p className="alert alert-success" role="alert" id="message1"></p>
            <p className="alert alert-info" role="alert" id="message2"></p>
			<audio id="click-sound" src={clickSound} preload="auto"></audio>

          </div>
          <div className="countdown">
          <div className="timerText">Turn Timer:</div>
          <Countdown
            date={Date.now() + this.props.timer}
            renderer={this.renderTimer}
            ref={this.handleSet}
            autoStart={false}
            />
        </div>
        </div>
      );
    }
  }
}

export default Board;
