const db = require('../config/db');
const httpError = require('../utils/httpError');
const { validateMetricInput } = require('../validators/metric.validator');

function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw httpError(404, 'Konten tidak ditemukan');
  return id;
}

async function addMetric(req, res, next) {
  try {
    const contentId = parseId(req.params.id);

    const content = await db('contents')
      .where({ id: contentId, user_id: req.user.id })
      .first();
    if (!content) throw httpError(404, 'Konten tidak ditemukan');

    // Pencatatan metrik hanya dibuka setelah konten tayang
    if (content.status !== 'published') {
      throw httpError(422, 'Metrik hanya bisa dicatat untuk konten berstatus published');
    }

    const data = validateMetricInput(req.body || {});

    const [id] = await db('content_metrics').insert({
      content_id: contentId,
      ...data,
    });

    const metric = await db('content_metrics').where({ id }).first();
    res.status(201).json(metric);
  } catch (error) {
    next(error);
  }
}

module.exports = { addMetric };