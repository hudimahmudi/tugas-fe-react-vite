const { CONTENT_STATUSES } = require('../config/constants');
const httpError = require('../utils/httpError')

function assertNextStatus(current, next) {
    const from = CONTENT_STATUSES.indexOf(current)
    const allowed = CONTENT_STATUSES[from + 1]

    if (next !== allowed) {
        throw httpError(422, allowed
            ? `Status hanya bisa berpindah ke '${allowed}' dari '${current}'` : `Status '${current}' adalah tahap akhir`
        )
    }
}

function validatePublishUrl(url){
    if(!url) throw httpError(422, 'published_url wajib diisi untuk status published')
        if (url.length > 255) throw httpError(422, 'published_url maksimal 255 karakter')

            let parsed
            try {
                parsed = new URL(url)
            } catch { 
                throw httpError(422, 'published_url harus berupa tautan yang valid')
            }

            if(!['http:', 'https:'].includes(parsed.protocol)) {
                throw httpError(422, 'published_url harus berupa tautan http atau https')
            }
        }

        module.exports = { assertNextStatus, validatePublishUrl }