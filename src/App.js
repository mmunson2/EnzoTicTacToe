

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./components/Row";
import "./App.css";
import Header from "./components/Header";
import Menu from "./components/Menu";
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
var mistakeProbability = 0.4;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true,
      mode: "AI",
      userName: "",
      enterSettings: false,
      userRanking: 0,
      gotName: false,
      firstLoad: true
    };

    this.handleNewMove = this.handleNewMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.processBoard = this.processBoard.bind(this);
    this.makeAIMove = this.makeAIMove.bind(this);
    this._getScore = this._getScore.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleSettingsClick = this.handleSettingsClick.bind(this);
  }

  processBoard() {
    var won = false;
    patterns.forEach(pattern => {
      var firstMark = this.state.boardState[pattern[0]];

      if (firstMark !== 2) {
        var marks = this.state.boardState.filter((mark, index) => {
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
          this.setState({ active: false });
          won = true;
        }
      }
    });

    if (!this.state.boardState.includes(2) && !won) {
      document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
      document.querySelector("#message2").style.display = "block";
      this.setState({ active: false });
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
      patterns.forEach(pattern => {
        if (pattern.includes(index)) {
          var xCount = 0;
          var oCount = 0;
          pattern.forEach(p => {
            if (this.state.boardState[p] === 0) xCount += 1;
            else if (this.state.boardState[p] === 1) oCount += 1;

            score += p === index ? 0 : this._getScore(AIScore[this.state.boardState[p]]);

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
    this.setState({
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true
    });
  }

  handleNewMove(id) {
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
  }

  handleModeChange(e) {
    e.preventDefault();
    if (e.target.getAttribute("href").includes("AI")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#twop").style.background = "none";
      this.setState({ mode: "AI" });
      this.handleReset(null);
    } else if (e.target.getAttribute("href").includes("2P")) {
      e.target.style.background = "#d4edda";
      document.querySelector("#ai").style.background = "none";
      this.setState({ mode: "2P" });
      this.handleReset(null);
    }
  }

  // Handles changes in the text form, updates state userName to user input
  handleChange(event) {
    this.setState({userName: event.target.value});
  }

  // Handles when the User clicks the submit button. Flips the boolean gotName to true/
  handleSubmit(event) {
    event.preventDefault();
    // probably set the firebase username here name = this.state.userName
    this.setState({gotName: true});
  }

  // placeholder for menu click event
  // currently just updates firstload state to false
  handleMenuClick(event) {
    event.preventDefault();
    this.setState({firstLoad: false});
  }

  // handles component switch to settings component when menu selected
  handleSettingsClick(event) {
    event.preventDefault();
    this.setState({enterSettings: !this.state.enterSettings});
  }

  render() {
    // populates rows using current board state
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
            <Menu handleMenuClick={this.handleMenuClick} handleSettingsClick={this.handleSettingsClick} username={this.state.userName} userRanking={this.state.userRanking} />
        </div>
        );

      // loads game board and functionality
      } else if (this.state.enterSettings) {
        return (
          <div>
            <Settings handleSettingsClick={this.handleSettingsClick}/>
          </div>
        )

      }    
    // loads game board and functionality
    else {
      return (
        <Board
          symbolsMap = {symbolsMap}
          turn = {this.state.turn}
          rows = {rows}
          handleModeChange = {(event) => this.handleModeChange(event)}
          handleReset = {(event) => this.handleReset(event)}
        />
      )
    }
  }
}

export default App;
