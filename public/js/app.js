import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import layout from './modulos/layout';
import {actualizarAvance} from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => { // Cada vez que carga la pagina.
    actualizarAvance();
})
