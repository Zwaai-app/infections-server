export type Idle = 'idle'
export type InProgress = 'inProgress'
export type Success = 'success'
export interface Failed {
  error: string
}
export type SyncStatus = Idle | InProgress | Success | Failed
