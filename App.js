/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import RNSoundLevel from 'react-native-sound-level';
import { green } from 'ansi-colors';
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component<Props>{
  constructor(props) {
    super(props);
    this.state = {
      currentLevel : 0,
      recordingOver80: false,
      recordedTimeOver80: 0,
      recordingOver100: false,
      recordedTimeOver100: 0,
      recordingOver120: false,
      recordedTimeOver120: 0,
    }
    this.setCurrentLevel = this.setCurrentLevel.bind(this);
  }

  componentDidMount() {
    RNSoundLevel.start()
    RNSoundLevel.onNewFrame = (data) => {
      this.setCurrentLevel(data);
    }
    this.interval = setInterval( () => {
      this.updateTime();
    }, 1000)
  }

  /**
   * Set background color based on Decibel level
   */
  getBackgroundColor() {
    const { currentLevel } = this.state;
    if( currentLevel > 0 && currentLevel < 41) {
      return {
        backgroundColor : '#00ff00'
      }
    } else  if( currentLevel > 40 && currentLevel < 61) {
      return {
        backgroundColor : '#ffff00'
      }
    }  if( currentLevel > 60 && currentLevel < 81) {
      return {
        backgroundColor : '#ff8000'
      }
    }  if( currentLevel > 80 && currentLevel < 120) {
      return {
        backgroundColor : '#800000'
      }
    }  if( currentLevel > 119) {
      return {
        backgroundColor : '#ff0000'
      }
    }
  } 

  setCurrentLevel(data) {
    const level = Math.round(data.value + 160);
    if (level > 120 && !this.state.recordingOver120) {
      alert("Warning! You should wear protective ear gear!");
    }
    this.setState({currentLevel: level});
  }
  
  /**
   * Update Over time of specific Decibel value
   */
  updateTime() {
    if(this.state.currentLevel > 80 && !this.state.recordingOver80) {
      this.setState({
        recordingOver80: true
      });
    } 
    else if(this.state.currentLevel > 80 && this.state.recordingOver80) {
      this.setState((prevState) => ({
        recordedTimeOver80: ++ prevState.recordedTimeOver80
      }));
    } 
    else if(this.state.currentLevel < 81 && this.state.recordingOver80) {
      this.setState({
        recordingOver80: false
      });
    }

    if(this.state.currentLevel > 100 && !this.state.recordingOver100) {
      this.setState({
        recordingOver100: true
      });
    } 
    else if(this.state.currentLevel > 100 && this.state.recordingOver100) {
      this.setState((prevState) => ({
        recordedTimeOver100: ++ prevState.recordedTimeOver100
      }));
    } 
    else if(this.state.currentLevel < 101 && this.state.recordingOver100) {
      this.setState({
        recordingOver100: false
      });
    }

    if(this.state.currentLevel > 120 && !this.state.recordingOver120) {
      this.setState({
        recordingOver120: true
      });
    } 
    else if(this.state.currentLevel > 120 && this.state.recordingOver120) {
      this.setState((prevState) => ({
        recordedTimeOver120: ++ prevState.recordedTimeOver120
      }));
    } 
    else if(this.state.currentLevel < 121 && this.state.recordingOver120) {
      this.setState({
        recordingOver120: false
      });
    }
  }

  componentWillUnmount() {
    RNSoundLevel.stop();
    clearInterval(this.interval);
  }

  /**
   * Conver seconds to readable string: xx days xx hours xx minutes xx seconds
   */
  convertToReadableString(seconds) {
    let readableString;
    let sec, minutes, hours, days;
    if(seconds < 60) {
      readableString = `${seconds} seconds`
      return readableString;
    } 
    sec = seconds % 60;
    minutes = Math.floor(seconds / 60);
    if(minutes < 60) {
      readableString = `${minutes} minutes ${sec} seconds`;
      return readableString;
    }
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    if(hours < 24) {
      readableString = `${hours} hours ${minutes} minutes ${sec} seconds`;
      return readableString;
    }
    days = Math.floor(hours / 24);
    hours = hours % 24;
    readableString = `${days} days ${hours} hours ${minutes} minutes ${sec} seconds`;
    return readableString;
  }

  render() {
    const { recordedTimeOver80 , recordedTimeOver100, recordedTimeOver120, currentLevel} = this.state;
    const readableRecordedTimeOver80 = this.convertToReadableString(recordedTimeOver80);
    const readableRecordedTimeOver100 = this.convertToReadableString(recordedTimeOver100);
    const readableRecordedTimeOver120 = this.convertToReadableString(recordedTimeOver120);
    return (
      <View style={[styles.container, this.getBackgroundColor()]}>
        <Text style={styles.title}>Current Decibel</Text>
        <Text style={styles.currentValue}>{currentLevel}</Text>
        <View style={styles.overTimeFields}>
          <Text style={styles.overTimeField}> {readableRecordedTimeOver80} of sound over <Text style={styles.limitValue}>80db</Text></Text>
          <Text style={styles.overTimeField}> {readableRecordedTimeOver100} of sound over <Text style={styles.limitValue}>100db</Text></Text>
          <Text style={styles.overTimeField}> {readableRecordedTimeOver120} of sound over <Text style={styles.limitValue}>120db</Text> </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  currentValue: {
    fontSize : 70
  },
  overTimeFields: {
    marginTop: 50
  },
  overTimeField: {
    fontSize: 15,
    margin: 10
  },
  limitValue: {
    fontSize: 16
  }
});
