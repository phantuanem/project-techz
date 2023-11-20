document.addEventListener('DOMContentLoaded', function () {
    var btn_show_form_change_password = document.querySelector('#btn-show-form-change-password')
    var btn_close_form_change_password = document.querySelector('.btn-close-form-change-password')
    var btn_close_form_update_address = document.querySelector('button#btn-close-form-update-address')
    var btn_show_form_update_address = document.querySelector('button#btn-show-form-update-address')

    if (btn_show_form_change_password) {
        btn_show_form_change_password.onclick = () => {
            document.querySelector('.form-change-password').setAttribute('style', 'display: flex')
            btn_show_form_change_password.setAttribute('style', 'display: none')
        }

        btn_close_form_change_password.onclick = () => {
            document.querySelector('.form-change-password').setAttribute('style', 'display: none')
            btn_show_form_change_password.setAttribute('style', 'display: block')
        }
    }

    if (btn_close_form_update_address) {
        btn_close_form_update_address.onclick = () => {
            document.querySelector('.form-update-address').setAttribute('style', 'display: none')
            btn_show_form_update_address.setAttribute('style', 'display: block')
        }
        btn_show_form_update_address.onclick = () => {
            document.querySelector('.form-update-address').setAttribute('style', 'display: block')
            btn_show_form_update_address.setAttribute('style', 'display: none')
        }
    }
})