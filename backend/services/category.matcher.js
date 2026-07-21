// =======================================
// Category Matcher
// =======================================

// -------------------------
// Match một keyword
// -------------------------
function matchKeyword(text, keyword) {

    if (!keyword) return false;

    return text.includes(
        keyword.toLowerCase()
    );

}

// -------------------------
// Match nhiều keyword
// -------------------------
function matchKeywords(text, keywords = []) {

    let matched = [];

    for (const keyword of keywords) {

        if (matchKeyword(text, keyword)) {

            matched.push(keyword);

        }

    }

    return matched;

}

// -------------------------
// Match Brand
// -------------------------
function matchBrand(brand = "", brands = []) {

    if (!brand) return false;

    return brands.some(item =>

        item.toLowerCase() ===

        brand.toLowerCase()

    );

}

// -------------------------
// Match Regex Model
// -------------------------
function matchModel(model = "", models = []) {

    if (!model) return false;

    for (const regex of models) {

        if (regex.test(model)) {

            return true;

        }

    }

    return false;

}

// -------------------------
// Match Exclude
// -------------------------
function matchExclude(text, excludes = []) {

    for (const keyword of excludes) {

        if (matchKeyword(text, keyword)) {

            return true;

        }

    }

    return false;

}

// -------------------------
// Match Rule
// -------------------------
function matchRule({

    text,

    brand,

    model,

    rule

}) {

    // Bị loại
    if (

        matchExclude(

            text,

            rule.exclude || []

        )

    ) {

        return {

            matched: false,

            score: 0,

            keywords: []

        };

    }

    let score = 0;

    let keywords = [];

    // Match keyword
    const matchedKeywords =

        matchKeywords(

            text,

            rule.include || []

        );

    keywords.push(

        ...matchedKeywords

    );

    score +=

        matchedKeywords.length *

        rule.priority;

    // Match Brand
    if (

        matchBrand(

            brand,

            rule.brands || []

        )

    ) {

        score += 30;

    }

    // Match Model
    if (

        matchModel(

            model,

            rule.models || []

        )

    ) {

        score += 50;

    }

    return {

        matched:

            score > 0,

        score,

        keywords

    };

}

module.exports = {

    matchKeyword,

    matchKeywords,

    matchBrand,

    matchModel,

    matchExclude,

    matchRule

};
