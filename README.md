<h2 tabindex="-1" dir="auto" data-react-autofocus="true"><a id="user-content-whatsapp-api-nodejs" class="anchor" aria-hidden="true" tabindex="-1" href="#whatsapp-api-nodejs"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a>WhatsApp-hard- Api -NodeJs MultiDevice</h2>
<p dir="auto">Esta api é uma implementação do <a href="https://github.com/WhiskeySockets/Baileys">WhiskeySockets Baileys</a>, como um serviço RestFull Api, que controla funções do WhatsApp.<br>
Com este código, você pode criar chats de multiserviço, bots de serviço ou qualquer outro sistema que utilize o WhatsApp. Com este código, você não precisa conhecer JavaScript para Node.js, basta iniciar o servidor e fazer as solicitações na linguagem com a qual você se sentir mais confortável.</p>

<h2 tabindex="-1" dir="auto"><a id="user-content-infrastructure" class="anchor" aria-hidden="true" tabindex="-1" href="#infrastructure"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a>Intalação:</h2>

<h3 tabindex="-1" dir="auto" data-react-autofocus="true"><a id="user-content-1-docker-installation" class="anchor" aria-hidden="true" tabindex="-1" href="#1-docker-installation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a>Simple NPM install:</h3>

<ul dir="auto">
<li>Faça o download e a intalação do nodejs.<br>
https://nodejs.org/en/download<br>
Faça o download ou o clone deste repositório. É recomendado ter o git instalado para futuras atualizações:<br>
https://git-scm.com/downloads<br>
Comando para clonar este reposítorio:	
</li>
</ul>
<div class="highlight highlight-source-shell notranslate position-relative overflow-auto" dir="auto"><pre>git clone https://github.com/renatoiub/whatsapp-hard-api-node</pre><div class="zeroclipboard-container">
    <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 tooltipped-no-delay d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="git clone https://github.com/renatoiub/whatsapp-hard-api-node" tabindex="0" role="button">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>
    </clipboard-copy>
  </div></div>

  <ul dir="auto">
<li>Instalação de dependências</li>
</ul>
<div class="highlight highlight-source-shell notranslate position-relative overflow-auto" dir="auto"><pre>npm i or npm i --force</pre><div class="zeroclipboard-container">
    <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 tooltipped-no-delay d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="npm i or npm i --force" tabindex="0" role="button">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>
    </clipboard-copy>
  </div></div>

  <ul dir="auto">
<li>Renomear o arquivo env e configurar:
Renomear o arquivo env.example para <b>.env</b>	<br>
Colocar no env a porta da aplicação, e os mimetypes que você deseja enviar via API. Caso opite por proteger as rotas, terá que enviar o token Bearer token (Authorization: Bearer RANDOM_STRING_HERE) nas requisições.<br>
<br>
</li>
</ul>

 <ul dir="auto">
<li>Start da aplicação:</li>
</ul>
<div class="highlight highlight-source-shell notranslate position-relative overflow-auto" dir="auto"><pre>npm start</pre><div class="zeroclipboard-container">
    <clipboard-copy aria-label="Copy" class="ClipboardButton btn btn-invisible js-clipboard-copy m-2 p-0 tooltipped-no-delay d-flex flex-justify-center flex-items-center" data-copy-feedback="Copied!" data-tooltip-direction="w" value="npm start" tabindex="0" role="button">
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-copy js-clipboard-copy-icon">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-check js-clipboard-check-icon color-fg-success d-none">
    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
</svg>
    </clipboard-copy>
  </div></div>

<h2 tabindex="-1" dir="auto"><a id="user-content-infrastructure" class="anchor" aria-hidden="true" tabindex="-1" href="#infrastructure"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a>Intalação</h2>

<h3 tabindex="-1" dir="auto" data-react-autofocus="true"><a id="user-content-1-docker-installation" class="anchor" aria-hidden="true" tabindex="-1" href="#1-docker-installation"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a>Docker install:</h3>

<ul dir="auto">
<li>Crie uma imagem apartir do Dockerfile.<br></li>
<li>Edite o arquivo conforme a sua necessidade.<br></li>
<li>Comando para iniciar a imagem:<br>
docker build -t hard-api-whatsapp . <br>
<li>Certifique-se de estar na pasta onde o Dockerfile está</li>	
</li>

</ul>


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

Documentação:<br>

<ul dir="auto">
<li><a target="_blank" href="https://api.postman.com/collections/26659340-3267c07d-49b4-432b-96d9-8a4cc94b3848?access_key=PMAT-01HHZBJN72MNQ4Z7J48CEFBCNP">Json Postman</a></li>
<li><a target="_blank" href="https://www.postman.com/bold-spaceship-404300/workspace/whatsapp-hard-api-nodejs/collection/26659340-3267c07d-49b4-432b-96d9-8a4cc94b3848?action=share&creator=26659340">Postman Online</a></li>
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
<td>Conexão via qr_code</td>
<td>✔</td>
</tr>
<tr>
	<tr>
<td>Conexção via código de emparelhamento</td>
<td>✔</td>
</tr>
<tr>
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
<td>Send List (beta)</td>
<td><font style="color:green">✔</font></td>
</tr>
<tr>
<td>Send Link Preview</td>
<td>✔</td>
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
Caso envie arquivos fora desses formatos a api vai converter automaticamente e pode consumir recursos da máquina e o prazo de envio é relativamente maior.<br>
Formato padrão de saída de audio:<b>MP3</b><br>
Formato padrão de saída de video:<b>MP4</b>
 




<br><br>
Contribua com o projeto e receba atualizaçoes:<br>
Contato:<br>
Developer: https://github.com/renatoiub/<br>
Email: renatoiub@live.com<br>
Instagram: @renatoiub.<br>
Contribua com o projeto e receba atualizações:<br>
Pix: empresa@estoqueintegrado.com<br>

