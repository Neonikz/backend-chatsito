/*
    Path: api/login

*/


const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, login, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


//Crear nuevos usuarios
router.post('/new',[
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('password','El password es obligatorio').not().isEmpty(),
    check('email','El email es obligatorio').isEmail(),
    validateFields
],createUser );

//Login
router.post('/',[
    check('email','El email es obligatorio').isEmail(),
    check('password','El password es obligatorio').not().isEmpty(),
    validateFields
],login );

//Revalidar token
router.get('/renew', validateJWT ,renewToken );




module.exports = router;