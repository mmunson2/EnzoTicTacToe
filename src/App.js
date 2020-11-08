

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./Row";
import "./App.css";

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

var AIScore = { 2: 1, 0: 2, 1: 0 };

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true,
      mode: "AI"
    };
    this.handleNewMove = this.handleNewMove.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);
    this.processBoard = this.processBoard.bind(this);
    this.makeAIMove = this.makeAIMove.bind(this);
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
            score += p === index ? 0 : AIScore[this.state.boardState[p]];
          });
          if (xCount >= 2) score += 10;
          if (oCount >= 2) score += 20;
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

  render() {
    const rows = [];
    for (var i = 0; i < 3; i++)
      rows.push(
        <Row
          row={i}
          boardState={this.state.boardState}
          onNewMove={this.handleNewMove}
          active={this.state.active}
        />
      );
    return (
      <div>
        <div class="container jumbotron" id="container">
          <h3>TIC TAC TOE</h3>
          <p>
            <a href="./?AI" onClick={this.handleModeChange} id="ai">
              Versus AI
            </a>{" "}
            ||
            <a href="./?2P" onClick={this.handleModeChange} id="twop">
              {" "}
              2 Players
            </a>{" "}
            ||
            <a href="#" onClick={this.handleReset}>
              {" "}
              Reset board
            </a>
          </p>
          <p>{String.fromCharCode(symbolsMap[this.state.turn][1])}'s turn</p>
          <div className="board">{rows}</div>
          <p class="alert alert-success" role="alert" id="message1"></p>
          <p class="alert alert-info" role="alert" id="message2"></p>
        </div>
      </div>
    );
  }
}

export default App;
