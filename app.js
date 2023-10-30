import makeWASocket, {DisconnectReason, BufferJSON, useMultiFileAuthState} from '@whiskeysockets/baileys'
import * as fs from 'fs'
const {state, saveCreds} = await useMultiFileAuthState('store_wa-session')
import pkg from 'node-wit';
const { Wit } = pkg;
const client = new Wit({accessToken: 'TOKEN_WIT'});

async function connectToWhatsApp () {
    const sock = makeWASocket.default({
        // can provide additional config here
        printQRInTerminal: true,
        generateHighQualityLinkPreview: true,
        auth: state
    })
    sock.ev.on('creds.update', saveCreds)
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
    
        if (connection === 'close'){
            if (lastDisconnect?.error?.output?.statusCode !== 401) {
                connectToWhatsApp()
            } else {
                console.log('Logout :(')
            }
        } else if (connection === 'open') {
            console.log('Connected :)')
        }
    })
    sock.ev.on('messages.upsert', async m =>  {
        if(m.messages[0].key.fromMe) return // ignore self messages
        const msg = m.messages[0].message?.conversation
        console.log(msg)
        
    })
}
connectToWhatsApp()