import ReactDOM from 'react-dom'
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.authFunc = this.authFunc.bind(this)
  }
  authFunc() {
    const authData = { data: 'Auth on my site' }
    if (WavesKeeper) {
      WavesKeeper.auth(authData)
        .then(auth => {
          console.log(auth) //displaying the result on the console
          /*...processing data */
        })
        .catch(error => {
          console.error(error) // displaying the result on the console
          /*...processing errors */
        })
    } else {
      alert('To Auth WavesKeeper should be installed.')
    }
  }
  render() {
    return (
      <div className="container d-flex flex-row justify-content-around">
        <input
          className="btn btn-primary"
          type="submit"
          value="Auth"
          onClick={this.authFunc}
        />
      </div>
    )
  }
}

const app = document.getElementById('app')
if (app) {
  ReactDOM.render(<App />, app)
}
