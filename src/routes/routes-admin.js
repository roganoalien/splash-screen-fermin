const express = require('express'),
    { check, validationResult } = require('express-validator/check'),
    passport = require('passport'),
    moment = require('moment'),
    router = express.Router();

const { config } = require('../config/config-app'),
    { isAuthenticated } = require('../utils/util-auth');

const Admin = require('../models/model-admin'),
    User = require('../models/model-user');

//-- Vista login
router.get('/administrador/login', (req, res) => {
    res.render('admin/login', {
        title: 'Login de Administrador'
    });
});
//-- Inicio de sesión
router.post(
    '/administrador/login',
    passport.authenticate('local', {
        successRedirect: '/administrador',
        successFlash: 'Sesión Iniciada',
        failureRedirect: '/administrador/login',
        failureFlash: 'Email o Password incorrecto'
    })
);
//-- Vista registro
router.get('/administrador/registro', (req, res) => {
    res.render('admin/register', {
        title: 'Registro de Administrador'
    });
});
//-- Guardamos registro inicial
router.post(
    '/administrador/registro',
    [
        check('name')
            .isLength({ min: 4 })
            .withMessage('El nombre debe de tener mínimo 4 carácteres'),
        check('email')
            .not()
            .isEmpty()
            .withMessage('Debe elegirse un correo')
            .isEmail()
            .withMessage('Se debe elegir un correo válido'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('La contraseña debe de tener al menos 8 carácteres')
            .matches('[0-9]')
            .withMessage('La contraseña debe de tener mínimo un número')
            .matches('[a-z]')
            .withMessage('La contraseña debe de tener mínimo una minúscula')
            .matches('[A-Z]')
            .withMessage('La contraseña debe de tener mínimo una mayúscula'),
        check('password').custom((value, { req, loc, path }) => {
            if (value !== req.body.confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            } else {
                return value;
            }
        })
    ],
    async (req, res) => {
        const { name, email, password } = req.body,
            emailUser = await Admin.findOne({ email }),
            errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('admin/register', {
                title: 'Registro de Administrador',
                errors: errors.array()
            });
        } else {
            console.log('REGISTRO -- sin errores');
            if (emailUser) {
                console.log('REGISTRO -- correo EXISTE');
                req.flash('error', '¡El email ya se ha utilizado!');
                res.redirect('/administrador/registro');
            } else {
                console.log('REGISTRO -- correo NO EXISTE');
                const newAdmin = new Admin({ name, email });
                newAdmin.password = await newAdmin.encryptPassword(password);
                await newAdmin.save();
                req.flash('success', '¡Registro Completado!');
                res.redirect('/administrador/login');
            }
        }
    }
);
//-- Vista dashboard
router.get('/administrador', isAuthenticated, async (req, res) => {
    const dateNow = moment().format('DD/MM/YYYY');
    const thisMonth = moment().format('/MM/');
    let regex = new RegExp(thisMonth, 'i');
    const searchNumber = await User.countDocuments({ date: dateNow });
    const searchMonth = await User.countDocuments({ date: regex });
    const searchTotal = await User.countDocuments();
    res.render('admin/dashboard', {
        title: 'Dashboard',
        usersToday: searchNumber,
        usersMonth: searchMonth,
        usersTotal: searchTotal
    });
});
router.get('/administrador/crear-admin', isAuthenticated, async (req, res) => {
    res.render('admin/create-admin', {
        title: 'Crear Administrador'
    });
});
//-- Cerrar Sesión
router.get('/administrador/logout', (req, res) => {
    req.logout();
    req.flash('success', '¡Sesión Cerrada!');
    res.redirect('/administrador/login');
});
//-- Registrar Usuario nuevo
router.post('/registrar/usuario', async (req, res) => {
    const { name, lastname, email, gender } = req.body;
    let birthday = req.body.birthday;
    birthday = moment(birthday).format('DD/MM/YYYY');
    const already = await User.findOne({ email });
    console.log(already);
    if (already) {
        req.flash('success', '¡Bienvenido de vuelta!');
        res.redirect('/');
    } else {
        const newUser = new User({ name, lastname, birthday, email, gender });
        await newUser.save();
        req.flash('success', '¡Gracias por registrarte!');
        res.render('/', {
            title: 'Redirigiendo',
            thisUser: await User.findOne({ email })
        });
    }
});

module.exports = router;
