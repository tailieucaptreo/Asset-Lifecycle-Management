const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const normalize = require("../utils/normalize");

// ======================================
// Init Score
// ======================================

function createScoreBoard() {

    const board = {};

    for (const rule of RULES) {

        board[rule.category] = 0;

    }

    return board;

}

// ======================================
// Score By Model
// ======================================

function scoreModels(text, board) {

    for (const item of MODELS) {

        if (item.regex.test(text)) {

            board[item.category] += item.score;

        }

    }

}

// ======================================
// Score By Manufacturer
// ======================================

function scoreManufacturers(text, board) {

    let detectedBrand = "";

    for (const brand of MANUFACTURERS) {

        for (const alias of brand.aliases) {

            if (text.includes(normalize(alias))) {

                detectedBrand = brand.name;

                board[brand.category] += brand.score;

                break;

            }

        }

    }

    return detectedBrand;

}

// ======================================
// Score By Keyword
// ======================================

function scoreKeywords(text, board) {

    for (const rule of RULES) {

        for (const keyword of rule.keywords) {

            if (text.includes(normalize(keyword))) {

                board[rule.category] += rule.priority;

            }

        }

    }

}

// ======================================
// Best Category
// ======================================

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

// ======================================
// Main
// ======================================

function scoreCategory({

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

    ]

        .join(" ");

    text = normalize(text);

    const board =

        createScoreBoard();

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

        category:

            best.category,

        score:

            best.score,

        confidence:

            best.confidence,

        brand:

            brand ||

            detectedBrand ||

            "",

        board

    };

}

module.exports = {

    scoreCategory

};
