const httpError = require('../utils/httpError');
const { today } = require('../utils/date');

// Input kosong dianggap 0, supaya cocok dengan form frontend
function toCount(value, field) {
  if (value === undefined || value === null || value === '') return 0;

  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw httpError(422, `${field} harus berupa angka bulat, minimal 0`);
  }
  return n;
}

function validateMetricInput(body = {}) {
  const recordedAt = body.recorded_at || today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(recordedAt)) {
    throw httpError(422, 'recorded_at harus berformat YYYY-MM-DD');
  }

  return {
    recorded_at: recordedAt,
    views_count: toCount(body.views_count ?? body.views, 'views_count'),
    likes_count: toCount(body.likes_count ?? body.likes, 'likes_count'),
    comments_count: toCount(body.comments_count ?? body.comments, 'comments_count'),
    shares_count: toCount(body.shares_count ?? body.shares, 'shares_count'),
  };
}

module.exports = { validateMetricInput };