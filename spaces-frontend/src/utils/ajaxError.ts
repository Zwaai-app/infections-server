import { AjaxError } from 'rxjs/ajax'
import { t } from '../i18n'

export const ajaxErrorToString = (e: AjaxError): string => {
  if (e.xhr?.status === 401 || e.xhr?.status === 403) {
    return t('general.accessDenied', 'toegang geweigerd')
  }
  return (
    e.response?.errors?.join('; ') ||
    e.message ||
    t('general.unknownError', 'onbekende fout')
  )
}
