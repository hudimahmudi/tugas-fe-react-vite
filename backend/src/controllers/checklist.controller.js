const db = require('../config/db')

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function parseId(value){
    const id = Number(value)
    if(!Number.isInteger(id) || id <= 0 ) throw httpError(404, 'Konten tidak ditemukan')
    return id
}

async function addChecklist(req, res, next) {
    try {
        const contentId = parseId(req.params.id)

        const content = await db('contents').where({ id: contentId, user_id: req.user.id }).first()
        if (!content) throw httpError(404, 'Konten tidak ditemukan')

        const taskName = req.body?.task_name
        if (typeof taskName !== 'string'){
            throw httpError(422, 'nama tugas harus berupa teks')
        }
        
        const trimmed = taskName.trim()
        if (!trimmed) throw httpError(422, "nama tugas wajib diisi")
        if (trimmed.length > 255) throw httpError(422, 'nama tugas maksimal 255 karakter')

        const [id] = await db('content_checklists').insert({ content_id: contentId, task_name: trimmed })

        const checklist = await db('content_checklists').where({ id }).first();
        res.status(201).json(checklist);
    } catch (error) {
        next(error)
    }
}

async function toggleChecklist(req, res, next) {
    try {
        const checklistId = parseId(req.params.id)

        const owned = await db('content_checklists').join('contents', 'content_checklists.content_id', 'contents.id').where({
            'content_checklists.id': checklistId,
            'contents.user_id': req.user.id,
        })
        .select('content_checklists.id').first()
        if (!owned) throw httpError(404, 'Checklist tidak ditemukan');

        await db('content_checklists').where({ id: checklistId }).update({ is_completed: db.raw('NOT is_completed') })

        const checklists = await db('content_checklists').where({ id: checklistId }).first()
        res.status(200).json(checklists)
    } catch (error) {
       next(error) 
    }
}

async function deleteChecklist(req, res, next) {
    try {
        const checklistId = parseId(req.params.id)

        const owned = await db('content_checklists').join('contents', 'content_checklists.content_id', 'contents.id').where({
            'content_checklists.id' : checklistId, 'contents.user_id': req.user.id
        }).select('content_checklists.id').first()
        if(!owned) throw httpError(404, 'checklist tidak ditemukan')
        
        await db('content_checklists').where({ id: checklistId }).del()
        res.status(204).end()
    } catch (error) {
        next(error)
    }
}

module.exports = { addChecklist, toggleChecklist, deleteChecklist }