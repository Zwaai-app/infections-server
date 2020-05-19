import { PayloadAction } from '@reduxjs/toolkit'
import { Observable } from 'rxjs'
import { ajax } from 'rxjs/ajax'

export type OptionsCreator<P> = (action: PayloadAction<P>) => any
export const ajaxObservable = <P>(optionsCreator: OptionsCreator<P>) => (
  action: PayloadAction<P>
): Observable<any> => ajax(optionsCreator(action))
