const StateMachine = require('javascript-state-machine')
const visualize = require('javascript-state-machine/lib/visualize')

const { promisify } = require('util')

const waitMs = promisify(setTimeout)

// onBeforeTransition - fired before any transition
// onBefore<TRANSITION> - fired before a specific TRANSITION
// onLeaveState - fired when leaving any state
// onLeave<STATE> - fired when leaving a specific STATE
// onTransition - fired during any transition
// onEnterState - fired when entering any state
// onEnter<STATE> - fired when entering a specific STATE
// on<STATE> - convenience shorthand for onEnter<STATE>
// onAfterTransition - fired after any transition
// onAfter<TRANSITION> - fired after a specific TRANSITION
// on<TRANSITION> - convenience shorthand for onAfter<TRANSITION>

const fsm = new StateMachine({
  init: 'red',
  data: {
    color: 'red'
  },
  transitions: [
    { name: 'toGreen', from: 'red', to: 'green' },
    { name: 'toYellow', from: 'green', to: 'yellow' },
    { name: 'toRed', from: 'yellow', to: 'red' }
  ],
  methods: {
    onLeaveState: function(txInfo) {
      console.log('leave', txInfo.from)
    },
    onEnterState: function(txInfo) {
      this.color = txInfo.to
      console.log('enter', txInfo.to)
    },
    onBeforeToGreen: async function(txInfo, sleepMs = 1000) {
      console.log('onBeforeToGreen begin', sleepMs)
      await waitMs(sleepMs)
      console.log('onBeforeToGreen end')
    }
  }
})

//async transition took 20 sec
// fsm.toGreen(5000)

// Error should throw
// fsm.toGreen()
console.log(visualize(fsm))
