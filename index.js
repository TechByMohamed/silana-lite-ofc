import './config.js'
import './function/settings/settings.js'
import chalk from 'chalk'
import cfont from 'cfonts'
import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// =========================
// BASIC INFO DISPLAY
// =========================
cfont.say('Silana Lite', {
    font: 'simple',
    align: 'center',
    gradient: ['yellow', 'cyan']
})

cfont.say('by ' + global.info.nameown, {
    font: 'tiny',
    align: 'center',
    colors: ['white']
})

console.log(chalk.green('🚀 Starting bot...'))

// =========================
// START MAIN.JS
// =========================
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function startBot() {
    const bot = spawn('node', [path.join(__dirname, 'main.js')], {
        stdio: 'inherit'
    })

    bot.on('exit', code => {
        console.log(chalk.red(`❌ Bot exited with code: ${code}`))
        console.log(chalk.yellow('🔄 Restarting...'))
        startBot()
    })
}

startBot()
