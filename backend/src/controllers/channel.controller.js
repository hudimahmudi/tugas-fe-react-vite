const db = require('../config/db');

const PLATFORMS = ['youtube', 'tiktok', 'instagram', 'linkedin'];

async function listChannels(req, res, next) {
  try {
    const channels = await db('channels')
      .where({ user_id: req.user.id })
      .select('id', 'platform', 'handle_name', 'created_at')
      .orderBy('id');

    res.json(channels);
  } catch (err) {
    next(err);
  }
}

async function createChannel(req, res, next) {
  try {
    const { platform, handle_name } = req.body;

    if (!PLATFORMS.includes(platform)) {
      return res.status(422).json({ message: 'Platform tidak valid' });
    }
    if (!handle_name || !handle_name.trim()) {
      return res.status(422).json({ message: 'Nama akun wajib diisi' });
    }
    if (handle_name.trim().length > 100) {
      return res.status(422).json({ message: 'Nama akun maksimal 100 karakter' });
    }

    const [id] = await db('channels').insert({
      user_id: req.user.id,
      platform,
      handle_name: handle_name.trim(),
    });

    const channel = await db('channels').where({ id }).first();
    res.status(201).json(channel);
  } catch (err) {
    next(err);
  }
}

module.exports = { listChannels, createChannel };