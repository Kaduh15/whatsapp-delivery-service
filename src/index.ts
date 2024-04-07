import { Boom } from '@hapi/boom'
import makeWASocket, {
  DisconnectReason,
  MessageUpsertType,
  proto,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth')

  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) {
      console.log('qr code:', qr)
    }

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
      }
    } else if (connection === 'open') {
      console.log('opened connection')

      if (!sock.user) return

      await sock.sendMessage(sock.user?.id, {
        text: 'Olá, estou online!',
      })
    }
  })
  sock.ev.on('messages.upsert', async (m) => {
    await fluxo(m, sock)
  })
}

// run in main file
connectToWhatsApp()

async function fluxo(
  m: {
    messages: proto.IWebMessageInfo[]
    type: MessageUpsertType
  },
  sock: ReturnType<typeof makeWASocket>,
) {
  const message = m.messages[0].message?.conversation || ''
  if (m.messages[0]?.key?.fromMe) return
  if (!message) {
    await sock.sendMessage(m.messages[0].key.remoteJid || '', {
      text: `Eu não entendo outra mensagem que não seja texto.`,
    })

    return
  }
  const remoteJid = m.messages[0].key.remoteJid || ''

  if (message === '1') {
    await sock.sendMessage(
      remoteJid,
      {
        text: `Só pq é grande acha que é jogador de basquete!`,
      },
      {
        quoted: m.messages[0],
      },
    )
    return
  }

  if (message === '2') {
    await sock.sendMessage(
      remoteJid,
      {
        text: `Finalizando a conversa.`,
      },
      {
        quoted: m.messages[0],
      },
    )
    return
  }

  await sock.sendMessage(
    remoteJid,
    {
      text: `Olá, esse é um teste de mensagem automática.
Responda com o número da opção desejada:
    1 - Quero saber mais
    2 - Finalizar
    `,
    },
    {
      quoted: m.messages[0],
    },
  )
}
