
const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};
const isValidBody = function (data) {
    if (Object.keys(data).length > 0) {
        return true;
    }
    return false;

};

const isValidPassword = function (value) {
    if (!/^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{10,16}$/.test(value)) {

        return false;
    }
    return true;
};

const isValidEmail = function (value) {
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)) {

        return false;
    }
    return true;
};
const isValidmob = function (value) {
    if (!/^(\d{3})[- ]?(\d{3})[- ]?(\d{4})$/.test(value)) {

        return false;
    }
    return true;
};

module.exports = {
    isValid,
    isValidBody,
    isValidPassword,
    isValidEmail,
    isValidmob
}