import request from 'supertest'
import app from '../src/app'
import { expect } from 'chai'

const testUser = {
  email: 'test@test.com',
  password: 'Test1234',
  confirmPassword: 'Test1234'
}

const server = request.agent(app)

describe('/api/v1/space', () => {
  /**
   * WARNING!!! THE TESTS BELOW ARE DEPENDENT BECAUSE THEY SHARE
   * DATABASE STATE!
   */
  let createdSpaceId: string

  beforeAll(async () => {
    await ensureTestUserExists()
    await login()
  })

  it('can create a space', done => {
    server
      .post('/api/v1/space')
      //   .auth(testUser.email, testUser.password)
      .send({ name: 'test space', autoCheckout: 3600 })
      .expect(200)
      .end((_err, res) => {
        expect(res.body._id).not.to.be.undefined
        createdSpaceId = res.body._id
        console.debug(createdSpaceId)
        done()
      })
  })

  it('cannot create the space twice', done => {
    return server
      .post('/api/v1/space')
      .send({ name: 'test space', autoCheckout: 3600 })
      .expect(401, done)
  })

  it('can delete the space', done => {
    server
      .delete('/api/v1/space')
      .send({ _id: createdSpaceId })
      .expect(200, done)
  })

  test('delete rejects invalid space id', done => {
    server
      .delete('/api/v1/space')
      .send({ _id: 'invalid' })
      .expect(401, done)
  })
})

async function ensureTestUserExists () {
  await server.post('/api/v1/signup').send(testUser)
}

async function login () {
  await server
    .post('/api/v1/login')
    .send(testUser)
    .expect(200)
}
