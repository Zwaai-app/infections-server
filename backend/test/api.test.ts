import request from 'supertest'
import app from '../src/app'

describe('POST /api/v1/logout', () => {
  it('should return 200 OK', () => {
    return request(app)
      .post('/api/v1/logout')
      .expect(200)
  })
})
