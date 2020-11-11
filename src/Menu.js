import React from "react";
import leaderboard from "./assets/leaderboard.png";

class Menu extends React.Component {
    render() {
        return (
            <div class="flexContainer">
              <div>
                    <div class="leadertext">
                        <img src={leaderboard} alt="leaderboard" class="leaderimg"/>
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
              <div class="menu">
                  <button class="button" onClick={this.props.handleMenuClick}>Play Offline</button>
                  <br/>
                  <button class="button" onClick={this.props.handleMenuClick}>Play with friends</button>
                  <br/>
                  <button class="button" onClick={this.props.handleMenuClick}>Settings</button>
              </div>
            </div>
        );
    }
}

export default Menu;