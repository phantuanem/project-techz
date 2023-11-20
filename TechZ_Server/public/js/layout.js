document.addEventListener('DOMContentLoaded', function () {
    var title_register = document.querySelector('.title-register-now')
    var title_login = document.querySelector('.title-login-now')
    var form_login = document.querySelectorAll('.form-login')
    var close_form_login = document.querySelector('#icon-close-form-login')
    var btn_search = document.querySelector('.icon-search')
    var a_cart = document.querySelector('#a-cart')

    if (title_register) {
        title_register.onclick = () => {
            form_login.forEach(form => {
                form.classList.toggle('form-login-hidden')
            })
        }
        title_login.onclick = () => {
            form_login.forEach(form => {
                form.classList.toggle('form-login-hidden')
            })
        }

        close_form_login.onclick = () => {
            document.querySelector('.container-form').classList.add('container-form-hidden')
        }

        document.querySelector('.icon-user').onclick = () => {
            document.querySelector('.container-form').classList.remove('container-form-hidden')
        }

        document.querySelector('#login').onclick = handleLogin
        document.querySelector('#register').onclick = handleRegister
    }

    btn_search.onclick = () => {
        if (document.querySelector('#input-search').value) {
            window.open('/search?search=' + document.querySelector('#input-search').value, '_self')
        }
    }

    document.querySelector('#input-search').addEventListener("keypress", function (event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            btn_search.click();
        }
    });

    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    if (searchParams.get('search')) {
        document.querySelector('#input-search').value = searchParams.get('search');
    }

    a_cart.onclick = (event) => {
        if (form_login.length > 0) {
            event.preventDefault()
            document.querySelector('.container-form').classList.remove('container-form-hidden')
        }
    }

})

var handleLogin = (e) => {
    e.preventDefault()
    let input_email = document.querySelector('#login-email').value
    let input_password = document.querySelector('#login-password').value
    if (input_email && input_password) {
        const data = { email: input_email, password: input_password };
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    location.reload()
                } else {
                    document.querySelector('.message-login-error').textContent = 'Sai email hoặc mật khẩu'
                    document.querySelector('.message-login-error').setAttribute('style', 'display: block')
                    setTimeout(() => {
                        document.querySelector('.message-login-error').textContent = ''
                        document.querySelector('.message-login-error').setAttribute('style', 'display: none')
                    }, 2000)
                }
            })
            .catch(error => {
                // Xử lý lỗi
            });
    }
}

var handleRegister = (e) => {
    e.preventDefault()
    let input_name = document.querySelector('#register-fullname').value
    let input_email = document.querySelector('#register-email').value
    let input_password = document.querySelector('#register-password').value
    if (input_name && input_email && input_password) {
        const data = { name: input_name, email: input_email, password: input_password };
        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    var form_login = document.querySelectorAll('.form-login')
                    form_login.forEach(form => {
                        form.classList.toggle('form-login-hidden')
                    })
                } else {
                    document.querySelector('.message-register-error').textContent = 'Đăng ký không thành công'
                    document.querySelector('.message-register-error').setAttribute('style', 'display: block')
                    setTimeout(() => {
                        document.querySelector('.message-register-error').textContent = ''
                        document.querySelector('.message-register-error').setAttribute('style', 'display: none')
                    }, 2000)
                }
            })
            .catch(error => {
                console.log(error)
            });
    } else {
        document.querySelector('.message-register-error').textContent = 'Bạn nhập không đủ thông tin'
        document.querySelector('.message-register-error').setAttribute('style', 'display: block')
        setTimeout(() => {
            document.querySelector('.message-register-error').textContent = ''
            document.querySelector('.message-register-error').setAttribute('style', 'display: none')
        }, 2000)
    }
}