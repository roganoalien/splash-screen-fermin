const express = require('express'),
    { check, validationResult } = require('express-validator/check'),
    passport = require('passport'),
    moment = require('moment'),
    csv = require('csv-express'),
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
        const { redirect_url } = req.query;
        const { name, email, password } = req.body,
            emailUser = await Admin.findOne({ email }),
            errors = validationResult(req);
        let render_view = 'admin/register';
        let redirect_url_fail = '/administrador/registro',
            redirect_url_success = '/administrador/login',
            error_title = 'Registro de Administrador';
        if (redirect_url === 'administrador') {
            render_view = 'admin/create-admin';
            redirect_url_fail = '/administrador/crear-admin';
            error_title = 'Crear Administrador';
            redirect_url_success = '/administrador';
        }
        if (!errors.isEmpty()) {
            res.render(render_view, {
                title: error_title,
                errors: errors.array()
            });
        } else {
            console.log('REGISTRO -- sin errores');
            if (emailUser) {
                console.log('REGISTRO -- correo EXISTE');
                req.flash('error', '¡El email ya se ha utilizado!');
                res.redirect(redirect_url_fail);
            } else {
                console.log('REGISTRO -- correo NO EXISTE');
                const newAdmin = new Admin({ name, email });
                newAdmin.password = await newAdmin.encryptPassword(password);
                await newAdmin.save();
                req.flash('success', '¡Registro Completado!');
                res.redirect(redirect_url_success);
            }
        }
    }
);
//-- Vista dashboard
router.get('/administrador', isAuthenticated, async (req, res) => {
    const dateNow = moment().format('DD/MM/YYYY');
    const thisMonth = moment().format('/MM/YYYY');
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
//-- Crear Administrador
router.get('/administrador/crear-admin', isAuthenticated, (req, res) => {
    res.render('admin/create-admin', {
        title: 'Crear Administrador'
    });
});
//-- Cambiar contraseña de administrador
router.get(
    '/administrador/cambiar-password',
    isAuthenticated,
    async (req, res) => {
        const admins = await Admin.find();
        res.render('admin/change-password', {
            title: 'Cambiar Password',
            admins
        });
    }
);
//-- Cambiar password
router.post('/administrador/cambiar-password', async (req, res, next) => {
    const { password, confirmPassword, email } = req.body;
    console.log(password);
    console.log(confirmPassword);
    console.log(email);
    if (password !== confirmPassword) {
        // throw new Error('No coinciden las nuevas contraseñas');
        req.flash('error', `¡No se pudo actualizar el password de${email}!`);
        res.redirect('/administrador/cambiar-password');
    } else {
        // async find user
        const user = await Admin.findOne({ email });
        console.log(user);
        user.password = password;
        console.log(user.password);
        user.save(err => {
            if (err) {
                console.log(err);
                req.flash('error', err);
                res.redirect('/administrador/cambiar-password');
            } else {
                req.flash('success', `¡Password actualizado de ${email}!`);
                res.redirect('/administrador/cambiar-password');
            }
        });
    }
});
//-- Ver usuarios registrados
router.get('/administrador/usuarios', isAuthenticated, async (req, res) => {
    const users = await User.find();
    res.render('admin/view-users', {
        title: 'Usuarios Registrados',
        users
    });
});
router.get(
    '/administrador/exportar/usuarios',
    isAuthenticated,
    (req, res, next) => {
        const date = moment().format('DD_MM_YYYY');
        let dataArray;
        const filename = `usuarios_${date}.csv`;
        User.find()
            .lean()
            .exec({}, function(err, users) {
                if (err) res.send(err);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader(
                    'Content-Disposition',
                    `attachment; filename=${filename}`
                );
                res.csv(users, true);
            });
        // User.find((err, Users) => {
        //     if (err) res.send(err);
        //     res.status(200);
        //     res.setHeader('Content-Type', 'text/csv');
        //     res.setHeader(
        //         'Content-Disposition',
        //         `attachment; filename=${filename}`
        //     );
        //     res.csv(Users, true);
        // });
    }
);
//-- Cerrar Sesión
router.get('/administrador/logout', (req, res) => {
    req.logout();
    req.flash('success', '¡Sesión Cerrada!');
    res.redirect('/administrador/login');
});
//-- Registrar Usuario nuevo
router.post('/registrar/usuario', async (req, res) => {
    const {
        name,
        lastname,
        email,
        gender,
        base_grant_url,
        user_continue_url,
        node_id,
        node_mac,
        gateway_id,
        client_ip,
        client_mac
    } = req.body;
    const filter = { email };
    let birthday = moment(req.body.birthday).format('DD/MM/YYYY');
    const update = {
        name,
        birthday,
        lastname,
        email,
        gender,
        base_grant_url,
        user_continue_url,
        node_id,
        node_mac,
        gateway_id,
        client_ip,
        client_mac
    };
    const already = await User.findOne({ email });
    console.log(already);
    if (already) {
        const updated = await User.findOneAndUpdate(filter, update, {
            new: true
        });
        console.log(updated);
        req.flash('success', '¡Bienvenido de vuelta!');
        res.redirect(`/?from=${base_grant_url}&to=${user_continue_url}`);
    } else {
        const newUser = new User(update);
        await newUser.save();
        req.flash('success', '¡Gracias por registrarte!');
        res.redirect(`/?from=${base_grant_url}&to=${user_continue_url}`);
    }
});

module.exports = router;
