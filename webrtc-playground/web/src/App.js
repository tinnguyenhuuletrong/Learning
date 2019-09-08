import React from 'react'
import ChoiceMode from './components/ChoiceMode'
import WebRtcHost from './components/WebRtcHost'
import WebRtcClient from './components/WebRtcClient'
import WebRtcStatus from './components/WebRtcStatus'
import WebRtcLog from './components/WebRtcLog'
import WebRtcData from './components/WebRtcData'
import WebRtcVideoCall from './components/WebRtcVideoCall'
import WebRTCSupport from './containers/WebRTCSupport'
import DisplayIfMode from './containers/DisplayIfMode'
import { StateProvider, CONSTANT } from './AppContext'

function App() {
  return (
    <StateProvider>
      <section className="section ">
        <div className="container">
          <section className="hero">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">Web RTC Playground</h1>
              </div>
            </div>
          </section>
          <WebRTCSupport>
            <p className="has-text-centered is-size-3">Start here !</p>
            <div className="column">
              <div className="box">
                <ChoiceMode />
              </div>
            </div>

            <DisplayIfMode expectedMode={CONSTANT.ECLIENT_MODE.HOST}>
              <div className="column">
                <div className="box">
                  <WebRtcHost />
                </div>
              </div>
            </DisplayIfMode>

            <DisplayIfMode expectedMode={CONSTANT.ECLIENT_MODE.PEER}>
              <div className="column">
                <div className="box">
                  <WebRtcClient />
                </div>
              </div>
            </DisplayIfMode>

            <div className="column">
              <WebRtcStatus />
            </div>

            <div className="column is-multiline">
              <div className="box">
                <WebRtcLog />
              </div>
              <div className="box">
                <WebRtcData />
              </div>
              <div className="box">
                <WebRtcVideoCall />
              </div>
            </div>
          </WebRTCSupport>
        </div>
      </section>
    </StateProvider>
  )
}

export default App
