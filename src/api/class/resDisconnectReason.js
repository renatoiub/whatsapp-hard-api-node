const dotenv = require('dotenv')
const https = require('https');
const axios = require('axios');
const agent = new https.Agent({
	rejectUnauthorized: false
});
dotenv.config()
const config = require('../../config/config')
//
const resDisconnectReason = {
	genericOut: 400,
	loggedOut: 401, // Logged out from another device
	bannedTimetamp: 402, // The status code 402 has a banned timetamp, account temporarily banned
	bannedTemporary: 403, // This is now called LOCKED in the WhatsApp Web code, account banned, primary device was logged out
	forbidden: 403,
	clientOutdated: 405, // Client is out of date
	unknownLogout: 406, // This is now called BANNED in the WhatsApp Web code, logged out for unknown reason
	timedOut: 408,
	connectionLost: 408,
	dadUserAgent: 409, // Client user agent was rejected
	multideviceMismatch: 411,
	CATExpired: 413, // Messenger crypto auth token has expired
	CATInvalid: 414, // Messenger crypto auth token is invalid
	notFound: 415,
	connectionClosed: 428,
	connectionReplaced: 440,
	badSession: 500,
	experimental: 501,
	unavailableService: 503,
	restartRequired: 515,
	serviceQr: 'qrCode',
	serviceOpen: 'open',
};
//
module.exports = class Disconnect {

	static async lastDisconnect(key, lastDisconnect) {
		if(lastDisconnect == 'qrCode'){
			var statusCode = 'qrCode';
		}else if(lastDisconnect == 'open'){
			var statusCode = 'open';
		}else{
			var statusCode = lastDisconnect?.error ? lastDisconnect.error?.output?.statusCode : 0;
		}
		
		//
		var addJson = {};
		//
		switch (statusCode) {
			case resDisconnectReason.serviceOpen:
				//
				console.log(`- Connection open`);
				//
				addJson = {
					SessionName: key,
					state: "CONNECTED",
					status: "inChat",
					message: "Sistema conectado"
				};
				//
				break;
				case resDisconnectReason.serviceQr:
					//
					console.log(`- Connection open`);
					//
					addJson = {
						SessionName: key,
						state: "QRCODE",
						status: "qrRead",
						message: "Aguardando leitura do qr-code"
					};
					//
					break;
			case resDisconnectReason.loggedOut:
				// Device Logged Out, Deleting Session
				console.log(`- Connection loggedOut`);
				//
				addJson = {
					SessionName: key,
					state: "CLOSED",
					status: "notLogged",
					message: "Sistema desconectado"
				};
				//
				break;
			case resDisconnectReason.bannedTemporary:
				//
				console.log(`- User banned temporary`);
				//
				addJson = {
					SessionName: key,
					state: "BANNED",
					status: "notLogged",
					message: "Sistema desconectado"
				};
				//
				break;
				case resDisconnectReason.forbidden:
					//
					console.log(`- User banned temporary`);
					//
					addJson = {
						SessionName: key,
						state: "BANNED",
						status: "notLogged",
						message: "Sistema desconectado"
					};
					//
					break;
			case resDisconnectReason.bannedTimetamp:
				//
				console.log(`- User banned timestamp`);
				//
				addJson = {
					SessionName: key,
					state: "BANNED",
					status: "notLogged",
					message: "Sistema desconectado"
				};
				//
				break;
			case resDisconnectReason.timedOut:
				//
				console.log(`- Connection TimedOut`);
				//
				addJson = {
					SessionName: key,
					state: "CONNECTING",
					status: "desconnectedMobile",
					message: "Dispositivo conectando"
				};
				//
				break;
			case resDisconnectReason.connectionLost:
				//
				console.log(`- Connection Los`);
				//
				addJson = {
					SessionName: key,
					message: "Dispositivo conectando",
					state: "CONNECTING",
					status: "desconnectedMobile"
				};
				//
				break;
			case resDisconnectReason.multideviceMismatch:
				//
				console.log('- Connection multideviceMismatch');
				//
				addJson = {
					SessionName: key,
					message: "Dispositivo conectando",
					state: "CONNECTING",
					status: "desconnectedMobile"
				};
				//
				break;
			case resDisconnectReason.connectionClosed:
				//
				console.log(`- Connection connectionClosed`);
				//
				addJson = {
					SessionName: key,
					message: "Sistema desconectado",
					state: "CLOSED",
					status: "notLogged"
				};
				//
				break;
			case resDisconnectReason.connectionReplaced:
				//
				// Connection Replaced, Another New Session Opened, Please Close Current Session First
				console.log(`- Connection connectionReplaced`);
				//
				addJson = {
					SessionName: key,
					state: "DISCONNECTED",
					status: "notLogged",
					message: "Dispositivo desconectado"
				};
				//
				break;
			case resDisconnectReason.badSession:
				//
				// Bad session file, delete and run again
				console.log(`- Connection badSession`.red);
				//
				addJson = {
					SessionName: key,
					state: "DISCONNECTED",
					status: "notLogged",
					message: "Dispositivo desconectado"
				};
				//
				break;
			case resDisconnectReason.restartRequired:
				//
				console.log('- Connection restartRequired');
				//
				addJson = {
					SessionName: key,
					message: "Sistema desconectado",
					state: "CLOSED",
					status: "notLogged"
				};
				//
				break;
			case resDisconnectReason.genericOut:
				//
				console.log('- Generic Error');
				//
				addJson = {
					SessionName: key,
					state: "ERROR",
					status: "genericError",
					message: "Erro genérico"
				};
				//
				break;
			case resDisconnectReason.clientOutdated:
				//
				console.log('- Client Outdated');
				//
				addJson = {
					SessionName: key,
					state: "OUTDATED",
					status: "updateRequired",
					message: "Cliente desatualizado, atualização necessária"
				};
				//
				break;
			case resDisconnectReason.unknownLogout:
				//
				console.log('- Unknown Logout Reason');
				//
				addJson = {
					SessionName: key,
					state: "CLOSED",
					status: "notLogged",
					message: "Logout desconhecido"
				};
				//
				break;
			case resDisconnectReason.dadUserAgent:
				//
				console.log('- Bad User Agent');
				//
				addJson = {
					SessionName: key,
					state: "ERROR",
					status: "invalidUserAgent",
					message: "User Agent inválido"
				};
				//
				break;
			case resDisconnectReason.CATExpired:
				//
				console.log('- Crypto Auth Token Expired');
				//
				addJson = {
					SessionName: key,
					state: "AUTH_FAILED",
					status: "tokenExpired",
					message: "Token de autenticação criptografada expirado"
				};
				//
				break;
			case resDisconnectReason.CATInvalid:
				//
				console.log('- Invalid Crypto Auth Token');
				//
				addJson = {
					SessionName: key,
					state: "AUTH_FAILED",
					status: "invalidToken",
					message: "Token de autenticação criptografada inválido"
				};
				//
				break;
			case resDisconnectReason.notFound:
				//
				console.log('- Resource Not Found');
				//
				addJson = {
					SessionName: key,
					state: "ERROR",
					status: "resourceNotFound",
					message: "Recurso não encontrado"
				};
				//
				break;
			case resDisconnectReason.experimental:
				//
				console.log('- Experimental Feature Issue');
				//
				addJson = {
					SessionName: key,
					state: "ERROR",
					status: "experimental",
					message: "Problema de Recurso Experimental"
				};
				//
				break;
			case resDisconnectReason.unavailableService:
				//
				console.log('- Service Unavailable');
				//
				addJson = {
					SessionName: key,
					state: "ERROR",
					status: "serviceUnavailable",
					message: "Serviço Indisponível"
				};
				//
				break;
			default:
				//
				//console.log(`- lastDisconnect: ${lastDisconnect?.error}`);
				//
		}
		//
		if (Object.keys(addJson).length !== 0) {
			//
			if (config.reasonUrl) {
				await axios({
					method: 'POST',
					maxBodyLength: Infinity,
					url: `${config.reasonUrl}`,
					httpsAgent: agent,
					headers: {
						'Content-Type': 'application/json;charset=utf-8',
						'Accept': 'application/json'
					},
					data: addJson
				}).then(async (response) => {
					let responseData = response?.data;
					let statusCode = response?.status;
					let statusText = response?.statusText;
					//
					console.log('- Redirect Success');
					//
					console.log(`- Success: status ${statusText}`);
					console.log(`- Success: statusCode ${statusCode}`);
					//
					console.log('=====================================================================================================');
					//
					//
					//res.setHeader('Content-Type', 'application/json');
					//return res.status(statusCode).json(responseData);
					//
				}).catch(async (error) => {
					let responseError = error?.response?.data;
					let statusCode = error?.response?.status || 401;
					let statusText = error?.response?.statusText;
					let errorMessage = error?.message;
					//
					//console.log(JSON.stringify(responseError, undefined, 2));
					//
					console.log(`- Redirect Error`);
					//
					//
					console.log(`- Error: status ${statusText}`);
					console.log(`- Error: statusCode ${statusCode}`);
					console.log(`- Error: errorMessage ${errorMessage}`);
					//
					console.log('=====================================================================================================');
					//
					//res.setHeader('Content-Type', 'application/json');
					//return res.status(statusCode).json(responseError);
					//
				});
				//
			}
		}
		//
	}
}