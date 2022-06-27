'use strict';
import {validation} from './validation.js';

(function () {

    /**
     * this function validate all field of form
     * @param password_one
     * @param password_two
     * @returns {*}
     */
    const validateForm = (password_one, password_two) => {

        password_one.value = password_one.value.trim();
        password_two.value = password_two.value.trim();

        // display all errors, force checking all fields
        let v1 = validation.validateInput(password_one, validation.isNotEmpty);
        let v2 = validation.validateInput(password_two, validation.isNotEmpty);

        let v = v1 && v2;
        if (v) {
            v = validation.validateInput(password_one, validation.isProperLength);
            v &= validation.validateInputDouble(password_one, password_two, validation.isEqual);
        }
        return v;
    }

    /**
     * add Event Listener after DOM Content Loaded
     */
    window.addEventListener('DOMContentLoaded', () => {
        const password_one = document.getElementById("pas_one");
        const password_two = document.getElementById("pas_two");

        document.getElementById("search").addEventListener('click', (event) => {
            event.preventDefault();
            if (validateForm(password_one, password_two)) {
                document.forms["needs-validation"].submit();
            }

        });
    });
})();