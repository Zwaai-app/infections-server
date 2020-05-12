export type Idle = 'idle'
export type InProgress = 'inProgress'
export type Success = 'success'
export interface Failed {
  error: string
}
export type SyncStatus = Idle | InProgress | Success | Failed

export function isError (status: SyncStatus) {
  // tslint:disable-next-line: strict-type-predicates
  return (status as Failed).error !== undefined
}
