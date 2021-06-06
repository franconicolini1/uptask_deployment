const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; // Operadores de Sequelize.
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

// Revisa que el Usuario ya este logueado.
exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion');
    });
}

exports.enviarToken = async (req, res) => {
    const {email} = req.body;
    const usuario = await Usuarios.findOne({where: {email}});

    if (!usuario) {
        req.flash('error', 'No existe esa cuenta o no esta confirmada');
        res.redirect('/restablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; // Una hora a partir del momento que lo pide.

    await usuario.save();

    const resetURL = `http://${req.headers.host}/restablecer/${usuario.token}`;

    await enviarEmail.enviar({
        usuario,
        subject: 'Restablecer Contraseña',
        resetURL,
        archivo: 'restablecerContraseña'
    });

    req.flash('contraseña-correcta', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    if (!usuario) {
        req.flash('error', 'Inválido');
        res.redirect('/restablecer');
    }

    res.render('resetContraseña', {
        nombrePagina: 'Restablecer Contraseña'
    });
}

exports.actualizarContraseña = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });

    if (!usuario) {
        req.flash('error', 'Inválido');
        res.redirect('/restablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('contraseña-correcta', 'Tu contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}