import { AjaxError } from 'rxjs/ajax'

export const ajaxErrorToString = (e: AjaxError): string =>
  e.response?.errors?.join('; ') || e.message || 'unknown server error'
