Intruções:
Baixar e instalar o node (testado na versão 21.3)
instalar a as dependências usando npm i
Startar a aplicação usando npm start.

Arquivo ENV: 

Colocar no env a porta da aplicação, e os mimetypes que você deseja enviar via API.

O unico comando que precisa de reinicializar o servidor é a função de ignorar grupos.

Mapa de eventos para receber no webhook:

connection.update 
qrCode.update
presence.update
contacts.upsert
chats.upsert
chats.delete
messages.update
messages.upsert
call.events
groups.upsert
groups.update
group-participants.update
