import { Request, Response } from 'express'

/**
 * GET /
 * Home page.
 */
export const index = (_req: Request, res: Response) => {
  res.render('home', {
    title: 'Home'
  })
}
