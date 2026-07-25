const { normalize } = require("../utils/normalize");

const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const ALIAS = require("../data/category.alias");

// =====================================
// Tokenize
// =====================================

function tokenize(text = "") {

    const normalized = normalize(text);

    const tokens = new Set();

    normalized
        .split(/[\s,;:/()]+/)
        .filter(Boolean)
        .forEach(token => {

            tokens.add(token);

            token
                .split(/[-_.]+/)
                .filter(Boolean)
                .forEach(part => tokens.add(part));

        });

    return [...tokens];

}

// =====================================
// Apply Alias
// =====================================

function applyAlias(value) {

    if (value == null) return "";

    const text = String(value);

    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// =====================================
// Detect Manufacturer
// =====================================

function detectBrand(text) {

    const normalized = normalize(text);

    for (const brand of MANUFACTURERS) {

        for (const alias of brand.aliases) {

            if (

                normalized.includes(

                    normalize(alias)

                )

            ) {

                return brand;

            }

        }

    }

    return null;

}

// =====================================
// Create Score Board
// =====================================

function createBoard() {

    const board = {};

    for (const rule of RULES) {

        board[rule.category] = 0;

    }

    board["Khác"] = 0;

    return board;

}

// =====================================
// Score Models (Ưu tiên cao nhất)
// =====================================

function scoreModels(text, board) {

    const tokens = tokenize(text);

    for (const token of tokens) {

        for (const model of MODELS) {

            model.regex.lastIndex = 0;

            if (model.regex.test(token)) {

                board[model.category] =
                    (board[model.category] || 0) +
                    model.score;

            }

        }

    }

}

// =====================================
// Score Manufacturers
// =====================================

function scoreManufacturers(text, board) {

    const detectedBrand = detectBrand(text);

    if (!detectedBrand) {

        return null;

    }

    board[detectedBrand.category] =
        (board[detectedBrand.category] || 0) +
        detectedBrand.score;

    return detectedBrand;

}

// =====================================
// Score Keywords
// =====================================

function scoreKeywords(text, board) {

    const normalizedText = normalize(text);

    const tokens = tokenize(normalizedText);

    for (const rule of RULES) {

        for (const keyword of rule.keywords) {

            const keywordText =
                normalize(keyword.text);

            let matched = false;

            // 1. Match cả chuỗi
            if (

                normalizedText.includes(

                    keywordText

                )

            ) {

                matched = true;

            }

            // 2. Match từng token
            else {

                matched = tokens.some(token =>

                    token === keywordText ||

                    token.startsWith(keywordText) ||

                    keywordText.startsWith(token)

                );

            }

            if (matched) {

                board[rule.category] =
                    (board[rule.category] || 0) +
                    keyword.weight;

            }

        }

    }

}

// =====================================
// Get Best Category
// =====================================

function getBest(board) {

    const ranking = Object.entries(board)

        .sort((a, b) => b[1] - a[1]);

    const [bestCategory, bestScore] =

        ranking[0] || ["Khác", 0];

    const secondScore =

        ranking[1]?.[1] || 0;

    if (bestScore <= 0) {

        return {

            category: "Khác",

            score: 0,

            confidence: 0

        };

    }

    const confidence = Math.min(

        100,

        Math.round(

            bestScore *

            100 /

            (bestScore + secondScore)

        )

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

    const originalText = [

        name,

        code,

        model,

        brand

    ]

        .filter(Boolean)

        .join(" ");

    const text = applyAlias(originalText);

    const board = createBoard();

    // 1. Model (ưu tiên cao nhất)
    scoreModels(

        text,

        board

    );

    // 2. Manufacturer
    const detectedBrand =

        scoreManufacturers(

            text,

            board

        );

    // 3. Keyword
    scoreKeywords(

        text,

        board

    );

    let result = getBest(board);

    // Áp dụng luật ưu tiên tuyệt đối
    result = overrideRules(
    
        result,
    
        text
    
    );
    
    return {
    
        category: result.category,
    
        brand:
    
            brand ||
    
            detectedBrand?.name ||
    
            "",
    
        score: result.score,
    
        confidence: result.confidence,
    
        board,
    
        debug: {
    
            text,
    
            tokens: tokenize(text)
    
        }
    
    };

}

// =====================================
// Override Rules
// Ưu tiên tuyệt đối theo Model
// =====================================

function overrideRules(result, text) {

    const tokens = tokenize(text);

    // ========= BIẾN TẦN =========

    if (

        tokens.some(token =>

            /^ACS/i.test(token) ||

            /^ACH/i.test(token) ||

            /^ACQ/i.test(token) ||

            /^DCS/i.test(token) ||

            /^NXA/i.test(token) ||

            /^NXB/i.test(token) ||

            /^NXI/i.test(token) ||

            /^NXS/i.test(token) ||

            /^NXP/i.test(token) ||

            /^VACON/i.test(token) ||

            /^FC51/i.test(token) ||

            /^FC102/i.test(token) ||

            /^FC202/i.test(token) ||

            /^FC302/i.test(token) ||

            /^ATV/i.test(token) ||

            /^MOVIDRIVE/i.test(token) ||

            /^MOVITRAC/i.test(token)

        )

    ) {

        result.category = "Biến tần";

        result.confidence = 100;

    }

    // ========= PLC =========

    if (

        tokens.some(token =>

            /^PSS/i.test(token) ||

            /^PSSU/i.test(token) ||

            /^TM221/i.test(token) ||

            /^TM241/i.test(token) ||

            /^CPU/i.test(token) ||

            /^S7/i.test(token)

        )

    ) {

        result.category = "PLC";

        result.confidence = 100;

    }

    // ========= SAFETY =========

    if (

        tokens.some(token =>

            /^PNOZ/i.test(token) ||

            /^PSEN/i.test(token)

        )

    ) {

        result.category = "An toàn";

        result.confidence = 100;

    }

    // ========= BECKHOFF =========

    if (

        tokens.some(token =>

            /^EL\d+/i.test(token) ||

            /^EK\d+/i.test(token) ||

            /^BK\d+/i.test(token) ||

            /^KL\d+/i.test(token) ||

            /^CX\d+/i.test(token)

        )

    ) {

        result.category = "BECKHOFF";

        result.confidence = 100;

    }

    // ========= NGUỒN =========

    if (

        tokens.some(token =>

            /^QUINT/i.test(token) ||

            /^UNO/i.test(token) ||

            /^TRIO/i.test(token)

        )

    ) {

        result.category = "Nguồn";

        result.confidence = 100;

    }

    return result;

}

// =====================================
// Detect Many
// =====================================

function detectMany(rows = []) {

    return rows.map(row => ({

        ...row,

        categoryInfo: detectCategory({

            name: row.name,

            code: row.code,

            model: row.model,

            brand: row.brand

        })

    }));

}

// =====================================
// Export
// =====================================

module.exports = {

    detectCategory,

    detectMany

};
