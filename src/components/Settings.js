import React from "react";
import Header from "../components/Header.js";
import GreaterThan from "../assets/greater-than.png";
import LessThan from "../assets/less-than.png";

import X from "../assets/icon-x.png";
import O from "../assets/icon-o.png";
import dog from "../assets/dog.png";
import cat from "../assets/cat.png";

class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            turnTimer: 30,
            turnWarning: 20,
            aiDifficulty: 4,
            xIcon: X,
            oIcon: O
        };

        this.displayAiDifficulty = this.displayAiDifficulty.bind(this);
        this.handleAiDecrease = this.handleAiDecrease.bind(this);
        this.handleAiIncrease = this.handleAiIncrease.bind(this);
        this.handleTimerDecrease = this.handleTimerDecrease.bind(this);
        this.handleTimerIncrease = this.handleTimerIncrease.bind(this);
        this.handleXIconClick = this.handleXIconClick.bind(this);
        this.handleOIconClick = this.handleOIconClick.bind(this);
    }

    

    //converts aiDiffculty int into text for rendering
    displayAiDifficulty() {
        if (this.state.aiDifficulty > 4) {
            return "Easy";
        } else if (this.state.aiDifficulty === 2) {
            return "Hard";
        } else {
            return "Medium";
        }
    }

    //decreases AI difficulty if within bounds
    handleAiDecrease(event) {
        //event.preventDefault();
        if (this.state.aiDifficulty < 6) {
            this.setState({aiDifficulty: this.state.aiDifficulty + 2});
        }
    }

    //increases AI difficulty if within bounds
    handleAiIncrease(event) {
        //event.preventDefault();
        if(this.state.aiDifficulty > 2) {
            this.setState({aiDifficulty: this.state.aiDifficulty - 2});
        }
    }

    //decreases the turnTimer if the result would be greater than 10
    //dynamically udpateds the turnWarning to be 10 less than turnTimer
    handleTimerDecrease() {
        this.setState((state) => {
            let temp = state.turnTimer - 5;
            if (temp >= 10) {
                return {
                    turnTimer: temp,
                    turnWarning: temp - 10
                }
            }
        });
    }
    
    //increases the turntimer
    //dynamically updates the turnWarning to be 10 less than turnTimer
    handleTimerIncrease() {
        this.setState((state) => {
            let temp = state.turnTimer + 5;
            return {
                turnTimer: temp,
                turnWarning: temp - 10
            }
        });
    }

    //placeholder for x icon update through settings menu
    handleXIconClick() {
        this.setState((state) => {
            let temp = state.xIcon;
            if (temp === X) {
                return {
                    xIcon: dog
                }
            } else {
                return {
                    xIcon: X
                }
            }
        });
    }

    //placeholder for o icon update through settings menu
    handleOIconClick() {
        this.setState((state) => {
            let temp = state.oIcon;
            if (temp === O) {
                return {
                    oIcon: cat
                }
            } else {
                return {
                    oIcon: O
                }
            }
        });
    }

    render() {
        return (
            <>
            <Header />
            <div className="subHeader">Settings</div>
            <div className="flexContainer">
                <div className="single">
                    <div>
                    <h3>Single Player Options:</h3>
                    </div>
                    <div className="xSelect">
                        Choose icon for X:
                        <br/>
                        <div className="xSelect">
                            <img src={LessThan} alt="decrease" className="selectorLeft" onClick={this.handleXIconClick}/>
                            <span><img src={this.state.xIcon} alt="X Icon" className="iconSelect"/></span>
                            <img src={GreaterThan} alt="increase" className="selectorRight" onClick={this.handleXIconClick}/>
                        </div>
                    </div>
                    <div className="oSelect">
                        Choose icon for O:
                        <br/>
                        <div className="oSelect">
                            <img src={LessThan} alt="decrease" className="selectorLeft" onClick={this.handleOIconClick}/>
                            <span><img src={this.state.oIcon} alt="O Icon" className="iconSelect"/></span>
                            <img src={GreaterThan} alt="increase" className="selectorRight" onClick={this.handleOIconClick}/>
                        </div>
                    </div>
                    <div className="aiDiff">
                        Choose AI difficulty:
                        <br/>
                        <div className="aiMenu">
                            <img src={LessThan} alt="decrease" className="selectorLeft" onClick={this.handleAiDecrease}/>
                            <span>{this.displayAiDifficulty()}</span>
                            <img src={GreaterThan} alt="increase" className="selectorRight" onClick={this.handleAiIncrease}/>
                        </div>
                    </div>
                </div>
                <div className="multi">
                    <div><h3>Multiplayer Options:</h3></div>
                    <div className="turnTimer">
                        Turn Timer(seconds):
                        <br/>
                        <div className="turnTimerDiv">
                            <img src={LessThan} alt="decrease" className="selectorLeft" onClick={this.handleTimerDecrease}/>
                            <span>{this.state.turnTimer}</span>
                            <img src={GreaterThan} alt="increase" className="selectorRight" onClick={this.handleTimerIncrease}/>
                        </div>
                    </div>
                    <div className="turnWarn">
                        Turn Warning(seconds):
                        <br/>
                        <div className="turnWarnDiv">
                            <img src={LessThan} alt="decrease" className="selectorLeft" />
                            <span>{this.state.turnWarning}</span>
                            <img src={GreaterThan} alt="increase" className="selectorRight" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="setButtons">
                <button className="button">Apply</button>
                <button className="button" onClick={this.props.handleSettingsClick}>Cancel</button>
            </div>
            </>
        );
    }
}

export default Settings;