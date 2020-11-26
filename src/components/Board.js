import React, { Component } from "react";
import Row from "./Row";
import firebase from '../firebase';

class Board extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         boardState: new Array(9).fill(2),
         turn: 0,
         active: true,
         mode: "AI",
         ID: this.props.ID,
         playerMap: new Array(2).fill(2)
      };

      this.handleNewMove = this.handleNewMove.bind(this);
      this.handleReset = this.handleReset.bind(this);
      this.handleModeChange = this.handleModeChange.bind(this);
      this.processBoard = this.processBoard.bind(this);
      this.makeAIMove = this.makeAIMove.bind(this);
      this._getScore = this._getScore.bind(this);
   }

   componentDidMount(){
      console.log("mounted!");
      //console.log(this.state.gameID);
      const boardRef = firebase.database().ref(`board/${this.state.ID}`);
      boardRef.on('value', (snapshot) => {
         if(snapshot.val()!=null){
            this.setState({game: snapshot.val()}, () => {
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
  var tempState = this.state;

  tempState.boardState = this.state.boardState.slice(0, id)
     .concat(this.state.turn)
     .concat(this.state.boardState.slice(id+1));

  tempState.turn = (this.state.turn + 1) % 2;
  console.log(this.state);

  firebase.database().ref(`board/${this.state.ID}`).set(tempState);

  //this.props.start();
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

     //this.setState({timerEnd: false});

     firebase.database().ref(`board/${this.state.ID}`).set(tempState);
 }

 handleModeChange(e) {
   e.preventDefault();
   if (e.target.getAttribute("href").includes("AI")) {
     e.target.style.background = "#d4edda";
     document.querySelector("#twop").style.background = "none";
     firebase.database().ref(`board/${this.state.ID}`).set({mode: "AI"});
     this.handleReset(null);
   } else if (e.target.getAttribute("href").includes("2P")) {
     e.target.style.background = "#d4edda";
     document.querySelector("#ai").style.background = "none";
     firebase.database().ref(`board/${this.state.ID}`).set({mode: "2P"});
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
        firebase.database().ref(`board/${this.state.ID}`).set({active: false});
        won = true;
      }
    }
  });

  if (!this.state.boardState.includes(2) && !won) {
    document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
    document.querySelector("#message2").style.display = "block";
    firebase.database().ref(`board/${this.state.ID}`).set({active: false});
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
          </div>
        </div>
      );
    }
    else {
      return (
        <div className="outDiv">
          <div className="container jumbotron" id="container">
            <div id="game-ID">
            <p> Game ID: {this.state.ID} </p>
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
          </div>
        </div>
      );
    }
  }
}

export default Board;
