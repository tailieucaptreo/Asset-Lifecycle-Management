// =======================================
// Model Library
// score càng cao càng chính xác
// =======================================

module.exports = [

    // ===================================
    // ABB
    // ===================================

    { regex: /^ACS150/i, category: "Biến tần", score: 120 },
    { regex: /^ACS310/i, category: "Biến tần", score: 120 },
    { regex: /^ACS355/i, category: "Biến tần", score: 120 },
    { regex: /^ACS550/i, category: "Biến tần", score: 120 },
    { regex: /^ACS580/i, category: "Biến tần", score: 120 },
    { regex: /^ACS800/i, category: "Biến tần", score: 120 },
    { regex: /^ACS880/i, category: "Biến tần", score: 120 },

    { regex: /^ACH550/i, category: "Biến tần", score: 120 },
    { regex: /^ACH580/i, category: "Biến tần", score: 120 },

    { regex: /^ACQ580/i, category: "Biến tần", score: 120 },

    { regex: /^DCS550/i, category: "Biến tần", score: 120 },
    { regex: /^DCS800/i, category: "Biến tần", score: 120 },

    // ===================================
    // VACON
    // ===================================

    { regex: /^NXA/i, category: "Biến tần", score: 120 },
    { regex: /^NXB/i, category: "Biến tần", score: 120 },
    { regex: /^NXI/i, category: "Biến tần", score: 120 },
    { regex: /^NXS/i, category: "Biến tần", score: 120 },
    { regex: /^NXP/i, category: "Biến tần", score: 120 },

    { regex: /^VACON100/i, category: "Biến tần", score: 120 },
    { regex: /^VACON20/i, category: "Biến tần", score: 120 },

    // ===================================
    // DANFOSS
    // ===================================

    { regex: /^FC51/i, category: "Biến tần", score: 120 },
    { regex: /^FC102/i, category: "Biến tần", score: 120 },
    { regex: /^FC202/i, category: "Biến tần", score: 120 },
    { regex: /^FC302/i, category: "Biến tần", score: 120 },

    // ===================================
    // SIEMENS PLC
    // ===================================

    { regex: /^S7-200/i, category: "PLC", score: 110 },
    { regex: /^S7-300/i, category: "PLC", score: 110 },
    { regex: /^S7-400/i, category: "PLC", score: 110 },
    { regex: /^S7-1200/i, category: "PLC", score: 110 },
    { regex: /^S7-1500/i, category: "PLC", score: 110 },

    { regex: /^CPU/i, category: "PLC", score: 100 },

    // ===================================
    // PILZ
    // ===================================

    { regex: /^PNOZ/i, category: "An toàn", score: 120 },
    { regex: /^PSS/i, category: "PLC", score: 120 },
    { regex: /^PSSU/i, category: "PLC", score: 120 },
    { regex: /^PSEN/i, category: "An toàn", score: 120 },

    // ===================================
    // BECKHOFF
    // ===================================

    { regex: /^EL\d{4}/i, category: "BECKHOFF", score: 120 },
    { regex: /^EK\d{4}/i, category: "BECKHOFF", score: 120 },
    { regex: /^BK\d{4}/i, category: "BECKHOFF", score: 120 },
    { regex: /^KL\d{4}/i, category: "BECKHOFF", score: 120 },
    { regex: /^CX\d+/i, category: "BECKHOFF", score: 120 },

    // ===================================
    // SCHNEIDER
    // ===================================

    { regex: /^ATV/i, category: "Biến tần", score: 110 },
    { regex: /^TM221/i, category: "PLC", score: 110 },
    { regex: /^TM241/i, category: "PLC", score: 110 },
    { regex: /^XB4/i, category: "Điện điều khiển", score: 90 },
    { regex: /^XB5/i, category: "Điện điều khiển", score: 90 },
    { regex: /^LC1/i, category: "Điện điều khiển", score: 90 },
    { regex: /^LRD/i, category: "Điện điều khiển", score: 90 },

    // ===================================
    // PHOENIX CONTACT
    // ===================================

    { regex: /^QUINT/i, category: "Nguồn", score: 110 },
    { regex: /^UNO/i, category: "Nguồn", score: 110 },
    { regex: /^TRIO/i, category: "Nguồn", score: 110 },
    { regex: /^MINI/i, category: "Nguồn", score: 110 },

    { regex: /^PLC/i, category: "Điện điều khiển", score: 80 },

    // ===================================
    // IFM
    // ===================================

    { regex: /^IG/i, category: "Cảm biến", score: 110 },
    { regex: /^IF/i, category: "Cảm biến", score: 110 },
    { regex: /^KI/i, category: "Cảm biến", score: 110 },
    { regex: /^PN/i, category: "Cảm biến", score: 110 },

    // ===================================
    // SICK
    // ===================================

    { regex: /^WL/i, category: "Cảm biến", score: 110 },
    { regex: /^WTB/i, category: "Cảm biến", score: 110 },
    { regex: /^DFS/i, category: "Cảm biến", score: 110 },
    { regex: /^CLV/i, category: "Cảm biến", score: 110 },

    // ===================================
    // SEW
    // ===================================

    { regex: /^DRN/i, category: "Động cơ", score: 110 },
    { regex: /^DRS/i, category: "Động cơ", score: 110 },
    { regex: /^MOVITRAC/i, category: "Biến tần", score: 110 },
    { regex: /^MOVIDRIVE/i, category: "Biến tần", score: 110 }

];
