const express = require('express'),
    router = express.Router();

const { config } = require('../config/config-app'),
    { isAuthenticated } = require('../utils/util-auth');

const adminModel = require('../models/model-admin'),
    userModel = require('../models/model-user');

//-- Vista login
router.get('/administrador/login', (req, res) => {
    res.render('admin/login', {
        title: 'Login de Administrador'
    });
});
//-- Vista registro
router.get('/administrador/registro', (req, res) => {
    res.render('admin/register', {
        title: 'Registro de Administrador'
    });
});
//-- Vista dashboard
router.get('/administrador', (req, res) => {
    res.render('admin/dashboard', {
        title: 'Dashboard'
    });
});
module.exports = router;
