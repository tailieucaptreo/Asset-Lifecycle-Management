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
// =======================================
// Match Models
// =======================================

function matchModels(text) {

    const matches = [];

    for (const model of MODELS) {

        if (model.regex.test(text)) {

            matches.push({

                category: model.category,

                score: model.score,

                regex: model.regex.toString()

            });

        }

    }

    return matches;

}

// =======================================
// Match Manufacturers
// =======================================

function matchManufacturers(tokens) {

    const matches = [];

    for (const brand of MANUFACTURERS) {

        const hit = brand.aliases.some(alias => {

            return tokens.includes(normalize(alias));

        });

        if (hit) {

            matches.push({

                name: brand.name,

                defaultCategory: brand.defaultCategory

            });

        }

    }

    return matches;

}

// =======================================
// Match Keywords
// =======================================

function matchKeywords(text) {

    const matches = [];

    for (const rule of RULES) {

        for (const keyword of rule.keywords) {

            if (

                text.includes(

                    normalize(keyword.text)

                )

            ) {

                matches.push({

                    category: rule.category,

                    keyword: keyword.text,

                    weight: keyword.weight,

                    priority: rule.priority

                });

            }

        }

    }

    return matches;

}

// =======================================
// Match All
// =======================================

function match(data) {

    const prepared = prepare(data);

    return {

        text: prepared.text,

        tokens: prepared.tokens,

        models:

            matchModels(

                prepared.text

            ),

        manufacturers:

            matchManufacturers(

                prepared.tokens

            ),

        keywords:

            matchKeywords(

                prepared.text

            )

    };

}
