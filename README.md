Intruções:
Baixar e instalar o node (testado na versão 21.3)<br>
Baixar ou clonar código da api neste repositório (git clone)<br>
Renomear o arquivo env.example para somente .env<br>
instalar a as dependências usando npm i <br>
Startar a aplicação usando: npm start. <br>

Arquivo ENV:<br> 

Colocar no env a porta da aplicação, e os mimetypes que você deseja enviar via API.<br>

A única alteração que requer a reiniciação do servidor é a função de ignorar grupos.<br>

Mapa de eventos para receber no webhook:<br>

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

Documentação via postman:<br>

<ul dir="auto">
<li><a target="_blank" href="https://api.postman.com/collections/26659340-3267c07d-49b4-432b-96d9-8a4cc94b3848?access_key=PMAT-01HHZBJN72MNQ4Z7J48CEFBCNP">Postman Json</a></li>
<li><a target="_blank" href="https://elements.getpostman.com/redirect?entityId=26659340-3267c07d-49b4-432b-96d9-8a4cc94b3848&entityType=collection" rel="nofollow"><img src="https://camo.githubusercontent.com/16a903fe0c8e857e22585b47d674a11dc7fd16a2d4ef6a2d0e932e70a62cb0d6/68747470733a2f2f72756e2e7073746d6e2e696f2f627574746f6e2e737667" alt="Run in Postman" data-canonical-src="https://run.pstmn.io/button.svg" style="max-width: 100%;"></a></li>
</ul>

<br>
<br>
<h3>Envio</h3>
<table>
<thead>
<tr>
<th></th>
<th></th>
</tr>
</thead>
<tbody>
<tr>
<td>Envia texto</td>
<td>✔</td>
</tr>
<tr>
<td>Send Buttons</td>
<td>❌</td>
</tr>
<tr>
<td>Send Template</td>
<td>❌</td>
</tr>
<tr>
<td>Arquivos: audio - video - image - document - gif <br><br>base64: <code>true</code></td>
<td>✔</td>
</tr>
	<tr>
<td>Send Media URL</td>
<td>✔</td>
</tr>
<tr>
<td>Send Media File</td>
<td>✔</td>
</tr>
<tr>
<td>Convert audio and video to whatsapp format</td>
<td>✔</td>
</tr>
<tr>
<td>Resposta de mensagem</td>
<td>✔</td>
</tr>
	<tr>
<td>Envia presença: Digitando.. Gravando audio..</td>
<td>✔</td>
</tr>
<tr>
<td>Send Location</td>
<td>✔</td>
</tr>
<tr>
<td>Send List</td>
<td>❌</td>
</tr>
<tr>
<td>Send Link Preview</td>
<td>❌</td>
</tr>
<tr>
<td>Send Contact</td>
<td>✔</td>
</tr>
<tr>
<td>Send Reaction - emoji</td>
<td>✔</td>
</tr>
	<tr>
<td>Get contacts</td>
<td>✔</td>
</tr>
	<tr>
<td>Grupos: Cria, entra, sai, adiciona contatos, remove contatos e admins. Marcação fantasma (ghostMention) true</td>
<td>✔</td>
</tr>
</tbody>
</table>

<br><br> Informações adicionais:<br>
A api não usa nenhum banco de dados.<br>
A api é multidevices e aceita vários números conectados<br>
O consumo médio de memória varia de quantidade de instâncias.<br>
Formato padrão dos arquivos de áudio e vídeo aceito pela Baileys sem passar por conversão: mp4 e ogg.<br>
Caso envie arquivos fora desses formatos a api vai converter automaticamente e pode consumir recursos da máquina e o prazo de envio é relativamente maior. 




<br><br>
Contribua com o projeto e receba atualizaçoes:<br>
Contato:<br>
Developer: https://github.com/renatoiub/<br>
Email: renatoiub@live.com<br>
Instagram: @renatoiub.<br>
Contribua com o projeto e receba atualizações:<br>
Pix: empresa@estoqueintegrado.com<br>

