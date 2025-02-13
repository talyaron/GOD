import isLoggedIn from '../middlewares/isLoggedIn';

const router = require('express').Router();

import { login, secret } from '../controlers/userCont';

router
    .post('/login', login)
    .get('/get_secret', isLoggedIn, secret);

export default router;

