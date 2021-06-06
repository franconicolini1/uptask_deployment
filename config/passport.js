const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Autenticación local.

const Usuarios = require('../models/Usuarios');
passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1
                    }
                });
                const usuarioNoActivo = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 0
                    }                   
                });
                if (usuarioNoActivo) return done(null, false, {
                    message: 'Verifique su cuenta primero'
                });

                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'Contraseña o e-mail Incorrecto'
                    });
                }

                return done(null, usuario);

            } catch (e) {
                return done(null, false, { // Error, usuario, mensaje.
                    message: 'Contraseña o e-mail Incorrecto',
                });
            }
        }
    )
);

// Serializar Usuario.
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar Usuario.
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

module.exports = passport;

