import errorHandler from 'errorhandler'

import app from './app'
import { initialize } from './controllers/spaceCheckin'

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

/**
 * Start Express server.
 */
let server

initialize(app)
  .then(() => {
    server = app.listen(app.get('port'), () => {
      console.log(
        '  App is running at http://localhost:%d in %s mode',
        app.get('port'),
        app.get('env')
      )
      console.log('  Press CTRL-C to stop\n')
    })
  })
  .catch(error => {
    console.error('Failed to initialize crypto', error)
  })

export default server
