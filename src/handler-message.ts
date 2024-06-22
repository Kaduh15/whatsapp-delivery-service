import makeWASocket, { MessageUpsertType, proto } from '@whiskeysockets/baileys'

import { ChatBotHandler } from './chat-bot'

type MessageUpsert = (arg: {
  messages: proto.IWebMessageInfo[]
  type: MessageUpsertType
}) => void

export const handleMessage: (
  sock: ReturnType<typeof makeWASocket>,
) => MessageUpsert = (sock) => async (m) => {
  const bot = new ChatBotHandler()
  if (m.messages[0].key.fromMe) return

  const userId = m.messages[0].key.remoteJid
  const message = m.messages[0].message?.conversation || ''

  const response = bot.handleMessage(userId!, message)

  await sock.sendMessage(
    userId!,
    {
      text: response,
    },
    {
      timestamp: new Date(),
    },
  )
}
