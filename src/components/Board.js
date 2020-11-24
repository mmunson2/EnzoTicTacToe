import React, { Component } from "react";
import Row from "./Row";

class Board extends React.Component {
  render() {
    if (this.props.singlePlayer) {
      return (
        <div>
          <div className="container jumbotron" id="container">
            <p>
              <div>Select Mode:</div>
              <button className="button" href="./?AI" onClick={this.props.handleModeChange} id="ai">Versus AI</button>
              <button className="button" href="./?2P" onClick={this.props.handleModeChange} id="twop">2 Player</button>
              <div className="reset">
              <button className="button" href="#" onClick={this.props.handleReset}>Reset Game</button>
              </div>
            </p>
            
            <div className="board">{this.props.rows}</div>
            <br/>
            <p>Next Player: <b>{String.fromCharCode(this.props.symbolsMap[this.props.turn][1])}</b></p>
            <p className="alert alert-success" role="alert" id="message1"></p>
            <p className="alert alert-info" role="alert" id="message2"></p>
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
          <div className="container jumbotron" id="container">
            <div id="game-ID">
            <p> Game ID: {this.props.ID} </p>
            </div>
            
            <div className="board">{this.props.rows}</div>
            <br/>
            <p>Next Player: <b>{String.fromCharCode(this.props.symbolsMap[this.props.turn][1])}</b></p>
            <p className="alert alert-success" role="alert" id="message1"></p>
            <p className="alert alert-info" role="alert" id="message2"></p>
          </div>
        </div>
      );
    }
  }
}

export default Board;