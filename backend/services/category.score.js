// =======================================
// Category Score Engine
// =======================================

function calculateScore({

    text,

    brand,

    model,

    rules

}) {

    const scores = {};

    for (const rule of rules) {

        let score = 0;

        // ==========================
        // Include Keywords
        // ==========================

        if (Array.isArray(rule.include)) {

            for (const keyword of rule.include) {

                if (text.includes(keyword)) {

                    score += rule.priority;

                }

            }

        }

        // ==========================
        // Exclude Keywords
        // ==========================

        if (Array.isArray(rule.exclude)) {

            for (const keyword of rule.exclude) {

                if (text.includes(keyword)) {

                    score = 0;

                    break;

                }

            }

        }

        // ==========================
        // Brand Bonus
        // ==========================

        if (

            brand &&

            Array.isArray(rule.brands)

        ) {

            if (

                rule.brands.some(

                    b =>

                    b.toLowerCase() ===

                    brand.toLowerCase()

                )

            ) {

                score += 30;

            }

        }

        // ==========================
        // Model Regex Bonus
        // ==========================

        if (

            model &&

            Array.isArray(rule.models)

        ) {

            for (const regex of rule.models) {

                if (regex.test(model)) {

                    score += 50;

                }

            }

        }

        scores[rule.category] = score;

    }

    return scores;

}

// =======================================
// Best Category
// =======================================

function getBestCategory(scores) {

    let best = {

        category: "Khác",

        score: 0

    };

    let second = 0;

    for (

        const [

            category,

            score

        ]

        of Object.entries(scores)

    ) {

        if (score > best.score) {

            second = best.score;

            best = {

                category,

                score

            };

        }

        else if (

            score > second

        ) {

            second = score;

        }

    }

    return {

        ...best,

        confidence:

            calculateConfidence(

                best.score,

                second

            )

    };

}

// =======================================
// Confidence
// =======================================

function calculateConfidence(

    best,

    second

) {

    if (

        best === 0

    ) {

        return 0;

    }

    if (

        second === 0

    ) {

        return 100;

    }

    return Math.round(

        best /

        (best + second)

        * 100

    );

}

// =======================================

module.exports = {

    calculateScore,

    getBestCategory,

    calculateConfidence

};
