/**
 * A model of validations
 * @type {{formatDate: (function(*=): {isValid, message: string}),
 * onlyLetter: (function(*=): {isValid: boolean, message: string}),
 * validateInput: (function(*=, *): boolean|*),
 * validateInputDouble: (function(*, *=, *): boolean|*),
 * isEqual: (function(*, *): {isValid: boolean, message: string}),
 * isProperLength: (function(*): {isValid: boolean, message: string}),
 * isEmail: (function(*=): {isValid: boolean, message: string}),
 * manageError: (function(*, *): boolean|(() => boolean)|*),
 * isNotEmpty: (function(*): {isValid: *, message: string}),
 * isEarthDate: (function(*=): boolean)}}
 */
const validation = (() => {
    /**
     *
     * @param str-any input
     * @returns {{isValid, message: string}}
     */
    const isNotEmpty = (str) => {
        return {
            isValid: (str.length),
            message: 'Input is required'
        };
    }
    /**
     * Checks if the two strings are equal to each other
     * @param str1
     * @param str2
     * @returns {{isValid: boolean, message: string}}
     */
    const isEqual = (str1,str2) => {
        return {
            isValid: (str1 === str2),
            message: 'Please enter equal values'
        };
    }
    /**
     * Checking the length of a string
     * @param str1
     * @returns {{isValid: boolean, message: string}}
     */
    const isProperLength = (str1) => {
        return {
            isValid: (str1.length > 7),
            message: 'Please enter a password with at least eight characters'
        };
    }
    /**
     * Checks if the string contains only letters
     * @param str
     * @returns {{isValid: boolean, message: string}}
     */
    const onlyLetter = (str) => {
        return {
            isValid: /^[a-z]+$/i.test(str),
            message: 'Only letters allowed'
        };
    }
    /**
     * Checks if the string is in the form of an email
     * @param str - email
     * @returns {{isValid: boolean, message: string}}
     */
    const isEmail = (str) => {
        return {
            isValid: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(str),
            message: 'Please enter a valid email address'
        };
    }
    /**
     * check if the date is in format of earth date
     * @param str- date
     * @returns {boolean}
     */
    const isEarthDate = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);
    /**
     * check if the date is correct
     * @param str-date
     * @returns {{isValid: boolean, message: string}}
     */
    const formatDate = (str) => {
        return {
            isValid: (isEarthDate(str)) ? !isNaN(new Date(str).getTime()) :
                !isNaN(str) && !(str.indexOf('.')!== -1),
            message: 'Please enter a SOL number or valid date'
        }
    }
    /**
     * Check if the date matches the times of the mission
     * @param date
     * @param min-min date of mission
     * @param max-max date of mission
     * @returns {{isValid: boolean, message: string}}
     */
    const validRange = (date, min, max) => {
        const SolDate = validation.isEarthDate(date);
        const _date = SolDate ? new Date(date).getTime() : date;
        const _min = SolDate ? new Date(min).getTime() : min;
        const _max = SolDate ? new Date(max).getTime() : max;

        let valid = true, show = '', range = '';

        if (_date < _min) {
            valid = false;
            show = min;
            range = 'after';
        } else if (_date > _max) {
            valid = false;
            show = max;
            range = 'before';
        }
        return {
            isValid: valid,
            message: `Please enter a date ${range} ${show}`
        }
    }
    /**
     *
     * @param inputElement- element within which we will chain the error if necessary
     * @param result - object:Boolean and string to inserting in case of error
     * @returns {boolean|*}
     */
    const manageError = (inputElement, result) => {
        inputElement.nextElementSibling.innerHTML = result.isValid ? '' : result.message;
        result.isValid ? inputElement.classList.remove('is-invalid') : inputElement.classList.add('is-invalid');
        return result.isValid;
    }
    /**
     * valid a single element by the validateFunc
     * @param inputElement - date/rover/camera
     * @param validateFunc - function to activate
     * @returns {*}
     */
    const validateInput = (inputElement, validateFunc) => {
        return manageError(inputElement, validateFunc(inputElement.value));
    }

    /**
     * takes two element and check the range by the validateFunc
     * @param firstElement -the Rover Element
     * @param secondElement -the Date Element
     * @param validateFunc -function to activate
     * @returns {*}
     */
    const validateInputDouble = (firstElement, secondElement, validateFunc) => {
        return manageError(secondElement,validateFunc(firstElement.value, secondElement.value));
    }

    return{
        isNotEmpty:isNotEmpty,
        manageError:manageError,
        validateInput:validateInput,
        validateInputDouble:validateInputDouble,
        isEqual:isEqual,
        onlyLetter:onlyLetter,
        isEmail:isEmail,
        formatDate:formatDate,
        isEarthDate:isEarthDate,
        isProperLength:isProperLength,
        validRange:validRange
    }

})();

export {validation};