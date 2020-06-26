import { byteToHex, bytesToHex } from './Random'

it('can convert a short byte to a hex string', () => {
  expect(byteToHex(0)).toBe('00')
})

it('can convert a byte to a hex string', () => {
  expect(byteToHex(0xa3)).toBe('a3')
})

it('can convert an array of bytes to a hex string', () => {
  let bytes = new Uint8Array([0x00, 0x11, 0x53, 0xff])
  expect(bytesToHex(bytes)).toBe('001153ff')
})
