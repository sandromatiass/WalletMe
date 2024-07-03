// Express
import { Router } from 'express';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { DetailUserController } from './controllers/user/DetailUserController';

const router = Router();

export { router };

router.post('/new-user', new CreateUserController().handle);

router.post('/lognin', new AuthUserController().handle);

router.get('/detail/user', isAuthenticated, new DetailUserController().handle);
