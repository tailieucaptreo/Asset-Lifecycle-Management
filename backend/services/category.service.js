const { normalize } = require("../utils/normalize");

const MODELS = require("../data/models");
const MANUFACTURERS = require("../data/manufacturers");
const RULES = require("../data/category.rules");
const ALIAS = require("../data/category.alias");

// ============================================================
// CONFIG
// ============================================================

const OTHER_CATEGORY = "Khác";

// Điểm manufacturer
const BRAND_SCORE = 45;

// Model từ mức này trở lên được xem là nhận diện chắc chắn
const MODEL_CONFIDENCE_THRESHOLD = 90;

// Keyword mặc định nếu category.rules.js dùng string
const DEFAULT_KEYWORD_WEIGHT = 50;

// Điểm priority được cộng thêm
const PRIORITY_MULTIPLIER = 0.5;


// ============================================================
// Normalize Text
// ============================================================

function normalizeText(value = "") {

    return normalize(String(value))
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/\s+/g, " ")
        .trim();

}


// ============================================================
// Escape RegExp
// ============================================================

function escapeRegExp(value = "") {

    return String(value)
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

}


// ============================================================
// Match Phrase
// ============================================================

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

    /*
     * Với cụm từ có ký tự đặc biệt như:
     *
     * P10 EPE
     * PSS DI2
     * DDW-100
     * MCR-T/UI-E PT100
     *
     * không dùng boundary quá chặt.
     */

    if (
        normalizedText.includes(
            normalizedPhrase
        )
    ) {

        return true;

    }

    /*
     * Fallback regex cho từ/cụm từ
     */

    const pattern = new RegExp(

        `(?:^|[^a-z0-9])` +
        `${escapeRegExp(normalizedPhrase)}` +
        `(?:$|[^a-z0-9])`,

        "i"

    );

    return pattern.test(
        normalizedText
    );

}


// ============================================================
// Tokenize
// ============================================================

function tokenize(text = "") {

    const normalized =
        normalizeText(text);

    const tokens =
        new Set();

    normalized

        .split(/[\s,;:/()[\]{}]+/)

        .filter(Boolean)

        .forEach(token => {

            tokens.add(token);

            token

                .split(/[-_.]+/)

                .filter(Boolean)

                .forEach(part => {

                    tokens.add(part);

                });

        });

    return [...tokens];

}


// ============================================================
// Apply Alias
// ============================================================

function applyAlias(text = "") {

    let output =
        normalizeText(text);

    const aliases =
        Object.entries(ALIAS || {})
            .sort(
                (a, b) =>
                    String(b[0]).length -
                    String(a[0]).length
            );

    for (
        const [from, to]
        of aliases
    ) {

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

        if (
            output.includes(source)
        ) {

            const pattern =
                new RegExp(
                    escapeRegExp(source),
                    "gi"
                );

            output =
                output.replace(
                    pattern,
                    target
                );

        }

    }

    return output
        .replace(/\s+/g, " ")
        .trim();

}


// ============================================================
// Build Text
// ============================================================

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


// ============================================================
// Detect Manufacturers
// ============================================================

function detectBrands(text = "") {

    const matches = [];

    for (
        const brand
        of MANUFACTURERS || []
    ) {

        if (!brand) {

            continue;

        }

        const aliases =
            Array.isArray(
                brand.aliases
            )
                ? brand.aliases
                : [];

        const sortedAliases =
            aliases
                .slice()
                .sort(
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

        /*
         * BECKHOFF là category riêng.
         */

        if (
            normalizeText(
                brand.name
            ) === "beckhoff"
        ) {

            category =
                "BECKHOFF";

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


// ============================================================
// Create Score Board
// ============================================================

function createBoard() {

    const board = {};

    for (
        const rule
        of RULES || []
    ) {

        if (
            !rule ||
            !rule.category
        ) {

            continue;

        }

        if (
            !(rule.category in board)
        ) {

            board[rule.category] = 0;

        }

    }

    board[OTHER_CATEGORY] = 0;

    return board;

}


// ============================================================
// Match Models
// ============================================================

function matchModels(text) {

    const tokens =
        tokenize(text);

    const normalizedText =
        normalizeText(text);

    const matches = [];

    for (
        const model
        of MODELS || []
    ) {

        if (
            !model ||
            !model.regex
        ) {

            continue;

        }

        let matched = false;

        let matchedToken = "";

        /*
         * Ưu tiên kiểm tra toàn bộ text.
         */

        try {

            if (
                model.regex.global ||
                model.regex.sticky
            ) {

                model.regex.lastIndex = 0;

            }

            if (
                model.regex.test(
                    normalizedText
                )
            ) {

                matched = true;

                matchedToken =
                    normalizedText;

            }

        }

        catch {

            // bỏ qua regex lỗi
        }


        /*
         * Nếu chưa match toàn text,
         * kiểm tra từng token.
         */

        if (!matched) {

            for (
                const token
                of tokens
            ) {

                try {

                    if (
                        model.regex.global ||
                        model.regex.sticky
                    ) {

                        model.regex.lastIndex = 0;

                    }

                    if (
                        model.regex.test(
                            token
                        )
                    ) {

                        matched = true;

                        matchedToken =
                            token;

                        break;

                    }

                }

                catch {

                    continue;

                }

            }

        }


        if (matched) {

            matches.push({

                category:
                    model.category,

                score:
                    Number(
                        model.score
                    ) || 0,

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


// ============================================================
// Score Models
// ============================================================

function scoreModels(
    matches,
    board
) {

    for (
        const match
        of matches
    ) {

        if (
            !match.category
        ) {

            continue;

        }

        board[match.category] =

            (
                board[match.category] ||
                0
            ) +

            (
                Number(
                    match.score
                ) || 0
            );

    }

}


// ============================================================
// Score Manufacturers
// ============================================================

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


// ============================================================
// Normalize Keyword Definition
//
// Hỗ trợ:
//
// "plc"
//
// hoặc:
//
// {
//     text: "plc",
//     weight: 80
// }
//
// ============================================================

function normalizeKeyword(keyword) {

    // -------------------------------
    // String
    // -------------------------------

    if (
        typeof keyword === "string"
    ) {

        return {

            text:
                keyword,

            weight:
                DEFAULT_KEYWORD_WEIGHT

        };

    }


    // -------------------------------
    // Object
    // -------------------------------

    if (
        keyword &&
        typeof keyword === "object"
    ) {

        return {

            text:
                keyword.text ||
                keyword.keyword ||
                "",

            weight:
                Number(
                    keyword.weight
                ) ||
                DEFAULT_KEYWORD_WEIGHT

        };

    }


    return {

        text: "",

        weight: 0

    };

}


// ============================================================
// Match Keywords
// ============================================================

function matchKeywords(text) {

    const normalized =
        normalizeText(text);

    const aliased =
        applyAlias(normalized);

    const matches = [];

    for (
        const rule
        of RULES || []
    ) {

        if (
            !rule ||
            !rule.category
        ) {

            continue;

        }

        const priority =
            Number(
                rule.priority
            ) || 0;


        for (
            const rawKeyword
            of (
                rule.keywords || []
            )
        ) {

            const keyword =
                normalizeKeyword(
                    rawKeyword
                );

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

                /*
                 * Score thực tế:
                 *
                 * weight
                 * +
                 * priority
                 *
                 * Keyword cụ thể được ưu tiên.
                 */

                const score =

                    keyword.weight +

                    (
                        priority *
                        PRIORITY_MULTIPLIER
                    );


                matches.push({

                    category:
                        rule.category,

                    keyword:
                        keyword.text,

                    weight:
                        keyword.weight,

                    priority,

                    score

                });

            }

        }

    }

    return matches.sort(

        (a, b) =>
            b.score -
            a.score

    );

}


// ============================================================
// Score Keywords
// ============================================================

function scoreKeywords(
    matches,
    board
) {

    for (
        const match
        of matches
    ) {

        if (
            !match.category
        ) {

            continue;

        }

        board[match.category] =

            (
                board[
                    match.category
                ] || 0
            ) +

            (
                Number(
                    match.score
                ) || 0
            );

    }

}


// ============================================================
// Get Best Category
// ============================================================

function getBest(
    board,
    modelMatches = []
) {

    const ranking =

        Object.entries(board)

            .filter(
                ([category, score]) =>

                    category !==
                    OTHER_CATEGORY &&

                    Number(score) > 0
            )

            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    // -----------------------------------
    // Không có bằng chứng
    // -----------------------------------

    if (
        !ranking.length
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
    // MODEL ƯU TIÊN
    // ===================================

    if (
        modelMatches.length > 0
    ) {

        const bestModel =
            modelMatches[0];

        if (
            Number(
                bestModel.score
            ) >=
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

    let confidence = 0;

    if (
        bestScore > 0
    ) {

        confidence =
            Math.min(

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

    }


    return {

        category:
            bestCategory,

        score:
            bestScore,

        confidence

    };

}


// ============================================================
// Detect Category
// ============================================================

function detectCategory({

    name = "",
    code = "",
    model = "",
    brand = ""

} = {}) {

    // -----------------------------------
    // Build text
    // -----------------------------------

    const text =
        buildText({

            name,
            code,
            model,
            brand

        });


    // -----------------------------------
    // Score board
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
    // 3. KEYWORD
    // -----------------------------------

    const keywordMatches =
        matchKeywords(text);

    scoreKeywords(
        keywordMatches,
        board
    );


    // -----------------------------------
    // 4. BEST CATEGORY
    // -----------------------------------

    const best =
        getBest(

            board,

            modelMatches

        );


    // -----------------------------------
    // Detected brand
    // -----------------------------------

    const detectedBrand =

        manufacturerMatches[0]?.name ||
        "";


    // -----------------------------------
    // Result
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


// ============================================================
// Detect Many
// ============================================================

function detectMany(
    rows = []
) {

    return rows.map(row => {

        const categoryInfo =
            detectCategory({

                name:
                    row.name,

                code:
                    row.code,

                model:
                    row.model,

                brand:
                    row.brand

            });

        return {

            ...row,

            categoryInfo

        };

    });

}


// ============================================================
// EXPORT
// ============================================================

module.exports = {

    detectCategory,

    detectMany,

    tokenize,

    applyAlias,

    matchModels,

    detectBrands,

    matchKeywords

};