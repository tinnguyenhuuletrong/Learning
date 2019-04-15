function commandLogDecorator(commandName: string) {
  return function(target: any, key: any, descriptor: any) {
    const originalMethod = descriptor.value

    //editing the descriptor/value parameter
    descriptor.value = function() {
      var args = []
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i - 0] = arguments[_i]
      }
      var a = args.map(function(a) {
        return JSON.stringify(a)
      })
      // note usage of originalMethod here
      var result = originalMethod.apply(this, args)
      var r = JSON.stringify(result)
      console.log('COMMAND', commandName, {
        input: a,
        output: r
      })
      return result
    }
    return descriptor
  }
}

export { commandLogDecorator }
