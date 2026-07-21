// =======================================
// Normalize
// =======================================

function normalize(value, defaultValue = "") {

    if (

        value === undefined ||

        value === null ||

        value === ""

    ) {

        return defaultValue;

    }

    return value
        .toString()
        .replace(/\r\n/g, " ")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

// =======================================
// Get Value
// =======================================

function get(row, ...keys) {

    for (const key of keys) {

        if (

            row[key] !== undefined &&

            row[key] !== null &&

            row[key] !== ""

        ) {

            return row[key];

        }

    }

    return null;

}

// =======================================
// Get Field
// =======================================

function getField(row, keys) {

    for (const key of Object.keys(row)) {

        const k = key
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

        if (

            keys.some(x => k.includes(x))

        ) {

            return row[key];

        }

    }

    return null;

}

// =======================================
// Validate Import
// =======================================

function validateRow(data) {

    const errors = [];

    if (!data.line) {

        errors.push("Thiếu Tuyến");

    }

    if (!data.code) {

        errors.push("Thiếu Ký hiệu");

    }

    if (!data.name) {

        errors.push("Thiếu Tên thiết bị");

    }

    return errors;

}

module.exports = {

    normalize,

    get,

    getField,

    validateRow

};
