import React from 'react'
import './snackbar.css'

const SnackBar = () => {
  return <div id="snackbar">Some text some message..</div>
}

export default SnackBar

let prevTicket = null

window.showMessage = function(msg) {
  // Get the snackbar DIV
  var x = document.getElementById('snackbar')

  x.innerHTML = msg

  // Add the "show" class to DIV
  x.className = 'show'

  if (prevTicket) clearTimeout(prevTicket)

  // After 3 seconds, remove the show class from DIV
  prevTicket = setTimeout(function() {
    x.className = x.className.replace('show', '')
    prevTicket = null
  }, 3000)
}
