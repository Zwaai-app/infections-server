export const t = function (key: string, fallback: string): string {
  return process.env.NODE_ENV === 'test' ? key : fallback
}
