import { curry } from 'rambda'

export const logError = curry((message: string, e: Error) => {
  console.log(message, e)
})
