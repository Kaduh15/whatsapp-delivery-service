import mongoose from 'mongoose'
import { Client, RemoteAuth } from 'whatsapp-web.js'
import { MongoStore } from 'wwebjs-mongo'

import { env } from './env'
import initialize from './initialize'

mongoose.connect(env.MONGODB_URI).then(() => {
  const store = new MongoStore({ mongoose })
  const client = new Client({
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs: 300000,
    }),
  })

  initialize(client)
})
