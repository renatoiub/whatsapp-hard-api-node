Intruções:
Baixar e instalar o node (testado na versão 21.3)
Renomear o arquivo env.exemple para somente .env
instalar a as dependências usando npm i
Startar a aplicação usando npm start.

Arquivo ENV: 

Colocar no env a porta da aplicação, e os mimetypes que você deseja enviar via API.

A única alteração que requer a reiniciação do servidor é a função de ignorar grupos.

Mapa de eventos para receber no webhook:

connection.update <br>
qrCode.update<br>
presence.update<br>
contacts.upsert<br>
chats.upsert<br>
chats.delete<br>
messages.update<br>
messages.upsert<br>
call.events<br>
groups.upsert<br>
groups.update<br>
group-participants.update<br>
