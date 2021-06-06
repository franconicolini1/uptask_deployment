const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
}); 

const generarHTML = (archivo, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, options);
    return juice(html);
}

exports.enviar = async (options) => {
    const html = generarHTML(options.archivo, options);
    const text = htmlToText.htmlToText(html);

    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>', 
        to: options.usuario.email, 
        subject: options.subject, 
        text, 
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, transport); // Para que soporte async/await.
    return enviarEmail.call(transport, opcionesEmail);
}
