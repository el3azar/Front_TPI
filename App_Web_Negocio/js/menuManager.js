document.addEventListener("DOMContentLoaded", function () {
    // Seleccionar todos los botones de eliminar
    const deleteButtons = document.querySelectorAll('.btn-danger');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Mostrar SweetAlert2 para confirmar la eliminación
            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esta acción.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Buscar y eliminar la fila correspondiente
                    const row = this.closest('tr');
                    if (row) {
                        row.remove();
                    }

                    // Mostrar alerta de éxito
                    Swal.fire(
                        'Eliminado',
                        'El platillo ha sido eliminado exitosamente.',
                        'success'
                    );
                }
            });
        });
    });
});