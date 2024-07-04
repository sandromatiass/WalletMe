// Express
import { Router } from 'express';

import { isAuthenticated } from './middlewares/isAuthenticated';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';

const router = Router();

router.post('/new-user', new CreateUserController().handle);

router.post('/lognin', new AuthUserController().handle);

router.get('/detail/user', isAuthenticated, new DetailUserController().handle);

export { router };