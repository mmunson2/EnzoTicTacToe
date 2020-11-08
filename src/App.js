

import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Row from "./Row";
import "./App.css";

//Unicode symbols for the X and O
var symbolsMap =
{
  2: ["marking", "32"],
  0: ["marking marking-x", 9587],
  1: ["marking marking-o", 9711]
};

//All the possible patterns that might result in a win
var patterns =
[
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

//-- Board Layout: --
//     0  1  2
//     3  4  5
//     6  7  8

// Board Values:
// 0: X (Player)
// 1: O (AI or Player 2)
// 2: Empty


// This is the weight that the AI assigns a square based on its board value
var AIScore = { 2: 1, // When a square is empty, the weight is 1
                1: 0, // When a square is occupied by the AI, the weight is 0
                0: 2  // When a square is occupied by the player, the weight is 2
              };
// This means that the AI will favor patterns that the player is already in and play defensively


class App extends React.Component
{

//------------------------------------------------------------------------------
// Constructor
//------------------------------------------------------------------------------
  constructor(props)
  {
    super(props);
    this.state = {
      //Board is represented with a 1x9 array
      //2 means empty,
      boardState: new Array(9).fill(2),
      //Turn tracks whose turn it is
      //When playing against AI, 1=AI turn
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

//------------------------------------------------------------------------------
// Process Board
//------------------------------------------------------------------------------
  processBoard()
  {
    var won = false;

    //Do this code for every pattern that might result in a win
    patterns.forEach(pattern =>
    {

      // Get the board value at the first pattern position
      var firstMark = this.state.boardState[pattern[0]];

      // If the first position is not empty...
      if (firstMark != 2)
      {
          //Recall that boardState is a 1x9 Array
          //The filter() method creates an array filled with all array elements that pass a test (provided as a function).
        var marks = this.state.boardState.filter((mark, index) =>
        {
          return pattern.includes(index) && mark == firstMark; //looks for marks matching the first in pattern's index
        });

        // marks is either uninitialized, or is an array with length between 1 and 3

        // Check for a win
        if (marks.length == 3)
        {
          document.querySelector("#message1").innerHTML =
            String.fromCharCode(symbolsMap[marks[0]][1]) + " wins!";
          document.querySelector("#message1").style.display = "block";

          //Change the winning pattern's background to green
          pattern.forEach(index =>
          {
            var id = index + "-" + firstMark;
            document.getElementById(id).parentNode.style.background = "#d4edda";
          });

          this.setState({ active: false });
          won = true;
        }
      }
    });

    //Check if the board has no empty spaces left
    if (!this.state.boardState.includes(2) && !won)
    {
      document.querySelector("#message2").innerHTML = "Game Over - It's a draw";
      document.querySelector("#message2").style.display = "block";
      this.setState({ active: false });
    }
    //Check if we should do the AI move
    else if (this.state.mode == "AI" && this.state.turn == 1 && !won)
    {
      this.makeAIMove();
    }
  }

//------------------------------------------------------------------------------
// Make AI Move
//------------------------------------------------------------------------------
  makeAIMove()
  {
    //Contains the indices of all available squares
    var emptys = [];

    //The corresponding score of each square, which we use to decide where to move ourselves
    var scores = [];

    //Fill the empty array with all the available indices
    this.state.boardState.forEach((mark, index) =>
    {
      if (mark == 2) emptys.push(index);
    });

    //Loop through all the empty positions
    emptys.forEach(index =>
    {
      var score = 0;

      //For this particular empty position, loop through all the winning patterns
      patterns.forEach(pattern =>
      {
        // We only care if the pattern includes our current empty position
        if (pattern.includes(index))
        {
          var xCount = 0; // X is the Player
          var oCount = 0; // O is AI

          //For each square in the current pattern:
          pattern.forEach(p =>
          {
            //Zero means X, 1 means O
            if (this.state.boardState[p] == 0) xCount += 1;
            else if (this.state.boardState[p] == 1) oCount += 1;

            // Get the score for the current square:
            //  - If the square is the current empty one, its score is zero
            //  - Otherwise assign a score based on whether the square is empty, player1, or AI occupied
            score += p == index ? 0 : AIScore[this.state.boardState[p]];
          });

          if (xCount >= 2) score += 10; //Medium boost if the player has two X's in this pattern
          if (oCount >= 2) score += 20; //Big boost if the AI has two O's in this pattern
        }
      });

      scores.push(score);
    });

    var maxIndex = 0;
    //Get the maximum score from the scores array
    scores.reduce(function(maxVal, currentVal, currentIndex)
    {
      if (currentVal >= maxVal)
      {
        maxIndex = currentIndex;
        return currentVal;
      }
      return maxVal;
    });

    //Choose the square with the highest score
    this.handleNewMove(emptys[maxIndex]);
  }

//------------------------------------------------------------------------------
// Handle Reset
//------------------------------------------------------------------------------
  handleReset(e)
  {
    if (e) e.preventDefault();
    document
      .querySelectorAll(".alert")
      .forEach(el => (el.style.display = "none"));

    this.setState(
    {
      boardState: new Array(9).fill(2),
      turn: 0,
      active: true
    });
  }

//------------------------------------------------------------------------------
// Handle New Move
//
// <<< Lambda functions are a curse upon humankind >>>
//------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------
// Handle Mode Change
//------------------------------------------------------------------------------
  handleModeChange(e)
  {
    e.preventDefault();

    //Switch to AI mode
    if (e.target.getAttribute("href").includes("AI"))
    {
      e.target.style.background = "#d4edda";
      document.querySelector("#twop").style.background = "none";
      this.setState({ mode: "AI" });
      this.handleReset(null);
    }
    //Switch to PVP
    else if (e.target.getAttribute("href").includes("2P"))
    {
      e.target.style.background = "#d4edda";
      document.querySelector("#ai").style.background = "none";
      this.setState({ mode: "2P" });
      this.handleReset(null);
    }
  }

//------------------------------------------------------------------------------
// Render
//------------------------------------------------------------------------------
  render()
  {
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
