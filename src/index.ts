import { Client, LocalAuth } from 'whatsapp-web.js'

import initialize from './initialize'

const client = new Client({
  authStrategy: new LocalAuth(),
})

initialize(client)
