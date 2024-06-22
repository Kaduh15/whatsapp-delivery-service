import { Boom } from '@hapi/boom'
import makeWASocket, {
  ConnectionState,
  DisconnectReason,
} from '@whiskeysockets/baileys'
import fs from 'fs'

export function connectionUpdate(
  sock: ReturnType<typeof makeWASocket>,
  connectToWhatsApp: () => void,
) {
  return async (update: Partial<ConnectionState>) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut
      console.log(
        'connection closed due to ',
        lastDisconnect?.error,
        ', reconnecting ',
        shouldReconnect,
      )
      // reconnect if not logged out
      if (shouldReconnect) {
        connectToWhatsApp()
      } else {
        fs.rmdirSync('auth', { recursive: true })
        connectToWhatsApp()
      }
    } else if (connection === 'open') {
      console.log('opened connection')
      if (sock.user) {
        await sock.sendMessage(sock.user.id, {
          text: 'Olá! Estou online! 🐧',
        })
      }
    }
  }
}
