const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const normalize = require("../utils/normalize");

// ======================================
// Constant Score
// ======================================

const BRAND_SCORE = 20;

// ======================================
// Init Score Board
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

        if (!item.regex.test(text)) continue;

        if (board[item.category] === undefined) {

            board[item.category] = 0;

        }

        board[item.category] += item.score;

    }

}

// ======================================
// Score By Manufacturer
// ======================================

function scoreManufacturers(text, board) {

    let detectedBrand = "";

    for (const brand of MANUFACTURERS) {

        const hit = brand.aliases.some(alias =>

            text.includes(normalize(alias))

        );

        if (!hit) continue;

        detectedBrand = brand.name;

        if (brand.defaultCategory) {

            if (board[brand.defaultCategory] === undefined) {

                board[brand.defaultCategory] = 0;

            }

            board[brand.defaultCategory] += BRAND_SCORE;

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

            // keyword = { text, weight }

            if (

                text.includes(

                    normalize(keyword.text)

                )

            ) {

                if (board[rule.category] === undefined) {

                    board[rule.category] = 0;

                }

                board[rule.category] += keyword.weight;

            }

        }

    }

}

// ======================================
// Get Best Category
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

                (bestScore * 100) /

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

    ].join(" ");

    text = normalize(text);

    const board = createScoreBoard();

    scoreModels(text, board);

    const detectedBrand = scoreManufacturers(

        text,

        board

    );

    scoreKeywords(

        text,

        board

    );

    const best = getBest(board);

    return {

        category: best.category,

        score: best.score,

        confidence: best.confidence,

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
