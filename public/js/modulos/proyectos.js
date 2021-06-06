import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.getElementById('eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: 'Desea borrar el proyecto?',
            text: "No podrá revertirlo!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Enviar petición a axios.
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, {params: {urlProyecto}})    
                    .then(function (res) {
                        Swal.fire(
                            'Borrado!',
                            `${res.data}`,
                            'success'
                        );
            
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 2000);
                    }).catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el proyecto.'
                        });
                    });
            }
        })
    }
)}

export default btnEliminar;