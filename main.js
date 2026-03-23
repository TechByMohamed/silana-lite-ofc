import './config.js'
import './function/settings/settings.js'
import { makeWASocket, useMultiFileAuthState } from '@adiwajshing/baileys'
import Pino from 'pino'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import lodash from 'lodash'
import yargs from 'yargs'

// =========================
// DATABASE
// =========================
global.db = new Low(new JSONFile('./database.json'))
await global.db.read()
global.db.data ||= { users: {}, chats: {}, settings: {} }
global.db.chain = lodash.chain(global.db.data)

// =========================
// AUTH
// =========================
const { state, saveCreds } = await useMultiFileAuthState('./sessions')

// =========================
// SOCKET OPTIONS
// =========================
const connectionOptions = {
    logger: Pino({ level: 'fatal' }),
    printQRInTerminal: false,
    auth: state,
    browser: ['Linux', 'Chrome', ''],
    syncFullHistory: false
}

// =========================
// START SOCKET
// =========================
global.conn = makeWASocket(connectionOptions)
conn.isInit = false

// =========================
// PAIRING CODE (LITE VERSION)
// =========================
if (!conn.authState.creds.registered) {
    let phoneNumber = global.pairingNumber.replace(/[^0-9]/g, '')

    try {
        console.log("📲 Generating pairing code for:", phoneNumber)

        let code = await conn.requestPairingCode(phoneNumber)
        code = code?.match(/.{1,4}/g)?.join("-") || code

        console.log("✅ Pairing Code:", code)
    } catch (error) {
        console.log("❌ Error:", error.message)
        process.exit(1)
    }
}

// =========================
// CONNECTION UPDATE
// =========================
conn.ev.on('connection.update', ({ connection }) => {
    if (connection === 'open') {
        console.log(chalk.green("✅ BOT CONNECTED SUCCESSFULLY"))
    }
    if (connection === 'close') {
        console.log(chalk.red("❌ CONNECTION CLOSED — RESTARTING"))
        process.exit(1)
    }
})

// =========================
// SAVE CREDS
// =========================
conn.ev.on('creds.update', saveCreds)

// =========================
// LOAD HANDLER
// =========================
import handler from './handler.js'
conn.ev.on('messages.upsert', handler)
