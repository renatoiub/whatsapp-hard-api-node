exports.onWhatsapp = async (req, res) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    const data = await WhatsAppInstances[req.query.key]?.verifyId(
        WhatsAppInstances[req.query.key]?.getWhatsAppId(req.body.id)
    )
    return res.status(201).json({ error: false, data: data })
}

exports.downProfile = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.DownloadProfile(
        req.body.id
    )
    return res.status(201).json({ error: false, data: data })
}

exports.getStatus = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.getUserStatus(
        req.body.id
    )
    return res.status(201).json({ error: false, data: data })
}
exports.contacts = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.contacts(
        req.query.key
    )
    return res.status(201).json({data})
}
exports.mystatus = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.mystatus(
        req.body.status
    )
    return res.status(201).json({data})
}
exports.chats = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.chats(
        req.body.id
    )
    return res.status(201).json({ error: false, data: data })
}

exports.blockUser = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key]?.blockUnblock(
        req.body.id,
        req.body.block_status
    )
    if (req.query.block_status == 'block') {
        return res
            .status(201)
            .json({ error: false, message: 'Contact Blocked' })
    } else
        return res
            .status(201)
            .json({ error: false, message: 'Contact Unblocked' })
}

exports.updateProfilePicture = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].updateProfilePicture(
        req.body.id,
        req.body.url,
		req.body.type
    )
    return res.status(201).json({ error: false, data: data })
}

exports.getUserOrGroupById = async (req, res) => {
    const data = await WhatsAppInstances[req.query.key].getUserOrGroupById(
        req.body.id
    )
    return res.status(201).json({ error: false, data: data })
}
