import { AjaxError } from 'rxjs/ajax'
import { t } from '../i18n'
import { PayloadAction } from '@reduxjs/toolkit'

export const extractAjaxErrorInfo = (e: AjaxError): ErrorInfo => {
  let errorInfo: ErrorInfo = { code: e.status, message: '' }

  if (e.status === 401 || e.status === 403) {
    errorInfo.code = e.xhr.status
    errorInfo.message = t('general.accessDenied', 'toegang geweigerd')
  } else {
    errorInfo.message =
      e.response?.errors?.join('; ') ||
      e.message ||
      t('general.unknownError', 'onbekende fout')
  }

  return errorInfo
}

export interface ErrorInfo {
  code?: number
  message: string
}

export const isErrorAction = (action: PayloadAction<any>): boolean =>
  action.payload?.hasOwnProperty('code') &&
  action.payload?.hasOwnProperty('message')
