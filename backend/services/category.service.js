const normalize = require("../utils/normalize");

const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const ALIAS = require("../data/category.alias");

// =====================================
// Apply Alias
// =====================================

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

// =====================================
// Detect Brand
// =====================================

function detectBrand(text) {

    for (const brand of MANUFACTURERS) {

        for (const alias of brand.aliases) {

            if (text.includes(normalize(alias))) {

                return brand;

            }

        }

    }

    return null;

}

// =====================================
// Init Score
// =====================================

function createBoard() {

    const board = {};

    for (const rule of RULES) {

        board[rule.category] = 0;

    }

    return board;

}

// =====================================
// Score Model
// =====================================

function scoreModels(text, board) {

    for (const model of MODELS) {

        if (model.regex.test(text)) {

            board[model.category] += model.score;

        }

    }

}

// =====================================
// Score Manufacturer
// =====================================

function scoreManufacturers(text, board) {

    const brand = detectBrand(text);

    if (brand) {

        board[brand.category] += brand.score;

    }

    return brand;

}

// =====================================
// Score Keywords
// =====================================

function scoreKeywords(text, board) {

    for (const rule of RULES) {

        for (const keyword of rule.keywords) {

            if (

                text.includes(

                    normalize(keyword.text)

                )

            ) {

                board[rule.category] += keyword.weight;

            }

        }

    }

}

// =====================================
// Get Best
// =====================================

function getBest(board) {

    let bestCategory = "Khác";

    let bestScore = 0;

    let secondScore = 0;

    for (const [category, score] of Object.entries(board)) {

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

                bestScore *

                100 /

                (bestScore + secondScore)

            );

    return {

        category: bestCategory,

        score: bestScore,

        confidence

    };

}

// =====================================
// Detect Category
// =====================================

function detectCategory({

    name = "",

    code = "",

    model = "",

    brand = ""

} = {}) {

    let text = [

        name,

        code,

        model,

        brand

    ].join(" ");

    text = normalize(text);

    text = applyAlias(text);

    const board = createBoard();

    scoreModels(

        text,

        board

    );

    const detectedBrand =

        scoreManufacturers(

            text,

            board

        );

    scoreKeywords(

        text,

        board

    );

    const best =

        getBest(board);

    return {

        category: best.category,

        brand:

            brand ||

            detectedBrand?.name ||

            "",

        score: best.score,

        confidence: best.confidence,

        board

    };

}

// =====================================
// Detect Many
// =====================================

function detectMany(rows = []) {

    return rows.map(row => ({

        ...row,

        categoryInfo:

            detectCategory({

                name: row.name,

                code: row.code,

                model: row.model,

                brand: row.brand

            })

    }));

}

module.exports = {

    detectCategory,

    detectMany

};
