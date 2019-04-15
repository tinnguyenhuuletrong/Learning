import { isBoolean } from 'util'

async function _inlineIfAsync(
  condition: Promise<Boolean>,
  trueReturn: Promise<any>,
  falseReturn: Promise<any>
): Promise<any> {
  let conditionValue = await condition
  return conditionValue ? await trueReturn : await falseReturn
}

function inlineIf(condition: Boolean, trueReturn: any, falseReturn: any): any
function inlineIf(
  condition: Promise<Boolean>,
  trueReturn: Promise<any>,
  falseReturn: Promise<any>
): Promise<any>
function inlineIf(
  condition: () => Boolean,
  trueReturn: any,
  falseReturn: any
): any
function inlineIf(
  condition: any,
  trueReturn: any,
  falseReturn: any
): any | Promise<any> {
  let conditionValue: Boolean = false
  if (isBoolean(condition)) {
    conditionValue = condition
  } else if (condition instanceof Function) {
    conditionValue = condition()
  } else if (condition instanceof Promise) {
    return _inlineIfAsync(Promise.resolve(condition), trueReturn, falseReturn)
  }
  return conditionValue ? trueReturn : falseReturn
}

export { inlineIf }
