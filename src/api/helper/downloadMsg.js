const { downloadContentFromMessage } = require('@whiskeysockets/baileys')
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid')

module.exports = async function downloadMessage(msg, msgType) {
    let buffer = Buffer.from([])
    try {
        const stream = await downloadContentFromMessage(msg, msgType)
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
    } catch {
        return console.log('error downloading file-message')
    }
	if(msgType==='video')
		{
			const name = 'temp/'+uuidv4()+'.mp4';
	 await fs.writeFile(name, buffer);
			return name;
		}
	if(msgType ==='audio')
		{
			const name = 'temp/'+uuidv4()+'.ogg';
	 await fs.writeFile(name, buffer);
			return name;
		}
	else{
    return buffer.toString('base64')
	}
}
