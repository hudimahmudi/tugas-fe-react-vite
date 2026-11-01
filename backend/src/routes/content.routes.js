const router = require('express').Router();
const auth = require('../middleware/auth');
const { listContents, getContent, createContent, updateContent, deleteContent } = require('../controllers/content.controller');

router.use(auth);

router.get('/', listContents);
router.get('/:id', getContent);
router.post('/', createContent);
router.patch('/:id', updateContent);
router.delete('/:id', deleteContent);

module.exports = router;