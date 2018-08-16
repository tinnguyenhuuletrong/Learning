require('dotenv').config()
const webpush = require("web-push")
const express = require('express')

webpush.setGCMAPIKey(process.env.GOOGLE_API_KEY)
webpush.setVapidDetails(
  "mailto:your-email-address@example-domain.com",
  process.env.PUBLIC_VAPID_KEY,
  process.env.PRIVATE_VAPID_KEY
)

const testData = {
  title: "Testing",
  body: "It's a success!",
  icon: "/path/to/an/icon.png"
}

let subscription
let pushIntervalID
const app = express()
app.use(express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))

app.use(express.json());

app.post("/register", (req, res, next) => {
  subscription = req.body
  console.log(subscription)
  pushIntervalID = setInterval(() => {
    // sendNotification can only take a string as it's second parameter
    webpush.sendNotification(subscription, JSON.stringify(testData))
      .then(console.log)
      .catch(console.error)
  }, 5000)

  res.status(201).json("ok")
})

app.delete("/unregister", (req, res, next) => {
  subscription = null
  clearInterval(pushIntervalID)
  res.status(200).json("ok")
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))