/**
 * Simple i18n function, intended to be replaced with something more advanced
 * later. But this way at least there is single-point-of-definition for all
 * translatable strings.
 *
 * This function supports template strings. For example, you can have a
 * translation: "maximum 100KB", but you want to fill in the number from
 * somewhere else. You can then invoke like this:
 *
 * ```typescript
 * t('domain.key', 'maximum {{size}}KB', new Map([['size', `${maxSize}`]]))
 * ```
 *
 * @param key key to lookup translation in translations database
 * @param fallback value to be returned when key not found in translation database
 * @param replacements map of template strings in translations
 */
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
