import React, { Component } from 'react';
import './Settings.css';

export default class Settings extends Component {
  render() {
    const btnClassName = this.props.isStart ? 'disable' : '';

    return (
      <div className="settings">
        <div className="settings-section">
          <label id="session-label">Session Length</label>
          <div>
            <button className={btnClassName} id="session-decrement" onClick={this.props.onDecreaseSession}>-</button>
            <span id="session-length">{this.props.sessionLength}</span>
            <button className={btnClassName} id="session-increment" onClick={this.props.onIncreaseSession}>+</button>
          </div>
        </div>
      </div>
    )
  }
}