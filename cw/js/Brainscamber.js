//If a . or < or > operation appears and the current number is undefined, do not add anything to the output or shift anything.
//If a + or - appear and the current number is undefined then set the current number to 0
function updateDigit(char, output) {
  if( output.data.length == 0 && (char == '-' || char == '+'))
    output.data += char
  else if(char >='0' && char <= '9')
    output.data += char
  else
    return false

  return true
}
function Stack() {
  this.MEM = [
    [],
    [],
    []
  ];
  this.index = 0;
}
Stack.prototype.reset = function () {
  this.index = 0;
  this.MEM = [
    [],
    [],
    []
  ];
}
Stack.prototype.push = function(val) {
  this.MEM[this.index].push(val)
}
Stack.prototype.pop = function() {
  return this.MEM[this.index].pop()
}
Stack.prototype.top = function() {
  const currentStack = this.MEM[this.index]
  return currentStack[currentStack.length - 1]
}
Stack.prototype.add = function(offset) {
  let val = this.pop()
  if (val == null) {
    val = 0;
    offset = 0;
  }
  this.push(val + offset)
}
Stack.prototype.rotate = function() {
  this.index = (this.index + 1) % 3
}
Stack.prototype.moveRight = function() {
  let val = this.pop()
  if (val == null)
    return;
  let next = (this.index + 1) % 3
  this.MEM[next].push(val)
}
Stack.prototype.moveLeft = function() {
  let val = this.pop()
  if (val == null)
    return;
  let next = (this.index + 3 - 1) % 3
  this.MEM[next].push(val)
}

const Instruction = {
  "+": function(stack, output, parser) {
    stack.add(1)
  },
  "-": function(stack, output, parser) {
    stack.add(-1)
  },
  "*": function(stack, output, parser) {
    stack.push(0)
  },
  "<": function(stack, output, parser) {
    stack.moveLeft()
  },
  ">": function(stack, output, parser) {
    stack.moveRight()
  },
  ".": function(stack, output, parser) {
    let val = stack.top()
    if (val != null)
      output.push(val)
  },
  "^": function(stack, output, parser) {
    let val = stack.pop()
  },
  "#": function(stack, output, parser) {
    stack.rotate()
  },
  ",": function(stack, output, parser) {
    let inputVal = {
      data:''
    }
    parser.index++;

    while(updateDigit(parser.data[parser.index], inputVal)) {
      parser.index++
    }
    parser.index--

    stack.push(+inputVal.data)
  },
  "[": function(stack, output, parser) {
    let val = stack.top() || 0
    if (val > 0)
      parser.loop.push(parser.index)
    else {
      let endIndex = parser.data.indexOf(']', parser.index + 1)
      if (endIndex == -1)
        throw new Error("Close tag missing")
      parser.index = endIndex + 1;
    }
  },
  "]": function(stack, output, parser) {
    parser.index = parser.loop.pop() - 1
  }
}

const Interpreter = function() {
  let stack = new Stack()
  let output = []



  return {
    read: function(input) {
      output.length = 0;
      stack.reset();

      parser = {
        loop: [],
        data: input,
        index: 0
      }
      while (parser.index < input.length) {
        const char = input[parser.index]
        Instruction[char](stack, output, parser)
        parser.index++;

        //console.log(char, parser, stack, output)
      }
      return output.join('')
    }
  };
}

//--------------------------------------------------------------//
var inter = new Interpreter();

console.log(inter.read('-.--+,926+*++.,441*,778+,726,535,774.+.*,357*-'))