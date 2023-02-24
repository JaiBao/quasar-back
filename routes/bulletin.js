import { Router } from 'express'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import * as auth from '../middleware/auth.js'
import { checkBulletin, createBulletin, getAllBulletin, deleteBulletin } from '../controllers/bulletin.js'

const router = Router()

router.post('/create', jwt, admin, createBulletin)
router.get('/', getAllBulletin)
router.patch('/check', auth.jwt, checkBulletin)
router.delete('/delete/:id', auth.jwt, admin, deleteBulletin)

export default router
