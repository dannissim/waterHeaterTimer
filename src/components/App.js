import React, { Component } from 'react';
import io from 'socket.io-client'
import Settings from './Settings';
import Times from './Times';
import Controller from './Controller';
import './App.css';
import moment from 'moment'
import './Controller.css';

const socket = io()
const SERVER_URL = 'http://192.168.1.127:5000'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeToHeat: 60,
      timeLeftInSecond: 3600,
      isOn: false,
      timerInterval: null,
      lastTimeOn: null, // should be moment type obj
      lastTimeOnFor: 0 // num of minutes heater was on last time
    }

    this.onIncreaseSession = this.onIncreaseSession.bind(this);
    this.onDecreaseSession = this.onDecreaseSession.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onStartStop = this.onStartStop.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.updateTimeToHeat = this.updateTimeToHeat.bind(this)
  }

  componentDidMount() {
    socket.on('newStatus', status => {
      console.log(status);
      var newTimerInterval
      // now we need to differentiate between stop and reset
      // if stop, then we need to keep the timeLeft state
      // if reset, then we need to reset the timeLeft state
      if (!status.isOn && !!this.state.timerInterval) {
        newTimerInterval = null
        clearInterval(this.state.timerInterval)
      }
      if (status.isOn && !this.state.timerInterval) {
        console.log('turned on timer')
        newTimerInterval = setInterval(() => {
          this.decreaseTimer();
          this.phaseControl();
        }, 1000)
      }
      var newState = {}
      if (status.isOn)
        newState = { isOn: status.isOn, timeToHeat: status.timeToHeat, timeLeftInSecond: status.timeLeft }
      else if (status.stop)
        newState = { isOn: false, lastTimeOn: status.lastTimeOn, lastTimeOnFor: status.lastTimeOnFor }
      else if (status.reset)
        newState = {
          isOn: false, timeLeftInSecond: (this.state.timeToHeat * 60), lastTimeOn: status.lastTimeOn,
          lastTimeOnFor: status.lastTimeOnFor
        }
      if (newTimerInterval !== undefined)
        newState.timerInterval = newTimerInterval
      this.setState(newState)
    })

    // this only runs when app first starts to run
    fetch(SERVER_URL + '/api/status').then(res => res.json()).then(res => {
      var newState = {
        isOn: res.isOn, timeLeftInSecond: res.timeLeft, timeToHeat: res.timeToHeat, lastTimeOn: res.lastTimeOn,
        lastTimeOnFor: res.lastTimeOnFor,
        timerInterval: res.isOn ? setInterval(() => {
          this.decreaseTimer();
          this.phaseControl();
        }, 1000)
          : null
      }
      var localTimeToHeat = localStorage.getItem('timeToHeat')
      if (!res.isOn && !!localTimeToHeat) {
        localTimeToHeat = parseInt(localTimeToHeat)
        newState.timeToHeat = localTimeToHeat
        newState.timeLeftInSecond = localTimeToHeat * 60
      }
      this.setState(newState)
    })
  }


  onIncreaseSession() {
    if (!this.state.isOn) {
      localStorage.setItem('timeToHeat', this.state.timeToHeat + 1)
      this.setState(prevState => ({
        timeToHeat: prevState.timeToHeat + 1,
        timeLeftInSecond: (prevState.timeToHeat + 1) * 60
      }))
    }
  }

  onDecreaseSession() {
    if (this.state.timeToHeat > 1 && !this.state.isOn) {
      localStorage.setItem('timeToHeat', this.state.timeToHeat - 1)
      this.setState(prevState => ({
        timeToHeat: prevState.timeToHeat - 1,
        timeLeftInSecond: (prevState.timeToHeat - 1) * 60
      }))
    }
  }

  onReset() {
    if (this.state.isOn)
      fetch(SERVER_URL + '/api/stopTimer?reset=true')
    this.setState(prevState => ({ timeLeftInSecond: prevState.timeToHeat * 60 }))
  }

  onStartStop() {
    if (!this.state.isOn && this.state.timeToHeat > 0)
      fetch(SERVER_URL + '/api/startTimer?timeToHeat=' + this.state.timeToHeat + '&timeLeft=' + this.state.timeLeftInSecond)
    else
      fetch(SERVER_URL + '/api/stopTimer?stop=true')
  }

  decreaseTimer() {
    this.setState(prevState => ({ timeLeftInSecond: prevState.timeLeftInSecond - 1 }))
  }

  phaseControl() {
    if (this.state.timeLeftInSecond === -1)
      fetch(SERVER_URL + '/api/stopTimer')
  }

  updateTimeToHeat(event) {
    if (!this.state.isOn) {
      var newTime = event.target.value
      localStorage.setItem('timeToHeat', newTime)
      if (newTime >= 0 && newTime < 100)
        this.setState({ timeToHeat: parseInt(newTime), timeLeftInSecond: newTime * 60 })
    }
  }

  render() {
    return (
      <div className="pomodoro-clock">
        <div className="pomodoro-clock-header">
          <h1 className="pomodoro-clock-header-name">water heater switch</h1>
        </div>

        <Settings
          timeToHeat={this.state.timeToHeat}
          updateTimeToHeat={this.updateTimeToHeat}
          isOn={this.state.isOn}
          onDecreaseSession={this.onDecreaseSession}
          onIncreaseSession={this.onIncreaseSession}
        />

        <Times
          timeLeftInSecond={this.state.timeLeftInSecond}
        />

        <Controller className='controller'
          onReset={this.onReset}
          onStartStop={this.onStartStop}
          isOn={this.state.isOn}
        />

        {!!this.state.lastTimeOn && <h3 align='center'>Last time heater was on: {moment(this.state.lastTimeOn).subtract(3, 'seconds').fromNow()} for <u>{this.state.lastTimeOnFor}</u> minutes.</h3>}
      </div>
    );
  }
}
