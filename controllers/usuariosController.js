const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en UpTask'
    }); 
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;

    res.render('iniciarSesion', {
        nombrePagina: 'Iniciar Sesión en UpTask',
        error
    }); 
}

exports.crearCuenta = async (req, res) => {
    const {email, password} = req.body;

    try {
        await Usuarios.create({
            email,
            password
        });

        const confirmarURL = `http://${req.headers.host}/confirmar/${email}`;

        const usuario = {
            email
        }

        await enviarEmail.enviar({
            usuario,
            subject: 'Confirmar Cuenta de UpTask',
            confirmarURL,
            archivo: 'confirmarCuenta'
        });

        req.flash('contraseña-correcta', 'Enviamos un correo para confirmar la cuenta');
        res.redirect('/iniciar-sesion');
    } catch (e) {
        req.flash('error', e.errors.map(e => e.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask',
            email,
            password
        });
    }
}

exports.formRestablecerContraseña = (req, res) => {
    res.render('restablecer', {
        nombrePagina: 'Restablecer tu Contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    if (!usuario) {
        req.flash('error', 'Inválido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('contraseña-correcta', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}