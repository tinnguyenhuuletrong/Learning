import React from 'react'
import WebRtcHost from './components/WebRtcHost'
import WebRtcClient from './components/WebRtcClient'
import TabContainer from './containers/TabContainer'
import AppStore from './stores/appStore'
import { AppProvider } from './AppContext'

const storeIns = new AppStore()

function App() {
  return (
    <AppProvider value={storeIns}>
      <section className="section ">
        <div className="container">
          <section className="hero">
            <div className="hero-body">
              <div className="container">
                <h1 className="title">Web RTC Playground</h1>
              </div>
            </div>
          </section>
          <p className="has-text-centered is-size-3">Start here !</p>
          <div className="column">
            <div className="box">
              <TabContainer
                tabs={[
                  {
                    name: 'Host',
                    ContentComp: <WebRtcHost />
                  },
                  {
                    name: 'Peer',
                    ContentComp: <WebRtcClient />
                  }
                ]}
              />
            </div>
          </div>
          <div className="column is-multiline">
            <div className="box">
              <div className="column is-full">
                <div
                  className="container has-background-grey-lighter is-size-7"
                  style={{
                    minHeight: '50vh',
                    maxHeight: '50vh',
                    overflowY: 'auto',
                    padding: '5px 10px'
                  }}
                >
                  <p>[Date] - Content 1</p>
                  <p>[Date] - Content 2</p>
                </div>
              </div>
              <div className="column">Type info</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer class="footer">
          <div class="content has-text-centered">
            <p>
              <strong>Bulma</strong> by{' '}
              <a href="https://jgthms.com">Jeremy Thomas</a>. The source code is
              licensed
              <a href="http://opensource.org/licenses/mit-license.php">MIT</a>.
              The website content is licensed{' '}
              <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
                CC BY NC SA 4.0
              </a>
              .
            </p>
          </div>
        </footer>
      </section>
    </AppProvider>
  )
}

export default App
