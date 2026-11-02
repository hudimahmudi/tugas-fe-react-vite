const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  addChecklist,
  toggleChecklist,
  deleteChecklist,
} = require('../controllers/checklist.controller');

router.post('/contents/:id/checklists', auth, addChecklist);
router.patch('/checklists/:id/toggle', auth, toggleChecklist);
router.delete('/checklists/:id', auth, deleteChecklist);

module.exports = router;