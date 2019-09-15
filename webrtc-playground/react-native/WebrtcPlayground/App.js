/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import Header from './src/components/Header';
import ChoiceMode from './src/components/ChoiceMode/ChoiceMode';
import WebRtcHost from './src/components/WebRTC/WebRtcHost';
import WebRtcClient from './src/components/WebRTC/WebRtcClient';
import WebRtcStatus from './src/components/WebRTC/WebRtcStatus';

import SectionContainer from './src/containers/Section';
import DisplayIfMode from './src/containers/DisplayIfMode';
import {StateProvider, CONSTANT} from './AppContext';

const App = () => {
  return (
    <StateProvider>
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            <View style={styles.body}>
              <SectionContainer titleText="Step 1">
                <ChoiceMode />
              </SectionContainer>

              <DisplayIfMode expectedMode={CONSTANT.ECLIENT_MODE.HOST}>
                <SectionContainer titleText="Host">
                  <WebRtcHost />
                </SectionContainer>
              </DisplayIfMode>

              <DisplayIfMode expectedMode={CONSTANT.ECLIENT_MODE.PEER}>
                <SectionContainer titleText="Peer">
                  <WebRtcClient />
                </SectionContainer>
              </DisplayIfMode>

              <WebRtcStatus />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Fragment>
    </StateProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
