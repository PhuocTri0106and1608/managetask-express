/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB, GET_DB } from '~/config/mongodb'
import { env } from '~/config/environment'

const START_SERVER = () => {
  const app = express()
  const hostname = 'localhost'
  const port = 3000

  app.get('/', async(req, res) => {
    console.log(await GET_DB().listCollections().toArray())
    res.send('<h1>Hello</h1>')
  })

  app.listen(port, hostname, () => {
    console.log(`3. Hi ${env.AUTHOR}, Server is running at http://${ hostname }:${ port }/`)
  })
  //Clean up trước khi close
  exitHook(() => {
    CLOSE_DB()
    console.log('4. Disconnected from MongoDB Cloud Atlas')
  })
}

// Immediately-invoked / Anonymous Async Function (IIFE)
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas...')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()