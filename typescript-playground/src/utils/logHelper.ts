import { inspect } from 'util'

function log({ name, ...others }: { name: string; [x: string]: any }) {
  const params = {
    ...(others || {}),
    _t: new Date()
  }
  console.log(
    `\x1b[2m[${name}]\x1b[0m`,
    inspect(params, { showHidden: false, depth: null, colors: true })
  )
}

export { log }
