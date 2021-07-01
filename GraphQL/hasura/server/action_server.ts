import express from "express"

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Request Handler
app.post('/wellcome_sync', async (req, res) => {
  // get request input
  const { input, session_variables } = req.body
  const { arg: { name } } = input

  const userId = session_variables['x-hasura-user-id']

  console.log(req.body, req.headers)
  // success
  return res.json({
    message: `
    Hello from Nodejs. Wellcome ${name}
    userId: ${userId}
    `
  })
});

app.listen(PORT);
