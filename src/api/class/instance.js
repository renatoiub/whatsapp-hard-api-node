const ffmpegPath = require('@ffmpeg-installer/ffmpeg');
const { exec } = require('child_process');
const fetch = require('node-fetch');
const QRCode = require('qrcode');
const pino = require('pino');
const { promisify } = require('util');
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL:  86400 });
const GroupsCache = new NodeCache({ stdTTL:  20 });
const GroupsMetaDados = new NodeCache({ stdTTL:  3600 });
const schedule = require('node-schedule');
const async = require('async');


let intervalStore = [];

const {
    makeWASocket,
    DisconnectReason,
    isJidUser,
    isJidGroup,
	jidDecode,
	jidEncode,
	jid,
	isLid,
	isJidBroadcast,
    makeInMemoryStore,
    proto,
    delay,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    getDevice,
    GroupMetadata,
    MessageUpsertType,
    ParticipantAction,
    generateWAMessageFromContent,
	getUSyncDevices,
    WASocket
} = require('@whiskeysockets/baileys');

const { unlinkSync } = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const processButton = require('../helper/processbtn');
const generateVC = require('../helper/genVc');
const axios = require('axios');
const config = require('../../config/config');
const downloadMessage = require('../helper/downloadMsg');
const dados = makeInMemoryStore({ pino });
const fs = require('fs').promises;
const getMIMEType = require('mime-types');
const readFileAsync = promisify(fs.readFile);
const util = require('util');
const url = require('url');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));





async function clear() {
const mainDirectoryPath = 'db/';
const filesToExclude = ['creds.json', 'contacts.json', 'groups.json'];
//console.log('Evento iniciado as 14:00')
  try {
    const folders = await fs.readdir(mainDirectoryPath);
    if (folders.length === 0) {
     
      return;
    }

   
    for (const folder of folders) {
      const folderPath = path.join(mainDirectoryPath, folder);
     

      try {
        const stats = await fs.stat(folderPath);
        if (stats.isDirectory()) {
        
          const files = await fs.readdir(folderPath);
          
         

          for (const file of files) {
            if (!filesToExclude.includes(file)) {
              const filePath = path.join(folderPath, file);
              
              try {
                await fs.unlink(filePath);
               
              } catch (err) {
                
              }
            } else {
              
            }
          }
        } else {
          
        }
      } catch (err) {
        
      }
    }
  } catch (err) {
   
  }
}


const job = schedule.scheduleJob('0 3 * * *', clear);




class WhatsAppInstance {
socketConfig = {
    defaultQueryTimeoutMs: undefined,
    printQRInTerminal: false,
	logger: pino({
    level: config.log.level,
    }),
	

    // markOnlineOnConnect: false
    msgRetryCounterCache: cache,
	forceGroupsPrekeys : false,
    getMessage: (key) => {
        return (dados.loadMessage(key.remoteJid, key.id))?.message || undefined;
    },
    patchMessageBeforeSending: (msg) => {
        if (msg.deviceSentMessage?.message?.listMessage?.listType == proto.Message.ListMessage.ListType.PRODUCT_LIST) {
            msg = JSON.parse(JSON.stringify(msg));
            msg.deviceSentMessage.message.listMessage.listType = proto.Message.ListMessage.ListType.SINGLE_SELECT;
        }

        if (msg.listMessage?.listType == proto.Message.ListMessage.ListType.PRODUCT_LIST) {
            msg = JSON.parse(JSON.stringify(msg));
            msg.listMessage.listType = proto.Message.ListMessage.ListType.SINGLE_SELECT;
        }

        const requiresPatch = !!(msg.buttonsMessage || msg.listMessage || msg.templateMessage);
        if (requiresPatch) {
            msg = {
                viewOnceMessageV2: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...msg,
                    },
                },
            };
        }

        return msg;
    },
};

key = '';
authState;
allowWebhook = undefined;
webhook = undefined;

instance = {
    key: this.key,
    chats: [],
    contacts: [],
    qr: '',
    messages: [],
    qrRetry: 0,
    customWebhook: '',
    WAPresence: [],
    deleted: false,
};

axiosInstance = axios.create({
    baseURL: config.webhookUrl,
});

constructor(key, allowWebhook, webhook,cacheDuration = 24 * 60 * 60 * 1000) {
    this.key = key ? key : uuidv4();
    this.instance.customWebhook = this.webhook ? this.webhook : webhook;
    this.allowWebhook = config.webhookEnabled ? config.webhookEnabled : allowWebhook;
	this.queue = this.createQueue(257);

    if (this.allowWebhook && this.instance.customWebhook !== null) {
        this.allowWebhook = true;
        this.instance.customWebhook = webhook;
        this.axiosInstance = axios.create({
            baseURL: webhook,
        });
    }
	
}
			
			
 createQueue() {
    return async.queue(async (task, callback) => {
      try {
		
        await this.assertSession(task.lid); // Chama o método assertSession com o contexto da classe
        //callback(); // Indica que a tarefa foi concluída
      } catch (error) {
        console.error(`Erro ao processar ${task.lid}:`, error);
        //callback(error); // Passa o erro para o callback
      }
    }, 1);
  }			

async geraThumb(videoPath) {
    const name = uuidv4();
    const tempDir = 'temp';
    const thumbPath = 'temp/' + name + 'thumb.png';

    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    const base64 = base64Regex.test(videoPath);

    try {
        let videoBuffer;
        let videoTempPath;

        if (videoPath.startsWith('http')) {
            const response = await axios.get(videoPath, { responseType: 'arraybuffer' });
            videoTempPath = path.join(tempDir, name + '.mp4');
            videoBuffer = Buffer.from(response.data);
            await fs.writeFile(videoTempPath, videoBuffer);
        } else if (base64 === true) {
            videoTempPath = path.join(tempDir, 'temp/' + name + '.mp4');
            const buffer = Buffer.from(videoPath, 'base64');
            await fs.writeFile(videoTempPath, buffer);
        } else {
            videoTempPath = videoPath;
        }

        const command = `${ffmpegPath.path} -i ${videoTempPath} -ss 00:00:01 -vframes 1 ${thumbPath}`;
        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        const thumbContent = await fs.readFile(thumbPath, { encoding: 'base64' });

        await Promise.all([fs.unlink(videoTempPath), fs.unlink(thumbPath)]);

        return thumbContent;
    } catch (error) {
        console.log(error);
    }
}

async thumbURL(url) {
    const videoUrl = url;
    try {
        const thumbContentFromUrl = await this.geraThumb(videoUrl);
        return thumbContentFromUrl;
    } catch (error) {
        console.log(error);
    }
}

async thumbBUFFER(buffer) {
    try {
        const thumbContentFromBuffer = await this.geraThumb(buffer);
        return thumbContentFromBuffer;
    } catch (error) {
        console.log(error);
    }
}

async thumbBase64(buffer) {
    try {
        const thumbContentFromBuffer = await this.geraThumb(buffer);
        return thumbContentFromBuffer;
    } catch (error) {
        console.log(error);
    }
}

async convertMP3(audioSource) {
    try {
        const return_mp3 = await this.mp3(audioSource);
        return return_mp3;
    } catch (error) {
        console.log(error);
    }
}

async mp3(audioSource) {
    const name = uuidv4();
    try {
        const mp3_temp = 'temp/' + name + '.mp3';
        const command = `${ffmpegPath.path} -i ${audioSource} -acodec libmp3lame -ab 128k ${mp3_temp}`;
        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });

        const audioContent = await fs.readFile(mp3_temp, { encoding: 'base64' });

        await Promise.all([fs.unlink(mp3_temp), fs.unlink(audioSource)]);

        return audioContent;
    } catch (error) {
        console.log(error);
    }
}
					   
					   
async convertToMP4(audioSource) {
	 const name = uuidv4();
  try {
    let audioBuffer;
    if (Buffer.isBuffer(audioSource)) {
      audioBuffer = audioSource;
    } else if (audioSource.startsWith('http')) {
      const response = await fetch(audioSource);
      audioBuffer = await response.buffer();
    } else if (audioSource.startsWith('data:audio')) {
      const base64DataIndex = audioSource.indexOf(',');
      if (base64DataIndex !== -1) {
        const base64Data = audioSource.slice(base64DataIndex + 1);
        audioBuffer = Buffer.from(base64Data, 'base64');
      }
    } else {
      audioBuffer = audioSource;
    }

    const tempOutputFile = `temp/temp_output_${name}.opus`;
    const mp3_temp = 'temp/' + name + '.mp3';

    const ffmpegCommand = `${ffmpegPath.path} -i "${mp3_temp}" -c:a libopus -b:a 128k -ac 1 "${tempOutputFile}"`;

    await fs.writeFile(mp3_temp, Buffer.from(audioBuffer));

    await new Promise((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    fs.unlink(mp3_temp);

    return tempOutputFile;
  } catch (error) {
    throw error;
  }
}

async convertTovideoMP4(videoSource) {
  const name = uuidv4();
  try {
    let videoBuffer;

    if (Buffer.isBuffer(videoSource)) {
      videoBuffer = videoSource;
    } else if (videoSource.startsWith('http')) {
      const response = await fetch(videoSource);
      videoBuffer = await response.buffer();
    } else if (videoSource.startsWith('data:video')) {
      const base64DataIndex = videoSource.indexOf(',');
      if (base64DataIndex !== -1) {
        const base64Data = videoSource.slice(base64DataIndex + 1);
        videoBuffer = Buffer.from(base64Data, 'base64');
      }
    } else {
      videoBuffer = videoSource;
    }

    const tempOutputFile = `temp/temp_output_${name}.mp4`;
    const mp4 = 'temp/' + name + '.mp4';

    const ffmpegCommand = `${ffmpegPath.path} -i "${mp4}" -c:v libx264 -c:a aac -strict experimental -b:a 192k -movflags faststart -f mp4 "${tempOutputFile}"`;

    await fs.writeFile(mp4, Buffer.from(videoBuffer));

    await new Promise((resolve, reject) => {
      exec(ffmpegCommand, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    fs.unlink(mp4);

    return tempOutputFile;
  } catch (error) {
    throw error;
  }
}

async getMimeTypeFromBase64(base64String) {
  return new Promise((resolve, reject) => {
    try {
      const header = base64String.substring(0, base64String.indexOf(','));
      const match = header.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);

      if (match && match[1]) {
        resolve(match[1]);
      } else {
        reject(new Error('Tipo MIME não pôde ser determinado.'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async getBufferFromMP4File(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async getFileNameFromUrl(url) {
  try {
    const pathArray = new URL(url).pathname.split('/');
    const fileName = pathArray[pathArray.length - 1];
    return fileName;
  } catch (error) {
    throw error;
  }
}



async dataBase() {
    try {
        return await useMultiFileAuthState('db/' + this.key);
    } catch (error) {
        console.log('Falha ao atualizar a base de dados');
    }
}

async SendWebhook(type, hook, body, key) {
    if (this.instance.webhok === false) {
        return;
    } else {
        const webhook_url = this.instance.webhook_url;
        const events = this.instance.webhook_events;

        const hasMessagesSet = events.includes(hook);

        if (hasMessagesSet === true) {
            this.web = axios.create({
                baseURL: this.instance.webhook_url,
            });
            this.web
                .post('', {
                    type,
                    body,
                    instanceKey: key,
                })
                .catch((e) => {});
        }
    }
}

async instanceFind(key) {
    const filePath = path.join('db/sessions.json');

    const data = await fs.readFile(filePath, 'utf-8');
    if (data) {
        const sessions = JSON.parse(data);
        const existingSession = sessions.find((session) => session.key === this.key);
        if (!existingSession) {
            const data = {
                "key": false,
                "browser": false,
                "webhook": false,
                "base64": false,
                "webhookUrl": false,
                "webhookEvents": false,
                "messagesRead": false,
            };
            return data;
        } else {
            return existingSession;
        }
    } else {
        const data = {
            "key": false,
            "browser": false,
            "webhook": false,
            "base64": false,
            "webhookUrl": false,
            "webhookEvents": false,
            "messagesRead": false,
        };
        return data;
    }
}

async init() {
    const ver = await fetchLatestBaileysVersion();
    const filePath = path.join('db/sessions.json');

    const data = await fs.readFile(filePath, 'utf-8');
    if (!data) {
        return;
    }
    const sessions = JSON.parse(data);

    const existingSession = sessions.find((session) => session.key === this.key);
    if (!existingSession) {
        return;
    }

    const { state, saveCreds, keys } = await this.dataBase();
    this.authState = {
        state: state,
        saveCreds: saveCreds,
        keys: makeCacheableSignalKeyStore(keys, this.logger),
    };

    let b;
    let ignoreGroup;

    if (existingSession) {
        b = {
            browser: {
                platform: existingSession.browser,
                browser: 'Chrome',
                version: '20.0.04',
            },
        };
        ignoreGroup = existingSession.ignoreGroups;
        this.instance.mark = existingSession.messagesRead;
        this.instance.webhook = existingSession.webhook;
        this.instance.webhook_url = existingSession.webhookUrl;
        this.instance.webhook_events = existingSession.webhookEvents;
		this.instance.base64 = existingSession.base64;
		this.instance.ignoreGroups = ignoreGroup;
    } else {
        b = {
            browser: {
                platform: 'Chrome (Linux)',
                browser: 'chrome',
                version: '22.5.0',
            },
        };
        ignoreGroup = false;
        this.instance.mark = false;
        this.instance.webhook = false;
        this.instance.webhook_url = false;
        this.instance.webhook_events = false;
		this.instance.base64 = false;
		this.instance.ignoreGroups = ignoreGroup;
    }

    this.socketConfig.auth = this.authState.state;
    if (ignoreGroup === true) {
		this.socketConfig.shouldIgnoreJid = (jid) => {
          const isGroupJid = isJidGroup(jid);
          const isBroadcast = isJidBroadcast(jid);
		  const isNewsletter = jid.includes('newsletter');	
          return isGroupJid || isBroadcast || isNewsletter ;
        }
    } else {
      
		this.socketConfig.shouldIgnoreJid = (jid) => {
          const isNewsletter = jid.includes('newsletter');
          const isBroadcast = isJidBroadcast(jid);
          return  isBroadcast || isNewsletter ;
		
        }
		
    }
    this.socketConfig.version =  [2, 3000, 1021580394];
    this.socketConfig.browser = Object.values(b.browser);
	this.socketConfig.emitOwnEvents = true;
    this.instance.sock = makeWASocket(this.socketConfig);
	const dados = makeInMemoryStore({ pino });
    this.setHandler(); 
 	dados?.bind(this.instance.sock?.ev);
    return this;
}

setHandler() {
    const sock = this.instance.sock;

    sock?.ev.on('creds.update', this.authState.saveCreds);

    sock?.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        const status = lastDisconnect?.error?.output?.statusCode;

        if (connection === 'connecting') return;

        if (connection === 'close') {
            if (status === DisconnectReason.loggedOut || status === 405 || status === 402 || status === 403) {
                await this.deleteFolder('db/' + this.key);
                await delay(1000);
                this.instance.online = false;
                await this.init();
            } else if (status === 440) {
                return;
            } else {
                await this.init();
            }

            await this.SendWebhook('connection', 'connection.update', {
                connection: connection,
                connection_code: lastDisconnect?.error?.output?.statusCode
            }, this.key);
        } else if (connection === 'open') {
            this.instance.online = true;
            await this.SendWebhook('connection', 'connection.update', {
            connection: connection,
            }, this.key);
	      
			//this.assertAll();
			   
        }

        if (qr) {
            QRCode.toDataURL(qr).then((url) => {
                this.instance.qr = url;
            });
            await this.SendWebhook('qrCode', 'qrCode.update', {
                qr: qr,
            }, this.key);
        }
    });
		


sock?.ev.on('presence.update', async (json) => {
        await this.SendWebhook('presence', 'presence.update', json, this.key);
 });

    sock?.ev.on('contacts.upsert', async (contacts) => {
        let folderPath;
        let filePath;
        try {
            const folderPath = 'db/' + this.key;

            const filePath = path.join(folderPath, 'contacts.json');
            await fs.access(folderPath);

            const currentContent = await fs.readFile(filePath, 'utf-8');
            const existingContacts = JSON.parse(currentContent);

            contacts.forEach((contact) => {
                const existingContactIndex = existingContacts.findIndex(
                    (c) => c.id === contact.id
                );

                if (existingContactIndex !== -1) {
                    existingContacts[existingContactIndex] = contact;
                } else {
                    existingContacts.push(contact);
                }
            });

            await fs.writeFile(filePath, JSON.stringify(existingContacts, null, 2), 'utf-8');

            await this.SendWebhook('contacts', 'contacts.upsert', contacts, this.key);
        } catch (error) {
            const folderPath = 'db/' + this.key;

            const filePath = path.join(folderPath, 'contacts.json');
            await fs.mkdir(folderPath, { recursive: true });
            await fs.writeFile(filePath, JSON.stringify(contacts, null, 2), 'utf-8');
        }
    });

    sock?.ev.on('chats.upsert', async (newChat) => {
        try {
            await this.SendWebhook('chats', 'chats.upsert', newChat, this.key);
        } catch (e) {
            return;
        }
    });

    sock?.ev.on('chats.delete', async (deletedChats) => {
        try {
            await this.SendWebhook('chats', 'chats.delete', deletedChats, this.key);
        } catch (e) {
            return;
        }
    });

    sock?.ev.on('messages.update', async (m) => {
        try {
            await this.SendWebhook('updateMessage', 'messages.update', m, this.key);
        } catch (e) {
            return;
        }
    });

    // on new mssage
    sock?.ev.on('messages.upsert', async (m) => {
	
        if (m.type === 'prepend') this.instance.messages.unshift(...m.messages);
        if (m.type !== 'notify') return;

        this.instance.messages.unshift(...m.messages);
	

        m.messages.map(async (msg) => {
	
	
            if (!msg.message) return;

            if (this.instance.mark === true) {
				try
					{

                await this.lerMensagem(msg.key.id, msg.key.remoteJid);
					}
	                catch(e)
	               {
	                 //console.log(e)
                   }
            }

            const messageType = Object.keys(msg.message)[0];
            if (['protocolMessage', 'senderKeyDistributionMessage'].includes(messageType))
                return;
	
	
			if (this.instance.webhook === true) {
	        try{
           	
            const webhookData = {
                key: this.key,
                ...msg,
            };

            if (messageType === 'conversation') {
                webhookData['text'] = m;
            }
		
			if (this.instance.base64 === true) {
  
            
                switch (messageType) {
                    case 'imageMessage':
                        webhookData['msgContent'] = await downloadMessage(
                            msg.message.imageMessage,
                            'image'
                        );
                        break;
                    case 'videoMessage':
                        webhookData['msgContent'] = await downloadMessage(
                            msg.message.videoMessage,
                            'video'
                        );

                        //webhookData['msgContent'] = await fs.readFile(arquivo_video, {
                            //encoding: 'base64',
                        //});

                        //webhookData['thumb'] = await this.thumbBase64(arquivo_video);

                        break;
			       case 'audioMessage':
						
						if (process.env.DEFAULT_AUDIO_OUTPUT && process.env.DEFAULT_AUDIO_OUTPUT === 'MP3')
							{
								
			
								
		
			const arquivo_audio = await downloadMessage(msg.message.audioMessage,'audio');				
			const buffer = Buffer.from(arquivo_audio, 'base64');
			const name = 'temp/'+uuidv4()+'.ogg';
	 		await fs.writeFile(name, buffer);
		

								
                        
			const convert = await this.mp3(name);
						
                        webhookData['msgContent'] = convert;
							}
						else
							{
							webhookData['msgContent'] = await downloadMessage(
                            msg.message.audioMessage,
                            'audio'
                        );
								
							}
                        break;
                    case 'documentMessage':
                        webhookData['msgContent'] = await downloadMessage(
                            msg.message.documentMessage,
                            'document'
                        );
                        break;
                    default:
                        webhookData['msgContent'] = '';
                        break;
                }
				
			}

				await this.SendWebhook('message', 'messages.upsert', webhookData, this.key);
            }
			catch(e)
			{
		          console.log('Error webhook send');
			}
}




 
        });
    });

    sock?.ws.on('CB:call', async (data) => {
        try {
            if (data.content) {
                if (data.content.find((e) => e.tag === 'offer')) {
                    const content = data.content.find((e) => e.tag === 'offer');

                    await this.SendWebhook('call_offer', 'call.events', {
                        id: content.attrs['call-id'],
                        timestamp: parseInt(data.attrs.t),
                        user: {
                            id: data.attrs.from,
                            platform: data.attrs.platform,
                            platform_version: data.attrs.version,
                        },
                    }, this.key);
                } else if (data.content.find((e) => e.tag === 'terminate')) {
                    const content = data.content.find((e) => e.tag === 'terminate');

                    await this.SendWebhook('call', 'call.events', {
                        id: content.attrs['call-id'],
                        user: {
                            id: data.attrs.from,
                        },
                        timestamp: parseInt(data.attrs.t),
                        reason: data.content[0].attrs.reason,
                    }, this.key);
                }
            }
        } catch (e) {
            return;
        }
    });

    sock?.ev.on('groups.upsert', async (groupUpsert) => {
	
        try {
            await this.SendWebhook('updateGroups', 'groups.upsert', {
                data: groupUpsert,
            }, this.key);
			await this.updateGroupData()
			GroupsMetaDados.flushAll();
        } catch (e) {
            return;
        }
    });

    sock?.ev.on('groups.update', async (groupUpdate) => {
	
        try {
            await this.SendWebhook('updateGroups', 'groups.update', {
                data: groupUpdate,
            }, this.key);
			await this.updateGroupData()
			GroupsMetaDados.flushAll();
        } catch (e) {
            return;
        }
    });

    sock?.ev.on('group-participants.update', async (groupParticipants) => {
	
        try {
            await this.SendWebhook('group-participants', 'group-participants.update', {
                data: groupParticipants,
            }, this.key);
			await this.updateGroupData()
			GroupsMetaDados.flushAll();
        } catch (e) {
            return;
        }
    });
}

async deleteInstance(key) {
    const filePath = path.join('db/sessions.json');

    let data = await fs.readFile(filePath, 'utf-8');
    let sessions = JSON.parse(data);
    let existingSession = sessions.find(session => session.key === key);

    if (existingSession) {
        let updatedSessions = sessions.filter(session => session.key !== key);

        try {
            let salvar = await fs.writeFile(filePath, JSON.stringify(updatedSessions, null, 2), 'utf-8');
        } catch (error) {
            console.log('erro ao salvar');
        }

        if (this.instance.online == true) {
            this.instance.deleted = true;
            await this.instance.sock?.logout();
        } else {
            await this.deleteFolder('db/' + this.key);
        }
    } else {
        return {
            error: true,
            message: 'Sessão não localizada',
        };
    }
}

async getInstanceDetail(key) {
    let connect = this.instance?.online;

    if (connect !== true) {
        connect = false;
    }
    const sessionData = await this.instanceFind(key);
    return {
        instance_key: key,
        phone_connected: connect,
        browser: sessionData.browser,
        webhook: sessionData.webhook,
        base64: sessionData.base64,
        webhookUrl: sessionData.webhookUrl,
        webhookEvents: sessionData.webhookEvents,
        messagesRead: sessionData.messagesRead,
        ignoreGroups: sessionData.ignoreGroups,
        user: this.instance?.online ? this.instance.sock?.user : {},
    };
}
getWhatsappCode(id)
	{
 if (id.startsWith('55')) {
        const numero = id.slice(2);
        const ddd = numero.slice(0, 2);
        let n;

        const indice = numero.indexOf('@');

        if (indice >= 1) {
            n = numero.slice(0, indice);
        } else {
            n = numero;
        }

        const comprimentoSemDDD = n.slice(2).length;
      
        if (comprimentoSemDDD < 8) {
            throw new Error('no account exists!');
        } else if (comprimentoSemDDD > 9) {
            throw new Error('no account exists.');
        } else if (parseInt(ddd) <= 27 && comprimentoSemDDD < 9) {
            let novoNumero = n.substring(0, 2) + '9' + n.substring(2);
            id = '55' + novoNumero;
        } else if (parseInt(ddd) > 27 && comprimentoSemDDD > 8) {
            let novoNumero = n.substring(0, 2) + n.substring(3);
            id = '55' + novoNumero;
        }
	
	 return id;
    }
		else
 {
	return id;
 }
	}
getWhatsAppId(id) {
id  = id.replace(/\D/g, "");
if (id.includes('@g.us') || id.includes('@s.whatsapp.net')) return id;
return id.includes('-') ? `${id}@g.us` : `${id}@s.whatsapp.net`;
}

getGroupId(id) {
    if (id.includes('@g.us') || id.includes('@g.us')) return id;
    return id.includes('-') ? `${id}@g.us` : `${id}@g.us`;
}

async deleteFolder(folder) {
    try {
        const folderPath = await path.join(folder);

        const folderExists = await fs.access(folderPath).then(() => true).catch(() => false);

        if (folderExists) {
            const files = await fs.readdir(folderPath);

            for (const file of files) {
                const filePath = await path.join(folderPath, file);
                await fs.unlink(filePath);
            }

            await fs.rmdir(folderPath);
            return;
        }
    } catch (e) {
        return;
    }
}

async lerMensagem(idMessage, to) {
    try {
        const msg = await this.getMessage(idMessage, to);
        if (msg) {
            await this.instance.sock?.readMessages([msg.key]);
        }
    } catch (e) {
        //console.log(e)
    }
}

 async verifyId(id) {
        const cachedResult = await this.verifyCache(id);
        if (cachedResult) {
			
            return cachedResult.jid;
			
        } else {
            try {
                const [result] = await this.instance.sock?.onWhatsApp(id);
			
                if (result.exists) {
                    await this.salvaCache(id, result);
                    return result.jid;
                } else {
			
                    throw new Error('O número:'+id+' não é um Whatsapp Valido');
                }
            } catch (error) {
                throw new Error('O número:'+id+' não é um Whatsapp Valido');
            }
        }
    }

    async verifyCache(id) {
        const cachedItem = cache.get(id);

        if (cachedItem) {
           
            return cachedItem;
        } else {
           
            return null;
        }
    }

    async salvaCache(id, result) {
        cache.set(id, result);
        
}




async sendTextMessage(data) {
			//await this.assertAll();
    let to = data.id;

    if (data.typeId === 'user') {
      to = await this.verifyId(to);
       
    } else {
        
        await this.verifyGroup(to);
		
    }
    if (data.options && data.options.delay && data.options.delay > 0) {
        await this.setStatus('composing', to, data.typeId, data.options.delay);
    }

    let mentions = false;

    if (data.typeId === 'group' && data.groupOptions && data.groupOptions.markUser) {
        if (data.groupOptions.markUser === 'ghostMention') {
            const metadata = await this.groupidinfo(to);
            mentions = metadata.participants.map((participant) => participant.id);
        } else {
            mentions = this.parseParticipants(groupOptions.markUser);
        }
    }

    let quoted = { quoted: null };
	let cache = {useCachedGroupMetadata:false};
	if (data.typeId === 'group')
		{
		const metadados = await this.groupidinfo(to);
        const meta = metadados.participants.map((participant) => participant.id);
		cache = {useCachedGroupMetadata:meta};
        //await this.assertSessions(to);
		
		
		}

    if (data.options && data.options.replyFrom) {
        const msg = await this.getMessage(data.options.replyFrom, to);

        if (msg) {
            quoted = { quoted: msg };
        }
    }

    const send = await this.instance.sock?.sendMessage(
        to, {
            text: data.message,
            mentions
        },
        quoted,
		cache	
    );
    return send;
}
	
async assertSessions(group)
{
	console.log('Processamento de grupo '+group+' Iniciado')
	if(GroupsMetaDados.get('assert'+group+this.key))
			{
				return 
			}
		else
			{
	
	////this.queue.push({ group }, (err) => {
    //if (err) {
     // console.error(`Erro ao processar ${group}:`, err);
    //} else {
      //GroupsMetaDados.set('assert'+group+this.key, true);
    //}
  //});
			//}
	const metadados = await this.groupidinfo(group);
    const phoneNumbers = metadados.participants.map((participant) => participant.id);
	for (let i = phoneNumbers.length - 1; i >= 0; i--) {
    const lid = phoneNumbers[i];
    this.queue.push({ lid }, (err) => {
    if (err) {
      //console.error(`Erro ao processar ${lid}:`, err);
    } else {
      //console.log(`Processamento de ${lid} concluído.`);
    }
  });
//}
}
GroupsMetaDados.set('assert'+group+this.key, true);				
				
}
}
	
async assertAll()
{
 try
	 {
const result = await this.groupFetchAllParticipating();
for (const key in result ) {
if (result[key].size > 300) {
    this.assertSessions(result[key].id)
  }
}
		 
		 
	 }
catch(e)
	{
	console.log(e);		
	}
		
}
	
async  assertSession(lid) {
	
  try {
	//const metadados = await this.groupidinfo(group);
    //const phoneNumbers = metadados.participants.map((participant) => participant.id);
	  
    const devices = [];
    const additionalDevices = await this.instance.sock?.getUSyncDevices([lid], false, false);
    devices.push(...additionalDevices);

    const senderKeyJids = [];
    for (const { user, device } of devices) {
      const jid = jidEncode(user, isLid ? 'lid' : 's.whatsapp.net', device)
      senderKeyJids.push(jid);
    }

    const assert = await this.instance.sock?.assertSessions(senderKeyJids);
    //console.log(`Sessão confirmada para ${lid}`);
  } catch (error) {
   //console.log(error)
  }
}
	
async getMessage(idMessage, to) {
    try {
        const user_instance = this.instance.sock?.user.id;
        const user = this.getWhatsAppId(user_instance.split(':')[0]);
        const msg = await dados.loadMessage(to, idMessage);
        return msg;
    } catch (error) {
        return false;
    }
}

async sendMediaFile(data, origem) {
    let to = data.id;

    if (data.typeId === 'user') {
     to = await this.verifyId(to);
       
    } else {
      
        await this.verifyGroup(to);
    }

    let caption = '';
    if (data.options && data.options.caption) {
        caption = data.options.caption;
    }

    let mentions = false;

    if (data.typeId === 'group' && data.groupOptions && data.groupOptions.markUser) {
        if (data.groupOptions.markUser === 'ghostMention') {
            const metadata = await this.groupidinfo(to);
            mentions = metadata.participants.map((participant) => participant.id);
        } else {
            mentions = this.parseParticipants(groupOptions.markUser);
        }
    }

    let quoted = { quoted: null };
		let cache = {useCachedGroupMetadata:false};
	if (data.typeId === 'group')
		{
		const metadados = await this.groupidinfo(to);
        const meta = metadados.participants.map((participant) => participant.id);
		cache = {useCachedGroupMetadata:meta};
		}

    if (data.options && data.options.replyFrom) {
        const msg = await this.getMessage(data.options.replyFrom, to);

        if (msg) {
            quoted = { quoted: msg };
        }
    }

    const acepty = ['audio', 'document', 'video', 'image'];

    if (!acepty.includes(data.type)) {
        throw new Error('Arquivo invalido');
    }

    const origin = ['url', 'base64', 'file'];
    if (!origin.includes(origem)) {
        throw new Error('Metodo de envio invalido');
    }

    let type = false;
    let mimetype = false;
    let filename = false;
    let file = false;
    let audio = false;
    let document = false;
    let video = false;
    let image = false;
    let thumb = false;
    let send;

    let myArray;
    if (data.type === 'image') {
        myArray = config.imageMimeTypes;
    } else if (data.type === 'video') {
        myArray = config.videoMimeTypes;
    } else if (data.type === 'audio') {
        myArray = config.audioMimeTypes;
    } else {
        myArray = config.documentMimeTypes;
    }

    if (origem === 'url') {
        const parsedUrl = url.parse(data.url);
        if (parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:') {
            mimetype = await this.GetFileMime(data.url);

            if (!myArray.includes(mimetype.trim())) {
                throw new Error('Arquivo ' + mimetype + ' não é permitido para ' + data.type);
            }

            origem = data.url;
        }
    } else if (origem === 'base64') {
        if(!data.filename || data.filename ==='')
			{throw new Error('Nome do arquivo é obrigatorio');}
		
		mimetype = getMIMEType.lookup(data.filename);

        if (!myArray.includes(mimetype.trim())) {
            throw new Error('Arquivo ' + mimetype + ' não é permitido para ' + data.type);
        }

       
    }

    if (data.type === 'audio') {
        if (mimetype === 'audio/ogg') {
            if (data.options && data.options.delay) {
                if (data.options.delay > 0) {
                    await this.instance.sock?.sendPresenceUpdate('recording', to);
                    await delay(data.options.delay * 1000);
                }
            }

            type = {
                url: data.url,
            };
            mimetype = 'audio/mp4';
            filename = await this.getFileNameFromUrl(data.url);
        } else {
            audio = await this.convertToMP4(origem);
            mimetype = 'audio/mp4';
            type = await fs.readFile(audio);
            if (data.options && data.options.delay) {
                if (data.options.delay > 0) {
                    await this.instance.sock?.sendPresenceUpdate('recording', to);
                    await delay(data.options.delay * 1000);
                }
            }
        }
    } else if (data.type === 'video') {
        if (mimetype === 'video/mp4') {
            type = {
                url: data.url,
            };
            thumb = await this.thumbURL(data.url);
            filename = await this.getFileNameFromUrl(data.url);
        } else {
            video = await this.convertTovideoMP4(origem);
            mimetype = 'video/mp4';
            type = await fs.readFile(video);
            thumb = await this.thumbBUFFER(video);
        }
    } else {
	
		if(!data.base64string)
			{
        type = {
            url: data.url,
        };

        filename = await this.getFileNameFromUrl(data.url);
			}
		else
			{
			
	
	const buffer = Buffer.from(data.base64string, 'base64');			

    filename = data.filename;	
    const file = path.join('temp/', filename);
								
	const join = await fs.writeFile(file, buffer);
	type = await fs.readFile('temp/'+filename);
				
			}
    }

    send = await this.instance.sock?.sendMessage(
        to, {
            mimetype: mimetype,
            [data.type]: type,
            caption: caption,
            ptt: data.type === 'audio' ? true : false,
            fileName: filename ? filename : file.originalname,
            mentions
        }, quoted, cache 
    );

    if (data.type === 'audio' || data.type === 'video' || data.type=='document') {
        if (data.type === 'video') {
            const ms = JSON.parse(JSON.stringify(send));
            ms.message.videoMessage.thumb = thumb;
            send = ms;
        }

        const tempDirectory = 'temp/';
        const files = await fs.readdir(tempDirectory);

        await Promise.all(files.map(async (file) => {
            const filePath = path.join(tempDirectory, file);
            await fs.unlink(filePath);
        }));
    }

    return send;
}

async GetFileMime(arquivo) {
    try {
        const file = await await axios.head(arquivo);
        return file.headers['content-type'];
        return file;
    } catch (error) {
        throw new Error(
            'Arquivo invalido'
        );
    }
}

async sendMedia(to, userType, file, type, caption = '', replyFrom = false, d = false) {
    if (userType === 'user') {
       to = await this.verifyId(to);
        
    } else {
       
        await this.verifyGroup(to);
    }

    const acepty = ['audio', 'document', 'video', 'image'];

    let myArray;
    if (type === 'image') {
        myArray = config.imageMimeTypes;
    } else if (type === 'video') {
        myArray = config.videoMimeTypes;
    } else if (type === 'audio') {
        myArray = config.audioMimeTypes;
    } else {
        myArray = config.documentMimeTypes;
    }

    const mime = file.mimetype;

    if (!myArray.includes(mime.trim())) {
        throw new Error('Arquivo ' + mime + ' não é permitido para ' + type);
    }

    if (!acepty.includes(type)) {
        throw new Error('Type not valid');
    }

    let mimetype = false;
    let filename = false;
    let buferFile = false;
    if (type === 'audio') {
        if (d > 0) {
            await this.instance.sock?.sendPresenceUpdate('recording', to);
            await delay(d * 1000);
        }

        if (mime === 'audio/ogg') {
            const filePath = file.originalname;
            const extension = path.extname(filePath);

            mimetype = 'audio/mp4';
            filename = file.originalname;
            buferFile = file.buffer;
        } else {
            filename = uuidv4() + '.mp4';

            const audio = await this.convertToMP4(file.buffer);
            mimetype = 'audio/mp4';
            buferFile = await fs.readFile(audio);
        }
    } else if (type === 'video') {
        if (mime === 'video/mp4') {
            const filePath = file.originalname;
            const extension = path.extname(filePath);

            mimetype = 'video/mp4';
            filename = file.originalname;
            buferFile = file.buffer;
        } else {
            filename = uuidv4() + '.mp4';

            const video = await this.convertTovideoMP4(file.buffer);
            mimetype = 'video/mp4';
            buferFile = await fs.readFile(video);
        }
    } else {
        const filePath = file.originalname;
        const extension = path.extname(filePath);

        const mimetype = getMIMEType.lookup(extension);
        filename = file.originalname;
        buferFile = file.buffer;
    }

    let quoted = { quoted: null };
    if (replyFrom) {
        const msg = await this.getMessage(replyFrom, to);

        if (msg) {
            quoted = { quoted: msg };
        }
    }
		let cache = {useCachedGroupMetadata:false};
	if (userType === 'group')
		{
		const metadados = await this.groupidinfo(to);
        const meta = metadados.participants.map((participant) => participant.id);
		cache = {useCachedGroupMetadata:meta};
		}


    const data = await this.instance.sock?.sendMessage(
        to, {
            [type]: buferFile,
            caption: caption,
            mimetype: mimetype,
            ptt: type === 'audio' ? true : false,
            fileName: filename
        }, quoted, cache
    );

    if (type === 'audio' || type === 'video') {
        const tempDirectory = 'temp/';
        const files = await fs.readdir(tempDirectory);

        await Promise.all(files.map(async (file) => {
            const filePath = path.join(tempDirectory, file);
            await fs.unlink(filePath);
        }));
    }

    return data;
}

async newbuffer(mp4) {
    try {
        const filePath = path.join('temp', mp4);
        const buffer = await fs.readFile(filePath);
        return buffer;
    } catch (error) {
        throw new Error('Falha ao ler o arquivo mp4');
    }
}

async criaFile(tipo, origem) {
    try {
        if (tipo == 'file') {
            const randomName = uuidv4();
            const fileExtension = path.extname(origem.originalname);
            const newFileName = `${randomName}${fileExtension}`;

            await fs.writeFile('temp/' + newFileName, origem.buffer);
            return 'temp/' + newFileName;
        }
    } catch (error) {
        throw new Error('Falha ao converter o arquivo MP4');
    }
}

async convertemp4(file, retorno) {
    try {
        const tempAudioPath = file;
        const output = 'temp/' + retorno;
        const ffmpegCommand = `${ffmpegPath.path} -i "${tempAudioPath}" -vn -ab 128k -ar 44100 -f ipod "${output}" -y`;

        exec(ffmpegCommand, (error, stdout, stderr) => {
            if (error) {
                reject({
                    error: true,
                    message: 'Falha ao converter o áudio.',
                });
            } else {
                return retorno;
            }
        });
    } catch (error) {
        throw new Error('Falha ao converter o arquivo MP4');
    }
}

async DownloadProfile(of,group=false) {
	try{
	if(!group)
		{
			
   of = await this.verifyId(of);
		}
	else
		{
	await this.verifyGroup(of);
		}
	
    const ppUrl = await this.instance.sock?.profilePictureUrl(of,
        'image'
    );
    return ppUrl;
	}
	catch(e)
	{
	return process.env.APP_URL+'/img/noimage.jpg'
	}
}

async getUserStatus(of) {
    of = await this.verifyId(of);
    const status = await this.instance.sock?.fetchStatus(of)
    return status;
}

async contacts() {
    const folderPath = 'db/' + this.key;
    const filePath = path.join(folderPath, 'contacts.json');
    try {
        await fs.access(folderPath);

        const currentContent = await fs.readFile(filePath, 'utf-8');
        const existingContacts = JSON.parse(currentContent);
        return {
            error: false,
            contacts: existingContacts,
        };
    } catch (error) {
        return {
            error: true,
            message: 'Os contatos ainda não foram carregados.',
        };
    }
}


async blockUnblock(to, data) {
    try {
        if (!data === 'block') {
            data = 'unblock';
        }

        to = await this.verifyId(to);
        const status = await this.instance.sock?.updateBlockStatus(to, data);
        return status;
    } catch (e) {
        return {
            error: true,
            message: 'Falha ao bloquear/desbloquear',
        };
    }
}

async sendButtonMessage(to, data) {
   to = await this.verifyId(to);
    const result = await this.instance.sock?.sendMessage(to,
        {
            templateButtons: processButton(data.buttons),
            text: data.text ?? '',
            footer: data.footerText ?? '',
            viewOnce: true
        }
    );
    return result;
}

async sendContactMessage(to, data) {
    to = await this.verifyId(to);
    const vcard = generateVC(data);
    const result = await this.instance.sock?.sendMessage(to,
        {
            contacts: {
                displayName: data.fullName,
                contacts: [{
                    displayName: data.fullName,
                    vcard
                }, ],
            },
        }
    );
    return result;
}

async sendListMessage(to, type, options, groupOptions, data) {
    if (type === 'user') {
      to =  await this.verifyId(to);
       
    } else {
        
       await this.verifyGroup(to);
    }
    if (options && options.delay && options.delay > 0) {
        await this.setStatus('composing', to, type, options.delay);
    }

    let mentions = false;

    if (type === 'group' && groupOptions && groupOptions.markUser) {
        if (groupOptions.markUser === 'ghostMention') {
            const metadata = await this.instance.sock?.groupMetadata(this.getGroupId(to));
            mentions = metadata.participants.map((participant) => participant.id);
        } else {
            mentions = this.parseParticipants(groupOptions.markUser);
        }
    }

    let quoted = {
        quoted: null
    };

    if (options && options.replyFrom) {
        const msg = await this.getMessage(options.replyFrom, to);

        if (msg) {
            quoted = {
                quoted: msg
            };
        }
    }

    const msgList = {
        text: data.title,
        title: data.title,
        description: data.description,
        buttonText: data.buttonText,
        footerText: data.footerText,
        sections: data.sections,
        listType: 2,
    };

    let idlogado = await this.idLogado();
    const msgRes = generateWAMessageFromContent(to, {
        listMessage: msgList,
        mentions
    }, quoted, {
        idlogado
    });

    const result = await this.instance.sock?.relayMessage(to, msgRes.message, msgRes.key.id);

    return msgRes;
}

async sendMediaButtonMessage(to, data) {
   to = await this.verifyId(to);

    const result = await this.instance.sock?.sendMessage(
        this.getWhatsAppId(to), {
            [data.mediaType]: {
                url: data.image,
            },
            footer: data.footerText ?? '',
            caption: data.text,
            templateButtons: processButton(data.buttons),
            mimetype: data.mimeType,
            viewOnce: true
        }
    );
    return result;
}

async createJid(number) {
    if (!isNaN(number)) {
        const jid = `${number}@s.whatsapp.net`;
        return jid;
    } else {
        return number;
    }
}

async setStatus(status, to, type, pause = false) {

	try{
	if (type === 'user') {
       to = await this.verifyId(to);
      
    } else {
       
        await this.verifyGroup(to);
    }	

    const result = await this.instance.sock?.sendPresenceUpdate(status, to);
    if (pause > 0) {
        await delay(pause * 1000);
        await this.instance.sock?.sendPresenceUpdate('paused', to);
    }
    return result;
	}
	catch(e)
	{
	throw new Error('Falha ao enviar a presença, verifique o id e tente novamente')
	}
}

async updateProfilePicture(to, url, type) {

    try {
       
        if (type === 'user') {
	 		to = await this.verifyId(this.getWhatsAppId(to));
           
        } else {
           
            await this.verifyGroup(to);
        }

        const img = await axios.get(url, {
            responseType: 'arraybuffer'
        });
        const res = await this.instance.sock?.updateProfilePicture(to, img.data);
        return {
            error: false,
            message: 'Foto alterada com sucesso!',
        };
    } catch (e) {
		console.log(e)
        return {
            error: true,
            message: 'Unable to update profile picture',
        };
    }
}

	async mystatus(status)
{
	try
	{
		 const result = await this.instance.sock?.sendPresenceUpdate(status)
		 return {
                error: false,
                message:
                    'Status alterado para '+status,
            }
		
	}
	catch (e) 
	{
		return {
                error: true,
                message:
                    'Não foi possível alterar para o status '+status,
            }
		
	}
	
}

    // get user or group object from db by id
    async getUserOrGroupById(id) {
        try {
            let Chats = await this.getChat()
            const group = Chats.find((c) => c.id === this.getWhatsAppId(id))
            if (!group)
                throw new Error(
                    'unable to get group, check if the group exists'
                )
            return group
        } catch (e) {
            logger.error(e)
            logger.error('Error get group failed')
        }
    }

    // Group Methods
    parseParticipants(users) {
        return users.map((users) => this.getWhatsAppId(users))
    }

    async updateDbGroupsParticipants() {
        try {
            let groups = await this.groupFetchAllParticipating()
            let Chats = await this.getChat()
            if (groups && Chats) {
                for (const [key, value] of Object.entries(groups)) {
                    let group = Chats.find((c) => c.id === value.id)
                    if (group) {
                        let participants = []
                        for (const [
                            key_participant,
                            participant,
                        ] of Object.entries(value.participants)) {
                            participants.push(participant)
                        }
                        group.participant = participants
                        if (value.creation) {
                            group.creation = value.creation
                        }
                        if (value.subjectOwner) {
                            group.subjectOwner = value.subjectOwner
                        }
                        Chats.filter((c) => c.id === value.id)[0] = group
                    }
                }
                await this.updateDb(Chats)
            }
        } catch (e) {
            logger.error(e)
            logger.error('Error updating groups failed')
        }
    }

    async createNewGroup(name, users) {
	
        try {
            const group = await this.instance.sock?.groupCreate(
                name,
                users.map(this.getWhatsAppId)
            )
            return group
        } catch (e) {
            return {
                error: true,
                message:
                    'Erro ao criar o grupo',
            }
        }
    }

async groupFetchAllParticipating() {
	
		const cacheDir = 'db/' + this.key;
        const cacheFile = path.join(cacheDir, 'groups.json');

       
        try {
			
            await fs.access(cacheFile);
            const data = await fs.readFile(cacheFile, 'utf-8');
            return JSON.parse(data);
        } catch (e) {
			
           try {
            await fs.access(cacheDir);
        } catch (e) {
            await fs.mkdir(cacheDir, { recursive: true });
        }
		const checkEvent = await GroupsCache.get(this.key);
		
        if (!checkEvent) {
			
           await GroupsCache.set(this.key, true);
        }
		
		const result = await this.instance.sock?.groupFetchAllParticipating();
		
		 if (result && Object.keys(result).length > 0) {
            await fs.writeFile(cacheFile, JSON.stringify(result), 'utf-8');
		
		return result;
        } else {
            
        }	
			
     }
}
         
async  updateGroupData() {
		await delay(1000);
   
    if (!this.key) {
        return;
    }

   
    
    const cacheDir = 'db/' + this.key;
    const cacheFile = path.join(cacheDir, 'groups.json');

    let result;

    try {
      
        const checkEvent = GroupsCache.get(this.key);
       

        if (checkEvent) {
           
            return false; 
        }

       
        result = await this.instance.sock?.groupFetchAllParticipating();

      
        try {
            await fs.access(cacheDir);
        } catch (e) {
            await fs.mkdir(cacheDir, { recursive: true });
        }

       
        if (result && Object.keys(result).length > 0) {
            await fs.writeFile(cacheFile, JSON.stringify(result), 'utf-8');
           
        } else {
            
        }
    } catch (e) {
       
    } finally {
        
        GroupsCache.set(this.key, true);
    }

    return result;
}

async verifyGroup(id) {
	
    try {
		
		if(GroupsMetaDados.get(id+this.key))
			{
				return true
			}
    const result = await this.groupFetchAllParticipating()
		if(result.hasOwnProperty(id))
		{
			
		GroupsMetaDados.set(id+this.key, true);	
        return true;
		}
		else
		{
			  throw new Error('Grupo não existe');	
		}
    } catch (error) {
		console.log(error)

        throw new Error('Grupo não existe');
    }
}


	
 
 async addNewParticipant(id, users) {
		
        try {
		await this.verifyGroup(id); 
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
              this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "add"
				  
            )
            return res
		}			
         catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    async makeAdmin(id, users) {
		
        try {
			await this.verifyGroup(id);
            const res = await this.instance.sock?.groupParticipantsUpdate(
               this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "promote"
				  
            )
            return res
		
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }
			
 async removeuser(id, users) {
		
        try {
			await this.verifyGroup(id);
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "remove"
				  
            )
            return res
		
			
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    async demoteAdmin(id, users) {
		
        try {
			await this.verifyGroup(id);
			
            const res = await this.instance.sock?.groupParticipantsUpdate(
                this.getGroupId(id),
                 users.map(this.getWhatsAppId),
				  "demote"
				  
            )
       
        } catch {
            return {
                error: true,
                message:
                    'Unable to add participant, you must be an admin in this group',
            }
        }
    }

    

async idLogado()
{
		const user_instance = this.instance.sock?.user.id;
		const user = this.getWhatsAppId(user_instance.split(':')[0]);
		return user;
}
 async joinURL(url)
		{
		try
		{
			const partesDaURL = url.split('/');
			const codigoDoGrupo = partesDaURL[partesDaURL.length - 1];
		
		const entrar = await this.instance.sock?.groupAcceptInvite(codigoDoGrupo);
                await this.updateGroupData()
		GroupsMetaDados.flushAll();
			
		return entrar
		//voltarnoGrupo
		
		}
		catch(e)
		{
		return {
                error: true,
                message:'Erro ao entrar via URL, verifique se a url ainda é valida ou se o grupo é um grupo aberto.',
            }
		
		}
		
	}

    async leaveGroup(id) {


        try {
           await this.verifyGroup(id);
			await this.instance.sock?.groupLeave(id)
            
			 return {
                error: false,
                message:
                    'Saiu do grupo.',
            		}
			
        } catch (e) {
            return {
                error: true,
                message:
                    'Erro ao sair do grupo, verifique se o grupo ainda existe.',
            }
        }
}


    async getInviteCodeGroup(id) {
		
        try {
           await this.verifyGroup(id);
            const convite =  await this.instance.sock?.groupInviteCode(id)
			const url ='https://chat.whatsapp.com/'+convite
			return url;
			
        } catch (e) {
           
            return {
                error: true,
                message:
                    'Erro ao verificar o grupo, verifique se o grupo ainda existe ou se você é administrador.',
            }
        }
    }

    async getInstanceInviteCodeGroup(id) {
        try {
			await this.verifyGroup(id);
            return await this.instance.sock?.groupInviteCode(id)
        } catch (e) {
            logger.error(e)
            logger.error('Error get invite group failed')
        }
    }
      			
    async groupSettingUpdate(id, action) {
        try {
			await this.verifyGroup(id);
            const res = await this.instance.sock?.groupSettingUpdate(
               id,
               action
            )
            return {
                error: false,
                message:
                   'Alteração referente a ' + action + ' Concluida',
            }
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Erro ao alterar' + action + ' Verifique se você tem permissão ou se o grupo existe',
            }
        }
    }

    async groupUpdateSubject(id, subject) {
		
        try {
			await this.verifyGroup(id);
            const res = await this.instance.sock?.groupUpdateSubject(
                this.getWhatsAppId(id),
                subject
            )
			return {
                error: false,
                message:
                    'Nome do grupo alterado para '+subject
            }
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Erro ao alterar o grupo, verifique se você é administrador ou se o grupo existe',
            }
        }
    }

    async groupUpdateDescription(id, description) {
		
        try {
			await this.verifyGroup(id);
            const res = await this.instance.sock?.groupUpdateDescription(
                id,
                description
            )
			//console.log(res)
            return {
                error: false,
                message:
                    'Descrição do grupo alterada para '+description
            }
        } catch (e) {
            
            return {
                error: true,
                message:
                    'Falha ao alterar a descrição do grupo, verifique se você é um administrador ou se o grupo existe',
            }
        }
    }

async groupGetInviteInfo(url) {
        try {
			await this.verifyGroup(id);
			const codeurl = url.split('/');


			const code = codeurl[codeurl.length - 1];
			
			
            const res = await this.instance.sock?.groupGetInviteInfo(code)
	 	
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Falha ao obter o verificar o grupo. Verifique o codigo da url ou se o grupo ainda existe..',
            }
        }
    }


async groupidinfo(id) {
    

    try {
        await this.verifyGroup(id);
        
	    const result = await this.groupFetchAllParticipating()
		if(result.hasOwnProperty(id))
		{
			
		return  result[id];	
       
		}
		else
			{
		return {
            error: true,
            message: 'Grupo não existe!',
        		};
				
			}
    } catch (e) {
      
        return {
            error: true,
            message: 'Grupo não existe',
        };
    }
}


async groupAcceptInvite(id) {
        try {
            const res = await this.instance.sock?.groupAcceptInvite(id)
            return res
        } catch (e) {
            //console.log(e)
            return {
                error: true,
                message:
                    'Falha ao obter o verificar o grupo. Verifique o codigo da url ou se o grupo ainda existe..',
            }
        }
    }

    // update db document -> chat
    async updateDb(object) {
        try {
            await Chat.updateOne({ key: this.key }, { chat: object })
        } catch (e) {
            logger.error('Error updating document failed')

        }
    }

    async readMessage(msgObj) {
        try {
            const key = {
                remoteJid: msgObj.remoteJid,
                id: msgObj.id,
                participant: msgObj?.participant // required when reading a msg from group
            }
            const res = await this.instance.sock?.readMessages([key])
            return res
        } catch (e) {
            logger.error('Error read message failed')
        }
    }

    async reactMessage(id, key, emoji) {
        try {
            const reactionMessage = {
                react: {
                    text: emoji, // use an empty string to remove the reaction
                    key: key
                }
            }
            const res = await this.instance.sock?.sendMessage(
                this.getWhatsAppId(id),
                reactionMessage
            )
            return res
        } catch (e) {
            logger.error('Error react message failed')
        }
    }
}

exports.WhatsAppInstance = WhatsAppInstance
