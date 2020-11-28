import React from "react";
import xIcon from "../assets/icon-x.png";
import oIcon from "../assets/icon-o.png";

class MultiplayerMenu extends React.Component {
   constructor(props){
      super(props);
      this.state = {
         join: false,
         ID: 0
      };

      this.handleJoin = this.handleJoin.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.pushIDBack = this.pushIDBack.bind(this);
   }

   handleJoin(event){
      event.preventDefault();
      this.setState({join: true});
   }

   handleChange(event){
      event.preventDefault();
      this.setState({ID: event.target.value});
   }

   pushIDBack(){
      this.props.handleIDUpdate(this.state.ID);
   }

   render() {
      if (!this.state.join)
      {  
         return (
            <div className="flexContainer">
            <div className="menu">
                  <div className="menuSelect">
                     <img src={xIcon} alt="x icon" className="menuIcon" onClick={this.props.handleNewGameClick}/>
                     <span onClick={this.props.handleNewGameClick}>Start New Game!</span>
                  </div>
                  
                  <div className="menuSelect">
                     <img src={oIcon} alt="o icon" className="menuIcon" onClick={this.handleJoin}/>
                     <span onClick={this.handleJoin}>Join Existing Game!</span>
                  </div>
            </div>
            </div>
         );
      } 
      else {
         return(
            <div>
              <div className="usernamediv">
                <form>
                  <label htmlFor="gameID">Enter the game ID:</label>
                  <br/>
                  <input type="text" onChange={this.handleChange}></input>
                  <br/>
                  <button className="button" onClick={this.pushIDBack}>Submit</button>
                </form>
              </div>
          </div>
         );
      }
   }
}

export default MultiplayerMenu;
