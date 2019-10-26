process.env.DEBUG = 'bpmn-engine:*'

const { Engine } = require('bpmn-engine')
const fs = require('fs')

const engine = Engine({
  name: 'using variables',
  source: fs.readFileSync('./model/simple-task.bpmn')
})

const variables = {
  input: 10
}

engine.execute(
  {
    variables
  },
  (err, engineApi) => {
    if (err) throw err
    console.log('completed')
  }
)
