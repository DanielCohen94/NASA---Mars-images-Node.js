'use strict';
import {validation} from './validation.js';

(function () {

    /**
     * this function validate all field of form
     * @param email
     * @param firstName
     * @param lastName
     * @returns {*}
     */
    const validateForm = (email, firstName, lastName) => {

        email.value = email.value.trim();
        firstName.value = firstName.value.trim();
        lastName.value = lastName.value.trim();

        // display all errors, force checking all fields
        let v1 = validation.validateInput(email, validation.isNotEmpty) && validation.validateInput(email, validation.isEmail);
        let v2 = validation.validateInput(firstName, validation.isNotEmpty) && validation.validateInput(firstName, validation.onlyLetter);
        let v3 = validation.validateInput(lastName, validation.isNotEmpty) && validation.validateInput(lastName, validation.onlyLetter);

        return v1 && v2 && v3;
    }

    /**
     * add Event Listener after DOM Content Loaded
     */
    window.addEventListener('DOMContentLoaded', () => {

        let email = document.getElementById("email");
        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");

        document.getElementById("search").addEventListener('click', (event) => {
            event.preventDefault();

            email.value = email.value.toLowerCase();
            if (validateForm(email, firstName, lastName)) {
                fetch("api/email", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({email: email.value})
                }).then(res => res.json()).then(json => {
                    if (json > 0) {
                        email.nextElementSibling.innerHTML = 'This email is already exists';
                    } else {
                        document.forms["needs-validation"].submit();
                    }
                });
            }
        });

        document.getElementById("clear").addEventListener('click', () => {
            window.location.pathname = "api/confirmRegister";
        });

    });
})();