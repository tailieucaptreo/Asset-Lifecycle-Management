// =======================================
// Tokenizer
// Chuẩn hóa chuỗi thành tập token duy nhất
// =======================================

const normalize = require("./normalize");

function tokenize(text = "") {

    text = normalize(text);

    const tokens = new Set();

    // token theo khoảng trắng
    text.split(/\s+/)
        .filter(Boolean)
        .forEach(token => tokens.add(token));

    // token theo dấu -
    text.split("-")
        .filter(Boolean)
        .forEach(token => tokens.add(normalize(token)));

    // token theo /
    text.split("/")
        .filter(Boolean)
        .forEach(token => tokens.add(normalize(token)));

    return [...tokens];

}

module.exports = tokenize;
