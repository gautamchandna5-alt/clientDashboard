import express from 'express';
import { getMyProjects, getDevelopers, createTask, getAssignedTasks } from '../controllers/pmController.js';

const router = express.Router();

router.get('/projects/:pmId', getMyProjects);
router.get('/developers', getDevelopers);
router.post('/tasks', createTask);
router.get('/assigned-tasks/:pmId', getAssignedTasks);

export default router;