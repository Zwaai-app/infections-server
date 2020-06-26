import * as A from 'fp-ts/lib/Array'

export function createRandom (): Uint8Array {
  let random = new Uint8Array(16)
  window.crypto.getRandomValues(random)
  return random
}

export function bytesToHex (bytes: Uint8Array): string {
  return A.map(byteToHex)(Array.from(bytes)).join('')
}

export function byteToHex (byte: number): string {
  return ('0' + (byte & 0xff).toString(16)).slice(-2)
}
