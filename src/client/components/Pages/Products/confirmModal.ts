import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.css'

const swalWithBootstrapButtons = Swal.mixin({
	customClass: {
		confirmButton: 'button',
		cancelButton: 'button button-outline',
	},
	buttonsStyling: false,
})

export const show = async () => {
	return await swalWithBootstrapButtons.fire({
		title: 'Are you sure?',
		text: 'The product will be removed from all storages.',
		confirmButtonText: 'Yes, delete it!',
		showCancelButton: true,
		icon: 'warning',
	})
}
