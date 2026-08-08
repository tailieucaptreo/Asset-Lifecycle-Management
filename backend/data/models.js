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
        score: 160
    },

    {
        regex: /^PSSU\b/i,
        category: "PLC",
        score: 160
    },

    {
        regex: /^PSS[-_ ]/i,
        category: "PLC",
        score: 160
    },

    {
        regex: /^P10\b/i,
        category: "PLC",
        score: 160
    },

    {
        regex: /^S7[-_ ]?\d+/i,
        category: "PLC",
        score: 150
    },

    {
        regex: /^CPU[-_ ]?\d+/i,
        category: "PLC",
        score: 130
    },

    {
        regex: /^PLC\b/i,
        category: "PLC",
        score: 150
    },

    {
        regex: /^CJ\d+/i,
        category: "PLC",
        score: 150
    },

    {
        regex: /^CP\d+/i,
        category: "PLC",
        score: 150
    },

    {
        regex: /^CS\d+/i,
        category: "PLC",
        score: 150
    },

    {
        regex: /^TM\d+/i,
        category: "PLC",
        score: 130
    },

    {
        regex: /^TSX\d+/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^M340\b/i,
        category: "PLC",
        score: 140
    },

    {
        regex: /^M580\b/i,
        category: "PLC",
        score: 140
    },


    // =====================================================
    // BECKHOFF
    // =====================================================

    {
        regex: /^BECKHOFF\b/i,
        category: "BECKHOFF",
        score: 160
    },

    {
        regex: /^EK\d+/i,
        category: "BECKHOFF",
        score: 140
    },

    {
        regex: /^EL\d+/i,
        category: "BECKHOFF",
        score: 140
    },

    {
        regex: /^KL\d+/i,
        category: "BECKHOFF",
        score: 140
    },

    {
        regex: /^BK\d+/i,
        category: "BECKHOFF",
        score: 140
    },

    {
        regex: /^CX\d+/i,
        category: "BECKHOFF",
        score: 150
    },


    // =====================================================
    // BIẾN TẦN - ABB
    // =====================================================

    {
        regex: /^ACS\d+/i,
        category: "Biến tần",
        score: 170
    },

    {
        regex: /^ACS\d+[-_]/i,
        category: "Biến tần",
        score: 170
    },


    // =====================================================
    // BIẾN TẦN - VACON
    // =====================================================

    {
        regex: /^VACON\b/i,
        category: "Biến tần",
        score: 170
    },

    {
        regex: /^NX[A-Z]?\d+/i,
        category: "Biến tần",
        score: 170
    },

    {
        regex: /^NXI\d+/i,
        category: "Biến tần",
        score: 170
    },


    // =====================================================
    // BIẾN TẦN - DANFOSS
    // =====================================================

    {
        regex: /^FC[-_ ]?\d+/i,
        category: "Biến tần",
        score: 150
    },

    {
        regex: /^VLT\b/i,
        category: "Biến tần",
        score: 150
    },


    // =====================================================
    // ĐỘNG CƠ
    // =====================================================

    {
        regex: /^MOTOR\b/i,
        category: "Động cơ",
        score: 150
    },

    {
        regex: /^M\d+\b/i,
        category: "Động cơ",
        score: 120
    },

    {
        regex: /^DR[A-Z]?\d+/i,
        category: "Động cơ",
        score: 130
    },

    {
        regex: /^DRN\d+/i,
        category: "Động cơ",
        score: 150
    },

    {
        regex: /^SK\d+/i,
        category: "Động cơ",
        score: 130
    },

    {
        regex: /^SEW\b/i,
        category: "Động cơ",
        score: 150
    },

    {
        regex: /^NORD\b/i,
        category: "Động cơ",
        score: 150
    },


    // =====================================================
    // CẢM BIẾN
    // =====================================================

    {
        regex: /^IFM\b/i,
        category: "Cảm biến",
        score: 140
    },

    {
        regex: /^SICK\b/i,
        category: "Cảm biến",
        score: 140
    },

    {
        regex: /^BALLUFF\b/i,
        category: "Cảm biến",
        score: 140
    },

    {
        regex: /^TURCK\b/i,
        category: "Cảm biến",
        score: 140
    },

    {
        regex: /^KEYENCE\b/i,
        category: "Cảm biến",
        score: 140
    },


    // =====================================================
    // AN TOÀN
    // =====================================================

    {
        regex: /^E[-_ ]?STOP\b/i,
        category: "An toàn",
        score: 170
    },

    {
        regex: /^ESTOP\b/i,
        category: "An toàn",
        score: 170
    },


    // =====================================================
    // NGUỒN
    // =====================================================

    {
        regex: /^PSU\b/i,
        category: "Nguồn",
        score: 140
    },

    {
        regex: /^PWR\b/i,
        category: "Nguồn",
        score: 130
    },

    {
        regex: /^PS[-_ ]?\d+/i,
        category: "Nguồn",
        score: 130
    },

    {
        regex: /^QUINT[-_ ]?PS/i,
        category: "Nguồn",
        score: 150
    },

    {
        regex: /^SITOP\b/i,
        category: "Nguồn",
        score: 150
    },


    // =====================================================
    // OMRON - RELAY
    // =====================================================

    {
        regex: /^MY\d+/i,
        category: "Điện điều khiển",
        score: 150
    },

    {
        regex: /^LY\d+/i,
        category: "Điện điều khiển",
        score: 150
    },

    {
        regex: /^G2R\b/i,
        category: "Điện điều khiển",
        score: 150
    },


    // =====================================================
    // CONTACTOR
    // =====================================================

    {
        regex: /^LC\d+/i,
        category: "Điện điều khiển",
        score: 130
    },


    // =====================================================
    // TRUYỀN THÔNG
    // =====================================================

    {
        regex: /^FL[-_ ]?SWITCH/i,
        category: "Truyền thông",
        score: 140
    },

    {
        regex: /^SCALANCE\b/i,
        category: "Truyền thông",
        score: 150
    },

    {
        regex: /^PHONIX\s+CONTACT\s+HUB/i,
        category: "Truyền thông",
        score: 170
    },


    // =====================================================
    // ĐIỆN ĐIỀU KHIỂN - MCR
    // =====================================================

    {
        regex: /^MCR\s*[-_]/i,
        category: "Điện điều khiển",
        score: 150
    },


    // =====================================================
    // ĐIỆN ĐIỀU KHIỂN - LỌC NHIỄU
    // =====================================================

    {
        regex: /^RCPRB/i,
        category: "Điện điều khiển",
        score: 140
    },

    {
        regex: /^VG[-_]/i,
        category: "Điện điều khiển",
        score: 140
    },


    // =====================================================
    // OPTOCOUPLER
    // =====================================================

    {
        regex: /^OPTOCOUPLER\b/i,
        category: "Điện điều khiển",
        score: 150
    }

];