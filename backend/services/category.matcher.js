const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const normalize = require("../utils/normalize");

// =====================================
// Normalize Text
// =====================================

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

// =====================================
// Match Models
// =====================================

function matchModels(text) {

    const matches = [];

    for (const item of MODELS) {

        if (item.regex.test(text)) {

            matches.push(item);

        }

    }

    return matches;

}

// =====================================
// Match Manufacturers
// =====================================

function matchManufacturers(text) {

    const matches = [];

    for (const brand of MANUFACTURERS) {

        const hit =

            brand.aliases.some(alias =>

                text.includes(normalize(alias))

            );

        if (hit) {

            matches.push(brand);

        }

    }

    return matches;

}

// =====================================
// Match Keywords
// =====================================

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

                    category:

                        rule.category,

                    priority:

                        rule.priority,

                    ...keyword

                });

            }

        }

    }

    return matches;

}

// =====================================
// Match All
// =====================================

function match(data) {

    const text =

        buildText(data);

    return {

        text,

        models:

            matchModels(text),

        manufacturers:

            matchManufacturers(text),

        keywords:

            matchKeywords(text)

    };

}

module.exports = {

    buildText,

    matchModels,

    matchManufacturers,

    matchKeywords,

    match

};
