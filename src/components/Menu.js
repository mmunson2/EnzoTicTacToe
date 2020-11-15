import React from "react";
import leaderboard from "../assets/leaderboard.png";
import xIcon from "../assets/icon-x.png";
import oIcon from "../assets/icon-o.png";
import settingsIcon from "../assets/settings.png";

class Menu extends React.Component {
    render() {
        return (
            <div className="flexContainer">
              <div>
                    <div className="leadertext">
                        <img src={leaderboard} alt="leaderboard" className="leaderimg"/>
                        <span>Leaderboard</span>
                    </div>
                <ul>
                  <b>
                  <li>1. User1</li>
                  <li>2. User2</li>
                  <li>3. User3</li>
                  <li>4. User4</li>
                  <li>5. User5</li>
                  <li>You: 100th</li>
                  </b>
                </ul>
              </div>
              <div className="menu">
                  <div className="menuSelect">
                    <img src={xIcon} alt="x icon" className="menuIcon" onClick={this.props.handleMenuClick}/>
                    <span onClick={this.props.handleMenuClick}>Play Offline</span>  
                  </div>
                  <div className="menuSelect">
                    <img src={oIcon} alt="o icon" className="menuIcon" onClick={this.props.handleMenuClick}/>
                    <span onClick={this.props.handleMenuClick}>Play with friends</span>  
                  </div>
                  <div className="menuSelect">
                    <img src={settingsIcon} alt="settings icon" className="menuIcon" onClick={this.props.handleMenuClick}/>
                    <span onClick={this.props.handleMenuClick}>Settings</span>  
                  </div>
              </div>
            </div>
        );
    }
}

export default Menu;