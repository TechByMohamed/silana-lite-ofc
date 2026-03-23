import { smsg } from './lib/simple.js'

export default async function handler(chatUpdate) {
    try {
        if (!chatUpdate) return

        let m = chatUpdate.messages?.[0]
        if (!m) return

        m = smsg(this, m)

        // Ignore statuses
        if (m.key && m.key.remoteJid === 'status@broadcast') return

        // Simple log
        console.log(`📩 Message from ${m.sender}: ${m.text || '[media]'}`)

        // Basic commands
        if (m.text) {
            const text = m.text.toLowerCase()

            if (text === 'ping') {
                return this.sendMessage(m.chat, { text: 'pong!' })
            }

            if (text === 'owner') {
                return this.sendMessage(m.chat, { text: `Owner: ${global.nameown}\nNumber: ${global.nomerown}` })
            }

            if (text === 'bot') {
                return this.sendMessage(m.chat, { text: `Bot: ${global.namebot}\nStatus: Active` })
            }
        }

    } catch (e) {
        console.error('❌ Handler Error:', e)
    }
}
