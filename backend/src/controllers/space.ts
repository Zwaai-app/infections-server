import { Request, Response, NextFunction } from 'express'
import { body, validationResult } from 'express-validator'
import { Space } from '../models/Space'
import { UserDocument } from '../models/User'
import * as R from 'rambda'

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
    return res.status(401).json({ errors: errors.array() })
  }

  const user = req.user as UserDocument
  Space.findOne({ user, name: req.body.name }, (err, existingSpace) => {
    if (err) {
      return next(err)
    }
    if (existingSpace) {
      return res
        .status(401)
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
  body('name')
    .notEmpty()
    .trim(),
  body('description').trim(),
  body('autoCheckout')
    .isInt()
    .toInt()
]

export const postSpace = {
  apiHandler: postSpaceApi,
  sanitizers: postSpaceApiSanitizers
}

const deleteSpaceApi = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json')

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() })
  }

  Space.remove({ _id: req.body._id }, err => {
    if (err) {
      return next(err)
    }
    return res.status(200).json({})
  })
}

const deleteSpaceSanitizers = [body('_id').matches(/^[a-f0-9]{24}$/)]

export const deleteSpace = {
  apiHandler: deleteSpaceApi,
  sanitizers: deleteSpaceSanitizers
}
