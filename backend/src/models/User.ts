import bcrypt from 'bcrypt'
import crypto from 'crypto'
import mongoose from 'mongoose'

const saltRounds = 10

export interface UserProfile {
  organizationName: string
  organizationUrl: string
  phone: string
  logo: string
}

export type UserDocument = mongoose.Document & {
  email: string
  password: string
  passwordResetToken: string
  passwordResetExpires: Date
  tokens: AuthToken[]
  profile: UserProfile

  comparePassword: comparePasswordFunction
  gravatar: (size: number) => string
}

type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => {}
) => void

export interface AuthToken {
  accessToken: string
  kind: string
}

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    twitter: String,
    google: String,
    tokens: Array,

    profile: {
      organizationName: String,
      organizationUrl: String,
      phone: String,
      logo: String
    }
  },
  { timestamps: true }
)

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save (next) {
  const user = this as UserDocument
  if (!user.isModified('password')) {
    return next()
  }
  // tslint:disable-next-line: no-floating-promises
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return next(err)
    }
    // tslint:disable-next-line: no-floating-promises
    bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => {}
) {
  // tslint:disable-next-line: no-floating-promises
  bcrypt.compare(
    candidatePassword,
    this.password,
    (err: mongoose.Error, isMatch: boolean) => {
      cb(err, isMatch)
    }
  )
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`
  }
  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

export const User = mongoose.model<UserDocument>('User', userSchema)
