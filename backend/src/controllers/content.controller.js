const db = require('../config/db');
const httpError = require('../utils/httpError');
const { today } = require('../utils/date');
const { validateContentInput } = require('../validators/content.validator');
const { assertNextStatus, validatePublishUrl } = require('../validators/publish.validator');

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw httpError(404, 'Konten tidak ditemukan');
  return id;
}

async function ensureOwnedChannel(channelId, userId) {
  const channel = await db('channels').where({ id: channelId, user_id: userId }).first();
  if (!channel) throw httpError(422, 'Channel tidak ditemukan');
}

async function findOwnedContent(id, userId) {
  const content = await db('contents').where({ id, user_id: userId }).first();
  if (!content) throw httpError(404, 'Konten tidak ditemukan');
  return content;
}

function contentWithChannel(userId) {
  return db('contents')
    .join('channels', 'contents.channel_id', 'channels.id')
    .where('contents.user_id', userId)
    .select('contents.*', 'channels.platform', 'channels.handle_name');
}

async function listContents(req, res, next) {
  try {
    const { status, channel_id, format_type, platform } = req.query;
    const query = contentWithChannel(req.user.id).orderBy('contents.id', 'desc');

    if (status) query.where('contents.status', status);
    if (channel_id) query.where('contents.channel_id', Number(channel_id));
    if (format_type) query.where('contents.format_type', format_type);
    if (platform) query.where('channels.platform', platform);

    res.json(await query);
  } catch (error) {
    next(error);
  }
}

async function getContent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const content = await contentWithChannel(req.user.id).where('contents.id', id).first();
    if (!content) throw httpError(404, 'Konten tidak ditemukan');

    const checklists = await db('content_checklists').where({ content_id: id }).orderBy('id');
    const metrics = await db('content_metrics')
      .where({ content_id: id })
      .orderBy('recorded_at', 'desc');

    res.json({ ...content, checklists, metrics });
  } catch (error) {
    next(error);
  }
}

async function createContent(req, res, next) {
  try {
    const data = validateContentInput(req.body || {});
    await ensureOwnedChannel(data.channel_id, req.user.id);

    const [id] = await db('contents').insert({
      ...data,
      user_id: req.user.id,
      status: 'idea',
    });

    const content = await contentWithChannel(req.user.id).where('contents.id', id).first();
    res.status(201).json(content);
  } catch (error) {
    next(error);
  }
}

async function updateContent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    const current = await findOwnedContent(id, req.user.id);

    const data = validateContentInput(req.body || {}, { partial: true });

    if (req.body && req.body.published_url !== undefined) {
      data.published_url = req.body.published_url ? String(req.body.published_url).trim() : null;
    }

    // Aturan transisi: hanya boleh maju satu tahap
    if (data.status !== undefined && data.status !== current.status) {
      assertNextStatus(current.status, data.status);
    }

    const nextStatus = data.status ?? current.status;
    const nextUrl = data.published_url !== undefined ? data.published_url : current.published_url;

    // Aturan publish: wajib punya published_url yang valid
    if (nextStatus === 'published') {
      validatePublishUrl(nextUrl);
      if (!current.published_date) data.published_date = today();
    }

    if (Object.keys(data).length === 0) {
      throw httpError(422, 'Tidak ada data yang diubah');
    }

    if (data.channel_id) await ensureOwnedChannel(data.channel_id, req.user.id);

    await db('contents').where({ id }).update(data);

    const content = await contentWithChannel(req.user.id).where('contents.id', id).first();
    res.json(content);
  } catch (error) {
    next(error);
  }
}

async function deleteContent(req, res, next) {
  try {
    const id = parseId(req.params.id);
    await findOwnedContent(id, req.user.id);

    // checklist dan metrik ikut terhapus lewat ON DELETE CASCADE
    await db('contents').where({ id }).del();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listContents,
  getContent,
  createContent,
  updateContent,
  deleteContent,
};