import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import P from 'pino'
import config from './config.js'

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./session')

    const sock = makeWASocket({
        logger: P({ level: 'silent' }),
        auth: state,
        browser: ['AngelMd', 'Chrome', '1.0.0']
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0]
        if (!msg.message) return

        const messageText = msg.message.conversation || msg.message.extendedTextMessage?.text
        if (!messageText) return

        if (messageText.startsWith(config.prefix)) {
            const command = messageText.slice(1).trim().toLowerCase()

            if (command === "menu") {
                await sock.sendMessage(msg.key.remoteJid, { text: `🤖 ${config.botName} Menu

!ping - Check bot
!owner - Bot owner
` })
            }

            if (command === "ping") {
                await sock.sendMessage(msg.key.remoteJid, { text: "🏓 Pong!" })
            }

            if (command === "owner") {
                await sock.sendMessage(msg.key.remoteJid, { text: `👑 Owner: ${config.ownerName}` })
            }
        }
    })

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot()
            }
        } else if (connection === 'open') {
            console.log('Bot Connected ✅')
        }
    })
}

sta'AlexioBot'Bot'Bot'Bot'
