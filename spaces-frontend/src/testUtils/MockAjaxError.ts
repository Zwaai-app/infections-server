export class MockAjaxError extends Error {
  response: any

  constructor (message: string, errors?: any[]) {
    super(message)
    if (errors) {
      this.response = { errors }
    }
  }
}
