import React from "react";
import leaderboard from "../assets/leaderboard.png";
import xIcon from "../assets/icon-x.png";
import oIcon from "../assets/icon-o.png";
import settingsIcon from "../assets/settings.png";
import User from "./User"

class Menu extends React.Component {
  render() {
        return (
            <div className="flexContainer">

              <User username={this.props.username} userRanking={this.props.userRanking} calculateRanking={this.props.calculateRanking} />

              <div className="menu">
                  <div className="menuSelect">
                    <img src={xIcon} alt="x icon" className="menuIcon" onClick={this.props.handleMenuClick}/>
                    <span onClick={this.props.handleMenuClick}>Play Offline</span>
                  </div>
                  <div className="menuSelect">
                    <img src={oIcon} alt="o icon" className="menuIcon" onClick={this.props.handleMenuClickMultiplayer}/>
                    <span onClick={this.props.handleMenuClickMultiplayer}>Play with friends</span>
                  </div>
                  <div className="menuSelect">
                    <img src={settingsIcon} alt="settings icon" className="menuIcon" onClick={this.props.handleSettingsClick}/>
                    <span onClick={this.props.handleSettingsClick}>Settings</span>
                  </div>
              </div>
            </div>
        );
    }
}

export default Menu;
