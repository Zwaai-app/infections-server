export class MockAjaxError extends Error {
  response: any

  constructor (message: string, errors?: any[]) {
    super(message)
    this.response = errors ? { errors } : {}
  }
}
