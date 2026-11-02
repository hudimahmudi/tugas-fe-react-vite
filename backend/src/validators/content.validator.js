const { CONTENT_STATUSES, FORMAT_TYPES, PRIORITIES } = require('../config/constants');

function validationError(message) {
  const err = new Error(message);
  err.status = 422;
  return err;
}

function validateContentInput(body, { partial = false } = {}) {
  const data = {};

  if (!partial || body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title) throw validationError('Judul wajib diisi');
    if (title.length > 255) throw validationError('Judul maksimal 255 karakter');
    data.title = title;
  }

  if (!partial || body.channel_id !== undefined) {
    const channelId = Number(body.channel_id);
    if (!Number.isInteger(channelId) || channelId <= 0) {
      throw validationError('Channel wajib dipilih');
    }
    data.channel_id = channelId;
  }

  if (!partial || body.format_type !== undefined) {
    if (!FORMAT_TYPES.includes(body.format_type)) {
      throw validationError('Format konten tidak valid');
    }
    data.format_type = body.format_type;
  }

  if (body.status !== undefined) {
    if (!CONTENT_STATUSES.includes(body.status)) {
      throw validationError('Status tidak valid');
    }
    data.status = body.status;
  }

  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      throw validationError('Prioritas tidak valid');
    }
    data.priority = body.priority;
  }

  if (body.description !== undefined) {
    data.description = body.description ? String(body.description) : null;
  }

  if (body.script_draft !== undefined) {
    data.script_draft = body.script_draft ? String(body.script_draft) : null;
  }

  if (body.scheduled_date !== undefined) {
    data.scheduled_date = body.scheduled_date || null;
  }

  return data;
}

module.exports = { validateContentInput };