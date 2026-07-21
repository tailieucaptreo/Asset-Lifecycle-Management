// =======================================
// Date Utils
// =======================================

// Parse Date
function parseDate(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    // Date object
    if (value instanceof Date) {

        return isNaN(value.getTime())
            ? null
            : value;

    }

    // Excel Serial Number
    if (typeof value === "number") {

        const utcDays = Math.floor(value - 25569);

        const utcValue = utcDays * 86400;

        const date = new Date(utcValue * 1000);

        return isNaN(date.getTime())
            ? null
            : date;

    }

    // String
    if (typeof value === "string") {

        const text = value.trim();

        // dd/mm/yyyy
        const parts = text.split("/");

        if (parts.length === 3) {

            const [day, month, year] = parts;

            const date = new Date(

                Number(year),

                Number(month) - 1,

                Number(day)

            );

            return isNaN(date.getTime())
                ? null
                : date;

        }

        // yyyy-mm-dd
        const date = new Date(text);

        return isNaN(date.getTime())
            ? null
            : date;

    }

    return null;

}

// Compare Date
function sameDate(a, b) {

    const d1 = parseDate(a);

    const d2 = parseDate(b);

    if (!d1 && !d2) return true;

    if (!d1 || !d2) return false;

    return (

        d1.getFullYear() === d2.getFullYear() &&

        d1.getMonth() === d2.getMonth() &&

        d1.getDate() === d2.getDate()

    );

}

// Format yyyy-mm-dd
function formatDate(date) {

    const d = parseDate(date);

    if (!d) return "";

    return d.toISOString().split("T")[0];

}

// Calculate Expiry Date
function calculateExpiryDate(installDate, lifespan) {

    const date = parseDate(installDate);

    if (!date) return null;

    const expiry = new Date(date);

    expiry.setFullYear(

        expiry.getFullYear() +

        Number(lifespan || 0)

    );

    return expiry;

}

module.exports = {

    parseDate,

    sameDate,

    formatDate,

    calculateExpiryDate

};
