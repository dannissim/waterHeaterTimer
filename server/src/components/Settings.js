import React, { Component } from 'react';
import {Input} from 'reactstrap'
import './Settings.css';

export default class Settings extends Component {
  render() {
    const btnClassName = this.props.isOn ? 'disable' : '';

    return (
      <div className="settings">
        <div className="settings-section">
          <label id="session-label">Time to Heat</label>
          <div>
            <button className={btnClassName} id="session-decrement" onClick={this.props.onDecreaseSession}>-</button>
            <Input type='number' style={{width: '50px'}} min='1' max='99' onChange={this.props.updateTimeToHeat} value={this.props.timeToHeat} id="session-length"></Input>
            <button className={btnClassName} id="session-increment" onClick={this.props.onIncreaseSession}>+</button>
          </div>
        </div>
      </div>
    )
  }
}