const normalize = require("../utils/normalize");
const RULES = require("../data/category.rules");
const ALIAS = require("../data/category.alias");
const MANUFACTURERS = require("../data/manufacturers");

// =============================
// Apply Alias
// =============================
function applyAlias(text) {

    let result = text;

    for (const [from, to] of Object.entries(ALIAS)) {

        result = result.replaceAll(
            normalize(from),
            normalize(to)
        );

    }

    return result;

}

// =============================
// Detect Manufacturer
// =============================
function detectBrand(text) {

    for (const brand of MANUFACTURERS) {

        if (text.includes(normalize(brand))) {

            return brand;

        }

    }

    return "";

}

// =============================
// Score Rule
// =============================
function scoreRules(text) {

    const scores = {};

    for (const rule of RULES) {

        scores[rule.category] = 0;

    }

    for (const rule of RULES) {

        let score = 0;

        for (const keyword of rule.keywords) {

            if (text.includes(normalize(keyword))) {

                score += rule.priority;

            }

        }

        scores[rule.category] += score;

    }

    return scores;

}

// =============================
// Highest Score
// =============================
function getBest(scores) {

    let bestCategory = "Khác";

    let bestScore = 0;

    let secondScore = 0;

    for (const [category, score] of Object.entries(scores)) {

        if (score > bestScore) {

            secondScore = bestScore;

            bestScore = score;

            bestCategory = category;

        }

        else if (score > secondScore) {

            secondScore = score;

        }

    }

    const confidence =

        bestScore === 0

            ? 0

            : Math.round(

                (bestScore /

                    (bestScore + secondScore)

                ) * 100

            );

    return {

        category: bestCategory,

        score: bestScore,

        confidence

    };

}

// =============================
// Detect Category
// =============================
function detectCategory({

    name = "",

    code = "",

    model = "",

    brand = ""

}) {

    let text = [

        name,

        code,

        model,

        brand

    ].join(" ");

    text = normalize(text);

    text = applyAlias(text);

    const detectedBrand =

        detectBrand(text);

    const scores =

        scoreRules(text);

    const best =

        getBest(scores);

    return {

        category: best.category,

        brand:

            brand ||

            detectedBrand ||

            "",

        score: best.score,

        confidence: best.confidence

    };

}

module.exports = {

    detectCategory

};
