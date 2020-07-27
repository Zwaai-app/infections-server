import request from 'supertest'
import app from '../src/app'
import { initialize } from '../src/controllers/spaceCheckin'
import { GroupElement } from '@zwaai/common'
import { expect } from 'chai'

const server = request.agent(app)

describe('/api/v1/space/checkin', () => {
  beforeEach(async () => {
    await initialize(app)
  })

  it('errors when param missing', done => {
    server
      .post('/api/v1/space/checkin')
      .send({})
      .expect(400, done)
  })

  it('succeeds when param wrong', done => {
    server
      .post('/api/v1/space/checkin')
      .send({ encryptedLocation: 'invalid' })
      .expect(400, done)
  })

  it('succeeds when param valid', done => {
    const rlString = GroupElement.random().toHexString()
    server
      .post('/api/v1/space/checkin')
      .send({ encryptedLocation: rlString })
      .expect(200)
      .end((_err, res) => {
        expect(res.body.encryptedLocationTimeCodes).to.have.length(8 * 12)
        done()
      })
  })
})
