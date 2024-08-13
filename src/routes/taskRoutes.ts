import { Router } from 'express';
import TaskController from '../controllers/taskController';
import AuthMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.use(AuthMiddleware.checkAuth);

router.post('/', TaskController.create);
router.get('/', TaskController.getAll);

router.get('/search', TaskController.search);

router.get('/filter', TaskController.filter);

router.get('/:id', TaskController.getById);
router.put('/:id', TaskController.update);

router.delete('/:id', TaskController.remove);

export default router;
