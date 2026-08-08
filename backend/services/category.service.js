const { normalize } = require("../utils/normalize");

const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const ALIAS = require("../data/category.alias");

// =======================================
// CONFIG
// =======================================

const OTHER_CATEGORY = "Khác";

// Điểm cho manufacturer.
// Model cụ thể vẫn có ưu tiên cao hơn.
const BRAND_SCORE = 45;

// Model có score từ mức này trở lên
// được xem là nhận diện chắc chắn.
const MODEL_CONFIDENCE_THRESHOLD = 90;


// =======================================
// Normalize Text
// =======================================

function normalizeText(value = "") {

    return normalize(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

}


// =======================================
// Escape RegExp
// =======================================

function escapeRegExp(value = "") {

    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}


// =======================================
// Match Phrase
// =======================================

function hasPhrase(text, phrase) {

    const normalizedText =
        normalizeText(text);

    const normalizedPhrase =
        normalizeText(phrase);

    if (
        !normalizedText ||
        !normalizedPhrase
    ) {

        return false;

    }

    const pattern = new RegExp(

        `(?:^|[^a-z0-9])` +
        `${escapeRegExp(normalizedPhrase)}` +
        `(?:$|[^a-z0-9])`,

        "i"

    );

    return pattern.test(normalizedText);

}


// =======================================
// Tokenize
// =======================================

function tokenize(text = "") {

    const normalized =
        normalizeText(text);

    const tokens =
        new Set();

    normalized

        .split(/[\s,;:/()[\]{}]+/)

        .filter(Boolean)

        .forEach(token => {

            // Giữ nguyên mã:
            // ACS580
            // S7-1200
            // PNOZ
            // EK1100

            tokens.add(token);

            // Đồng thời tách thêm:
            // S7-1200 -> S7 + 1200
            // ACS-580 -> ACS + 580

            token

                .split(/[-_.]+/)

                .filter(Boolean)

                .forEach(part => {

                    tokens.add(part);

                });

        });

    return [...tokens];

}


// =======================================
// Apply Alias
//
// Alias chỉ dùng cho keyword.
// Không dùng alias để match model.
// =======================================

function applyAlias(text = "") {

    let output =
        normalizeText(text);

    const aliases =
        Object.entries(ALIAS)

            // Alias dài xử lý trước
            .sort(
                (a, b) =>
                    b[0].length -
                    a[0].length
            );

    for (const [from, to] of aliases) {

        const source =
            normalizeText(from);

        const target =
            normalizeText(to);

        if (
            !source ||
            !target
        ) {

            continue;

        }

        const pattern =
            new RegExp(

                `(?:^|[^a-z0-9])` +
                `${escapeRegExp(source)}` +
                `(?=$|[^a-z0-9])`,

                "gi"

            );

        output =
            output.replace(
                pattern,
                match => {

                    const leading =
                        /^[^a-z0-9]/i.test(match)
                            ? match[0]
                            : "";

                    return (
                        leading +
                        target
                    );

                }
            );

    }

    return output

        .replace(/\s+/g, " ")

        .trim();

}


// =======================================
// Build Text
// =======================================

function buildText({

    name = "",
    code = "",
    model = "",
    brand = ""

} = {}) {

    return normalizeText(

        [

            name,
            code,
            model,
            brand

        ]

            .filter(Boolean)

            .join(" ")

    );

}


// =======================================
// Detect Manufacturers
// =======================================

function detectBrands(text) {

    const matches = [];

    for (
        const brand
        of MANUFACTURERS
    ) {

        const aliases =
            Array.isArray(
                brand.aliases
            )
                ? brand.aliases
                : [];

        const sortedAliases =
            aliases.slice().sort(

                (a, b) =>
                    String(b).length -
                    String(a).length

            );

        const matchedAlias =
            sortedAliases.find(

                alias =>
                    hasPhrase(
                        text,
                        alias
                    )

            );

        if (!matchedAlias) {

            continue;

        }

        let category =
            brand.defaultCategory ||
            "";

        // BECKHOFF là category riêng
        // dù manufacturers.js hiện đặt
        // defaultCategory = PLC

        if (
            normalizeText(
                brand.name
            ) === "beckhoff"
        ) {

            category = "BECKHOFF";

        }

        matches.push({

            name:
                brand.name,

            defaultCategory:
                category,

            alias:
                matchedAlias

        });

    }

    return matches;

}


// =======================================
// Create Score Board
// =======================================

function createBoard() {

    const board = {};

    for (
        const rule
        of RULES
    ) {

        if (
            !(rule.category in board)
        ) {

            board[rule.category] = 0;

        }

    }

    board[OTHER_CATEGORY] = 0;

    return board;

}


// =======================================
// Match Models
// =======================================

function matchModels(text) {

    const tokens =
        tokenize(text);

    const matches = [];

    for (
        const model
        of MODELS
    ) {

        if (
            !model ||
            !model.regex
        ) {

            continue;

        }

        let matched = false;

        let matchedToken = "";

        for (
            const token
            of tokens
        ) {

            if (
                model.regex.global ||
                model.regex.sticky
            ) {

                model.regex.lastIndex = 0;

            }

            if (
                model.regex.test(token)
            ) {

                matched = true;

                matchedToken =
                    token;

                break;

            }

        }

        if (matched) {

            matches.push({

                category:
                    model.category,

                score:
                    Number(model.score) || 0,

                token:
                    matchedToken,

                regex:
                    model.regex.toString()

            });

        }

    }

    return matches.sort(

        (a, b) =>
            b.score -
            a.score

    );

}


// =======================================
// Score Models
// =======================================

function scoreModels(
    matches,
    board
) {

    for (
        const match
        of matches
    ) {

        board[match.category] =

            (board[match.category] || 0) +

            match.score;

    }

}


// =======================================
// Score Manufacturers
// =======================================

function scoreManufacturers(
    matches,
    board
) {

    for (
        const brand
        of matches
    ) {

        if (
            !brand.defaultCategory
        ) {

            continue;

        }

        board[
            brand.defaultCategory
        ] =

            (
                board[
                    brand.defaultCategory
                ] || 0
            ) +

            BRAND_SCORE;

    }

}


// =======================================
// Match Keywords
// =======================================

function matchKeywords(text) {

    const normalized =
        normalizeText(text);

    // Áp dụng category.alias.js
    const aliased =
        applyAlias(normalized);

    const matches = [];

    for (
        const rule
        of RULES
    ) {

        for (
            const keyword
            of (
                rule.keywords || []
            )
        ) {

            const keywordText =
                normalizeText(
                    keyword.text
                );

            if (!keywordText) {

                continue;

            }

            if (
                hasPhrase(
                    aliased,
                    keywordText
                )
            ) {

                matches.push({

                    category:
                        rule.category,

                    keyword:
                        keyword.text,

                    weight:
                        Number(
                            keyword.weight
                        ) || 0,

                    priority:
                        Number(
                            rule.priority
                        ) || 0

                });

            }

        }

    }

    return matches;

}


// =======================================
// Score Keywords
// =======================================

function scoreKeywords(
    matches,
    board
) {

    for (
        const match
        of matches
    ) {

        board[match.category] =

            (
                board[match.category] || 0
            ) +

            match.weight;

    }

}


// =======================================
// Get Best Category
// =======================================

function getBest(
    board,
    modelMatches = []
) {

    const ranking =

        Object.entries(board)

            .filter(
                ([category]) =>
                    category !==
                    OTHER_CATEGORY
            )

            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    // Không có bằng chứng
    if (
        !ranking.length ||
        ranking[0][1] <= 0
    ) {

        return {

            category:
                OTHER_CATEGORY,

            score: 0,

            confidence: 0

        };

    }


    const [
        bestCategory,
        bestScore
    ] = ranking[0];


    const secondScore =
        ranking[1]?.[1] || 0;


    // ===================================
    // MODEL ƯU TIÊN CAO NHẤT
    // ===================================

    if (
        modelMatches.length > 0
    ) {

        const bestModel =
            modelMatches[0];

        if (
            bestModel.score >=
            MODEL_CONFIDENCE_THRESHOLD
        ) {

            return {

                category:
                    bestModel.category,

                score:
                    board[
                        bestModel.category
                    ] ||
                    bestModel.score,

                confidence:
                    100

            };

        }

    }


    // ===================================
    // Confidence
    // ===================================

    const confidence =

        bestScore === 0

            ? 0

            : Math.min(

                100,

                Math.round(

                    bestScore *
                    100 /

                    (
                        bestScore +
                        secondScore
                    )

                )

            );


    return {

        category:
            bestCategory,

        score:
            bestScore,

        confidence

    };

}


// =======================================
// Detect Category
// =======================================

function detectCategory({

    name = "",
    code = "",
    model = "",
    brand = ""

} = {}) {

    // -----------------------------------
    // Text gốc đã normalize
    // -----------------------------------

    const text =
        buildText({

            name,
            code,
            model,
            brand

        });


    // -----------------------------------
    // Score Board
    // -----------------------------------

    const board =
        createBoard();


    // -----------------------------------
    // 1. MODEL
    // -----------------------------------

    const modelMatches =
        matchModels(text);

    scoreModels(
        modelMatches,
        board
    );


    // -----------------------------------
    // 2. MANUFACTURER
    // -----------------------------------

    const manufacturerMatches =
        detectBrands(text);

    scoreManufacturers(
        manufacturerMatches,
        board
    );


    // -----------------------------------
    // 3. KEYWORD + ALIAS
    // -----------------------------------

    const keywordMatches =
        matchKeywords(text);

    scoreKeywords(
        keywordMatches,
        board
    );


    // -----------------------------------
    // BEST CATEGORY
    // -----------------------------------

    const best =
        getBest(

            board,

            modelMatches

        );


    // -----------------------------------
    // BRAND
    // -----------------------------------

    const detectedBrand =

        manufacturerMatches[0]?.name ||
        "";


    // -----------------------------------
    // RESULT
    // -----------------------------------

    return {

        category:
            best.category,

        brand:

            brand ||
            detectedBrand ||
            "",

        score:
            best.score,

        confidence:
            best.confidence,

        board,

        matched: {

            models:
                modelMatches,

            manufacturers:
                manufacturerMatches,

            keywords:
                keywordMatches

        },

        debug: {

            text,

            aliasText:
                applyAlias(text),

            tokens:
                tokenize(text)

        }

    };

}


// =======================================
// Detect Many
// =======================================

function detectMany(
    rows = []
) {

    return rows.map(row => ({

        ...row,

        categoryInfo:
            detectCategory({

                name:
                    row.name,

                code:
                    row.code,

                model:
                    row.model,

                brand:
                    row.brand

            })

    }));

}


// =======================================
// EXPORT
// =======================================

module.exports = {

    detectCategory,

    detectMany,

    tokenize,

    applyAlias,

    matchModels,

    detectBrands,

    matchKeywords

};