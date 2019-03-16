import React from 'react'
import './snackbar.css'

const SnackBar = () => {
  return <div id="snackbar">Some text some message..</div>
}

export default SnackBar

window.showMessage = function(msg) {
  // Get the snackbar DIV
  var x = document.getElementById('snackbar')

  x.innerHTML = msg

  // Add the "show" class to DIV
  x.className = 'show'

  // After 3 seconds, remove the show class from DIV
  setTimeout(function() {
    x.className = x.className.replace('show', '')
  }, 3000)
}
