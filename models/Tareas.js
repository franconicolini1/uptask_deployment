const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');


const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(30),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

Tareas.belongsTo(Proyectos) // Digo que cada tarea pertenece a un proyecto.

module.exports = Tareas;