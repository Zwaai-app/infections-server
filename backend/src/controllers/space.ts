import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { Space, SpaceDocument } from '../models/Space'
import { UserDocument } from '../models/User'
import { WriteError } from 'mongodb'
import * as R from 'rambda'

const idSanitizer = body('_id').matches(/^[a-f0-9]{24}$/)
const nameSanitizer = body('name')
  .notEmpty()
  .trim()
const descriptionSanitizer = body('description').trim()
const autoCheckoutSanitizer = body('autoCheckout')
  .isInt()
  .toInt()

export const getSpacesApi = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.setHeader('Content-Type', 'application/json')
  const user = req.user as UserDocument
  Space.find({ user }, (err, docs) => {
    if (err) return next(err)

    return res.json(docs)
  })
}

const postSpaceApi = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const user = req.user as UserDocument
  Space.findOne({ user, name: req.body.name }, (err, existingSpace) => {
    if (err) {
      return next(err)
    }
    if (existingSpace) {
      return res
        .status(400)
        .json({ errors: ['space with that name already exists'] })
    }
    const space = new Space({
      user: user,
      name: req.body.name,
      description: req.body.description || '',
      autoCheckout: req.body.autoCheckout
    })
    // tslint:disable-next-line: no-floating-promises
    space.save(err => {
      if (err) {
        return next(err)
      }
      return res.json(R.omit('user', space.toJSON()))
    })
  })
}

const postSpaceApiSanitizers = [
  nameSanitizer,
  descriptionSanitizer,
  autoCheckoutSanitizer
]

export const postSpace = {
  apiHandler: postSpaceApi,
  sanitizers: postSpaceApiSanitizers
}

const putSpaceApi = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const user = req.user as UserDocument
  Space.findById(req.body._id, (err, space: SpaceDocument) => {
    if (err) return next(err)
    if (space.user._id.toString() !== user._id.toString()) {
      return res.sendStatus(403)
    }

    space.name = req.body.name
    space.description = req.body.description
    space.autoCheckout = req.body.autoCheckout

    // tslint:disable-next-line: no-floating-promises
    space.save((err: WriteError) => {
      if (err) {
        return res.status(400).json({ errors: ['Could not save the space'] })
      }
      return res.status(200).json({})
    })
  })
}

const putSpaceApiSanitizers = [...postSpaceApiSanitizers, idSanitizer]

export const putSpace = {
  apiHandler: putSpaceApi,
  sanitizers: putSpaceApiSanitizers
}

const deleteSpaceApi = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  Space.remove({ _id: req.body._id }, err => {
    if (err) {
      return next(err)
    }
    return res.status(200).json({})
  })
}

const deleteSpaceSanitizers = [idSanitizer]

export const deleteSpace = {
  apiHandler: deleteSpaceApi,
  sanitizers: deleteSpaceSanitizers
}
