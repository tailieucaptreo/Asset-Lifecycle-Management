// =======================================
// Normalize text
// =======================================

function normalize(text = "") {

    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\r\n/g, " ")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/[_-]/g, " ")
        .replace(/[()]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

module.exports = normalize;
