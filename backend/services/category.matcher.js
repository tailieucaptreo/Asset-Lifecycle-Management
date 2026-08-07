const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const ALIAS = require("../data/category.alias");

const normalize = require("../utils/normalize");
const tokenize = require("../utils/tokenizer");

// =======================================
// Build Search Text
// =======================================

function buildText({

    name = "",

    code = "",

    model = "",

    brand = ""

}) {

    return normalize(

        [

            name,

            code,

            model,

            brand

        ].join(" ")

    );

}

// =======================================
// Apply Alias
// =======================================

function applyAlias(text) {

    let output = text;

    for (const [key, value] of Object.entries(ALIAS)) {

        output = output.replaceAll(

            normalize(key),

            normalize(value)

        );

    }

    return output;

}

// =======================================
// Prepare Text
// =======================================

function prepare(data) {

    let text = buildText(data);

    text = applyAlias(text);

    const tokens = tokenize(text);

    return {

        text,

        tokens

    };

}
