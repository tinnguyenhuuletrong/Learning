const nodemailer = require('nodemailer')

async function main(account) {
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    secure: true,
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    }
  })

  const verifyRes = await transporter.verify()
  console.log(verifyRes)

  // send mail with defined transport object
  const sendResult = await transporter.sendMail(account.mailOptions)
  console.log(sendResult)
}

// Need set Password via AppPassword
//  https://myaccount.google.com/u/3/apppasswords

main({
  user: '<email>',
  pass: '<app_pass>',
  mailOptions: {
    to: 'nttnghia20@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<b>Hello world?</b>
    <h5>from nodemailer</h5>
    ` // html body
  }
})
