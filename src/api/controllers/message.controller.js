exports.Text = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendTextMessage(
        req.body
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Image = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.body.id,
        req.file,
        'image',
	req.mimetype,
        req.body?.caption
    )
    return res.status(201).json({ error: false, data: data })
}
exports.sendurlfile = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.body,
       'url'
    )
    return res.status(201).json({ error: false, data: data })
}
exports.sendbase64file = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.body,
       'base64'
    )
    return res.status(201).json({ error: false, data: data })
}
exports.imageFile = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMedia(
        req.body.id,
		req.body.userType,
        req.file,	
        'image',
        req.body?.caption,
		req.body?.replyFrom,
		req.body?.caption,
		req.body?.replyFrom,
		req.body?.delay
    )
    return res.status(201).json({ error: false, data: data })
}
exports.audioFile = async (req, res) => {
	
    const data = await WhatsAppInstances[req.query.key].sendMedia(
        req.body.id,
		req.body.userType,
        req.file,	
        'audio',
        req.body?.caption,
		req.body?.replyFrom,
		req.body?.delay
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Video = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMedia(
        req.body.id,
		req.body.userType,
        req.file,	
        'video',
        req.body?.caption,
		req.body?.replyFrom,
		req.body?.delay
    )
    return res.status(201).json({ error: false, data: data })
}


exports.Audio = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaFile(
        req.body.id,
        req.file,
	req.mimetype,
        'audio'
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Document = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMedia(
        req.body.id,
		req.body.userType,
        req.file,	
        'document',
        req.body?.caption,
		req.body?.replyFrom,
		req.body?.delay
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Mediaurl = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendUrlMediaFile(
        req.body.id,
        req.body.url,
        req.body.type, // Types are [image, video, audio, document]
        req.body.mimetype, // mimeType of mediaFile / Check Common mimetypes in `https://mzl.la/3si3and`
        req.body.caption
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Button = async (req, res) => {
    // console.log(res.body)
    const data = await WhatsAppInstances[req.query.key].sendButtonMessage(
        req.body.id,
        req.body.btndata
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Contact = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendContactMessage(
        req.body.id,
        req.body.vcard
    )
    return res.status(201).json({ error: false, data: data })
}

exports.List = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendListMessage(
        req.body.id,
		req.body.type,
		req.body.options,
		req.body.groupOptions,
        req.body.msgdata
    )
    return res.status(201).json({ error: false, data: data })
}

exports.MediaButton = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].sendMediaButtonMessage(
        req.body.id,
        req.body.btndata
    )
    return res.status(201).json({ error: false, data: data })
}

exports.SetStatus = async (req, res) => {
    const presenceList = [
        'unavailable',
        'available',
        'composing',
        'recording',
        'paused',
    ]
    if (presenceList.indexOf(req.body.status) === -1) {
        return res.status(400).json({
            error: true,
            message:
                'status parameter must be one of ' + presenceList.join(', '),
        })
    }

    const data = await WhatsAppInstances[req.query.key]?.setStatus(
        req.body.status,
        req.body.id,
		req.body.type,
		req.body.delay
		
    )
    return res.status(201).json({ error: false, data: data })
}

exports.Read = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].readMessage(req.body.msg)
    return res.status(201).json({ error: false, data: data })
}

exports.React = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].reactMessage(req.body.id, req.body.key, req.body.emoji)
    return res.status(201).json({ error: false, data: data })
}
