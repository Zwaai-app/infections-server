export const t = function (
  key: string,
  fallback: string,
  replacements?: Map<string, string>
): string {
  return process.env.NODE_ENV === 'test'
    ? key
    : (() => {
        let translation = fallback
        if (replacements) {
          replacements.forEach((v, k) => {
            translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), v)
          })
        }
        return translation
      })()
}
