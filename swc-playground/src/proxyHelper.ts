export const wrappedWithFuncCallLog = <T = any>(
  ins: T,
  { withFuncParamLog }: { withFuncParamLog: boolean } = {
    withFuncParamLog: false,
  }
): T => {
  return new Proxy(ins as any, {
    get: function (target, name, receiver) {
      if (!target.hasOwnProperty(name)) {
        if (
          typeof target[name] === "function" &&
          String(name).includes("visit")
        ) {
          console.log("Calling method:", name);
        }
        return function () {
          if (withFuncParamLog)
            console.log(`\tparams: ${JSON.stringify(arguments)}`);
          return target[name].apply(this, arguments);
        };
      }
      return Reflect.get(target, name, receiver);
    },
  }) as unknown as T;
};
