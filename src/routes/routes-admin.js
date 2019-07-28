const express = require('express'),
    router = express.Router();

const { config } = require('../config/config-app'),
    { isAuthenticated } = require('../utils/util-auth');

const adminModel = require('../models/model-admin'),
    userModel = require('../models/model-user');

router.get('/administrador/login', (req, res) => {
    res.render('admin/login', {
        title: 'Registro de Administrador'
    });
});

router.get('/administrador/registro', (req, res) => {
    res.render('admin/register', {
        title: 'Registro de Administrador'
    });
});

module.exports = router;
