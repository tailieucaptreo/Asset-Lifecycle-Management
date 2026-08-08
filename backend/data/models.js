// =======================================
// Device Model Rules
// Model / mã thiết bị có độ ưu tiên cao
// hơn keyword thông thường.
// =======================================

module.exports = [

    // =====================================================
    // PLC / PILZ
    // =====================================================

    {
        regex: /^PSS\b/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^PSSU\b/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^PSS[-_ ]/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^S7[-_ ]?\d+/i,
        category: "PLC",
        score: 130
    },

    {
        regex: /^CPU[-_ ]?\d+/i,
        category: "PLC",
        score: 110
    },

    {
        regex: /^PLC\b/i,
        category: "PLC",
        score: 130
    },


    // =====================================================
    // BECKHOFF
    // =====================================================

    {
        regex: /^EK\d+/i,
        category: "BECKHOFF",
        score: 120
    },

    {
        regex: /^EL\d+/i,
        category: "BECKHOFF",
        score: 120
    },

    {
        regex: /^KL\d+/i,
        category: "BECKHOFF",
        score: 120
    },

    {
        regex: /^BK\d+/i,
        category: "BECKHOFF",
        score: 120
    },

    {
        regex: /^CX\d+/i,
        category: "BECKHOFF",
        score: 130
    },


    // =====================================================
    // ABB DRIVE
    // =====================================================

    {
        regex: /^ACS\d+/i,
        category: "Biến tần",
        score: 150
    },

    {
        regex: /^ACS\d+[-_]/i,
        category: "Biến tần",
        score: 150
    },


    // =====================================================
    // VACON
    // =====================================================

    {
        regex: /^VACON\b/i,
        category: "Biến tần",
        score: 150
    },

    {
        regex: /^NX[A-Z]?\d+/i,
        category: "Biến tần",
        score: 150
    },

    {
        regex: /^NXI\d+/i,
        category: "Biến tần",
        score: 150
    },


    // =====================================================
    // DANFOSS
    // =====================================================

    {
        regex: /^FC[-_ ]?\d+/i,
        category: "Biến tần",
        score: 130
    },

    {
        regex: /^VLT\b/i,
        category: "Biến tần",
        score: 130
    },


    // =====================================================
    // MOTOR
    // =====================================================

    {
        regex: /^MOTOR\b/i,
        category: "Động cơ",
        score: 130
    },

    {
        regex: /^M\d+\b/i,
        category: "Động cơ",
        score: 100
    },

    {
        regex: /^DR[A-Z]?\d+/i,
        category: "Động cơ",
        score: 110
    },

    {
        regex: /^SK\d+/i,
        category: "Động cơ",
        score: 110
    },


    // =====================================================
    // SEW
    // =====================================================

    {
        regex: /^SEW\b/i,
        category: "Động cơ",
        score: 140
    },

    {
        regex: /^DRN\d+/i,
        category: "Động cơ",
        score: 140
    },


    // =====================================================
    // NORD
    // =====================================================

    {
        regex: /^NORD\b/i,
        category: "Động cơ",
        score: 140
    },

    {
        regex: /^SK\s?\d+/i,
        category: "Động cơ",
        score: 120
    },


    // =====================================================
    // SENSOR
    // =====================================================

    {
        regex: /^IFM\b/i,
        category: "Cảm biến",
        score: 120
    },

    {
        regex: /^SICK\b/i,
        category: "Cảm biến",
        score: 120
    },

    {
        regex: /^BALLUFF\b/i,
        category: "Cảm biến",
        score: 120
    },

    {
        regex: /^TURCK\b/i,
        category: "Cảm biến",
        score: 120
    },

    {
        regex: /^KEYENCE\b/i,
        category: "Cảm biến",
        score: 120
    },


    // =====================================================
    // SAFETY
    // =====================================================

    {
        regex: /^E[-_ ]?STOP\b/i,
        category: "An toàn",
        score: 150
    },

    {
        regex: /^ESTOP\b/i,
        category: "An toàn",
        score: 150
    },


    // =====================================================
    // POWER
    // =====================================================

    {
        regex: /^PSU\b/i,
        category: "Nguồn",
        score: 120
    },

    {
        regex: /^PWR\b/i,
        category: "Nguồn",
        score: 110
    },

    {
        regex: /^PS[-_ ]?\d+/i,
        category: "Nguồn",
        score: 110
    },


    // =====================================================
    // OMRON
    // =====================================================

    // OMRON PLC
    {
        regex: /^CJ\d+/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^CP\d+/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^CS\d+/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^NX\d+/i,
        category: "PLC",
        score: 120
    },


    // OMRON RELAY
    {
        regex: /^MY\d+/i,
        category: "Điện điều khiển",
        score: 130
    },

    {
        regex: /^LY\d+/i,
        category: "Điện điều khiển",
        score: 130
    },

    {
        regex: /^G2R\b/i,
        category: "Điện điều khiển",
        score: 130
    },


    // =====================================================
    // SCHNEIDER
    // =====================================================

    {
        regex: /^TM\d+/i,
        category: "PLC",
        score: 120
    },

    {
        regex: /^TSX\d+/i,
        category: "PLC",
        score: 130
    },

    {
        regex: /^M340\b/i,
        category: "PLC",
        score: 130
    },

    {
        regex: /^M580\b/i,
        category: "PLC",
        score: 130
    },


    // =====================================================
    // CONTACTOR
    // =====================================================

    {
        regex: /^LC\d+/i,
        category: "Điện điều khiển",
        score: 110
    },


    // =====================================================
    // POWER / 24V
    // =====================================================

    {
        regex: /^QUINT[-_ ]?PS/i,
        category: "Nguồn",
        score: 140
    },

    {
        regex: /^SITOP\b/i,
        category: "Nguồn",
        score: 140
    },


    // =====================================================
    // COMMUNICATION
    // =====================================================

    {
        regex: /^FL[-_ ]?SWITCH/i,
        category: "Truyền thông",
        score: 120
    },

    {
        regex: /^SCALANCE\b/i,
        category: "Truyền thông",
        score: 130
    }

];