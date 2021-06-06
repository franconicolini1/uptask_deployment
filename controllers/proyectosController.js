const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: {usuarioId}});

    res.render('index', {
        nombrePagina: 'Proyectos',
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll();

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll();
    const nombre = req.body.nombre;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if (errores.length > 0 ) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos 
        });
    } else {
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({nombre, usuarioId})
        res.redirect('/');
    }
}

exports.proyectosPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    // Tareas
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        include: [
            {model: Proyectos}
        ]
    });


    if (!proyecto) return next(); // Caso en que no hay proyecto con esa url.

    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });

}

exports.formularioEditar = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: {usuarioId}});
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}

exports.actualizarProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll();
    const nombre = req.body.nombre;
    let errores = [];

    if (!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'});
    }

    if (errores.length > 0 ) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos 
        });
    } else {
        await Proyectos.update(
            {nombre},
            {where: {id: req.params.id}}
            );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    const {urlProyecto} = req.query; // query es lo mismo que params.
    const resultado = await Proyectos.destroy({where: {url: urlProyecto}});

    if (!resultado) {
        return next();
    }

    res.send('Proyecto Eliminado Correctamente');
}