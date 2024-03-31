import qrcode from 'qrcode-terminal'
import { Client } from 'whatsapp-web.js'

export default function initialize(client: Client) {
  client.on('auth_failure', () => {
    console.log('Erro de autenticação')
  })

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true })
    console.log(`QR Code: ${qr}`)
  })

  client.on('authenticated', async () => {
    console.log('Autenticado com sucesso!')
  })

  client.on('ready', async () => {
    console.log('Client is ready!')
    await client.sendMessage(
      client.info.wid._serialized,
      'Bot iniciado com sucesso!',
    )
  })

  client.on('message', async (msg) => {
    if (msg.body === '!ping') {
      msg.reply('pong')
    }
  })

  client.initialize()
}