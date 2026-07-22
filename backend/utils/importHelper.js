/* =====================================================
   Import Helper
===================================================== */

function clean(value) {

    if (value === undefined || value === null)
        return "";

    return String(value).trim();

}

function isEmpty(value) {

    const str = clean(value).toUpperCase();

    return (

        str === "" ||

        str === "-" ||

        str === "N/A" ||

        str === "NULL" ||

        str === "UNDEFINED"

    );

}

function text(value) {

    return isEmpty(value)

        ? ""

        : clean(value);

}

function nullableText(value) {

    return isEmpty(value)

        ? null

        : clean(value);

}

function number(value) {

    if (isEmpty(value))
        return 0;

    const num = Number(value);

    return Number.isNaN(num)

        ? 0

        : num;

}

function nullableNumber(value) {

    if (isEmpty(value))
        return null;

    const num = Number(value);

    return Number.isNaN(num)

        ? null

        : num;

}

function date(value) {

    if (isEmpty(value))
        return null;

    // Excel Date Number
    if (typeof value === "number") {

        const excelEpoch = new Date(1899, 11, 30);

        excelEpoch.setDate(
            excelEpoch.getDate() + value
        );

        return excelEpoch;

    }

    const d = new Date(value);

    return Number.isNaN(d.getTime())

        ? null

        : d;

}

function boolean(value) {

    if (typeof value === "boolean")
        return value;

    const str = clean(value).toLowerCase();

    return (

        str === "true" ||

        str === "yes" ||

        str === "1" ||

        str === "có"

    );

}

module.exports = {

    clean,

    isEmpty,

    text,

    nullableText,

    number,

    nullableNumber,

    date,

    boolean

};
