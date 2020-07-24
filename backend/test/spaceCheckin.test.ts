import request from 'supertest'
import app from '../src/app'
import { initialize } from '../src/controllers/spaceCheckin'
import { GroupElement } from '../src/crypto/finiteField'
import { expect } from 'chai'
import * as O from 'fp-ts/lib/Option'

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
        expect(
          O.toUndefined(
            GroupElement.fromHexString(res.body.encryptedLocationTime)
          )
        ).not.to.be.undefined
        done()
      })
  })
})
