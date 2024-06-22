import makeWASocket, { useMultiFileAuthState } from '@whiskeysockets/baileys'
import P from 'pino'

import { connectionUpdate } from './connetion-update'
import { handleMessage } from './handler-message'

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('tokens')

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: P({
      level: 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          ignore: 'pid,hostname',
        },
      },
    }),
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', connectionUpdate(sock, connectToWhatsApp))

  sock.ev.on('messages.upsert', handleMessage(sock))
}
// run in main file
connectToWhatsApp()
