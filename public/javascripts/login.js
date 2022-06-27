'use strict';
import {validation} from './validation.js';


(function () {
    /**
     * this function validate all field of form
     * @param email
     * @param password
     * @returns {*}
     */
    const validateForm = (email, password) => {

        email.value = email.value.trim();
        password.value = password.value.trim();

        // display all errors, force checking all fields
        let v1 = validation.validateInput(email, validation.isNotEmpty) &&
            validation.validateInput(email, validation.isEmail);
        let v2 = validation.validateInput(password, validation.isNotEmpty);

        return v1 && v2;
    }

    /**
     * add Event Listener after DOM Content Loaded
     */
    window.addEventListener('DOMContentLoaded', () => {

        let email = document.getElementById("email");
        const password = document.getElementById("password");

        document.getElementById("search").addEventListener('click', (event) => {
            event.preventDefault();
            email.value = email.value.toLowerCase();
            if (validateForm(email, password)) {
                fetch("api/email", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email: email.value})
                }).then(res => res.json()).then(json => {
                    if (json) {
                        document.forms["needs-validation"].submit();
                    } else {
                        email.nextElementSibling.innerHTML = 'This email does not exist';
                    }
                });
            }
        });

        document.getElementById("register").addEventListener('click', () => {
            window.location.pathname = "/register";
        });

    });
})();