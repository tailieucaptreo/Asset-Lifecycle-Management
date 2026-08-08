// =======================================
// Category Rules
// Keyword dùng để chấm điểm phân loại
// =======================================

module.exports = [

    // =====================================================
    // BIẾN TẦN
    // =====================================================

    {
        category: "Biến tần",
        priority: 100,

        keywords: [

            { text: "drive", weight: 25 },
            { text: "vfd", weight: 45 },
            { text: "inverter", weight: 45 },
            { text: "frequency converter", weight: 50 },

            { text: "frequency drive", weight: 45 },

            { text: "acs", weight: 35 },
            { text: "vacon", weight: 45 },
            { text: "danfoss", weight: 35 },

            { text: "sinamics", weight: 45 },
            { text: "atv", weight: 40 },

            { text: "movidrive", weight: 45 },
            { text: "movitrac", weight: 45 },

            { text: "biến tần", weight: 55 },

            { text: "bien tan", weight: 55 }

        ]
    },


    // =====================================================
    // PLC
    // =====================================================

    {
        category: "PLC",
        priority: 95,

        keywords: [

            { text: "plc", weight: 60 },

            { text: "programmable logic controller", weight: 60 },

            { text: "simatic", weight: 50 },

            { text: "s7", weight: 50 },

            { text: "pilz", weight: 40 },

            { text: "pss", weight: 50 },

            { text: "pssu", weight: 50 },

            { text: "mitsubishi", weight: 35 },

            // Không dùng OMRON ở đây.
            // OMRON có thể là PLC, relay, sensor...

            { text: "schneider", weight: 30 },

            { text: "modicon", weight: 45 },

            { text: "allen bradley", weight: 40 },

            { text: "rockwell", weight: 35 },

            { text: "controller", weight: 30 },

            { text: "logic controller", weight: 50 }

        ]
    },


    // =====================================================
    // BECKHOFF
    // =====================================================

    {
        category: "BECKHOFF",
        priority: 90,

        keywords: [

            { text: "beckhoff", weight: 70 },

            { text: "ethercat", weight: 30 },

            { text: "ek", weight: 20 },
            { text: "el", weight: 20 },
            { text: "kl", weight: 20 },
            { text: "bk", weight: 20 },
            { text: "cx", weight: 25 },

            { text: "beckhoff ethercat", weight: 60 }

        ]
    },


    // =====================================================
    // AN TOÀN
    // =====================================================

    {
        category: "An toàn",
        priority: 90,

        keywords: [

            { text: "safety", weight: 45 },

            { text: "emergency stop", weight: 60 },
            { text: "emergency", weight: 35 },

            { text: "estop", weight: 60 },

            { text: "e-stop", weight: 60 },

            { text: "nút dừng khẩn", weight: 60 },
            { text: "dừng khẩn", weight: 55 },

            { text: "safety relay", weight: 55 },

            { text: "safety controller", weight: 55 },

            { text: "light curtain", weight: 50 },

            { text: "guard switch", weight: 45 },

            { text: "rope switch", weight: 50 },

            { text: "speed monitor", weight: 45 },

            { text: "overspeed", weight: 45 },

            { text: "anti collision", weight: 50 },

            { text: "anti-collision", weight: 50 },

            { text: "chống va đập", weight: 55 },

            { text: "khóa an toàn", weight: 50 },

            { text: "chìa khóa an toàn", weight: 50 },

            { text: "giám sát kẹp cáp", weight: 55 },

            { text: "bỏ qua giám sát", weight: 45 },

            { text: "interlock", weight: 45 }

        ]
    },


    // =====================================================
    // ĐIỆN ĐIỀU KHIỂN
    // =====================================================

    {
        category: "Điện điều khiển",
        priority: 80,

        keywords: [

            // Relay
            { text: "relay", weight: 40 },
            { text: "rơ le", weight: 45 },
            { text: "role", weight: 40 },

            { text: "interface relay", weight: 50 },

            { text: "time relay", weight: 50 },

            { text: "solid state relay", weight: 50 },

            // Contactor
            { text: "contactor", weight: 45 },

            { text: "khởi động từ", weight: 45 },

            // Breaker
            { text: "breaker", weight: 30 },

            { text: "circuit breaker", weight: 35 },

            { text: "mcb", weight: 35 },
            { text: "mccb", weight: 35 },
            { text: "rcbo", weight: 35 },

            // Terminal
            { text: "terminal", weight: 30 },

            { text: "terminal block", weight: 40 },

            { text: "cầu đấu", weight: 40 },

            // Selector
            { text: "selector", weight: 35 },

            { text: "selector switch", weight: 40 },

            { text: "công tắc", weight: 30 },

            { text: "công tắc chọn", weight: 40 },

            // Push button
            { text: "push button", weight: 40 },

            { text: "pushbutton", weight: 40 },

            { text: "nút nhấn", weight: 40 },

            { text: "nút ấn", weight: 40 },

            // Pilot lamp
            { text: "pilot lamp", weight: 35 },

            { text: "indicator lamp", weight: 35 },

            { text: "đèn báo", weight: 35 },

            // Buzzer
            { text: "buzzer", weight: 30 },

            { text: "horn", weight: 30 },

            { text: "còi", weight: 30 },

            // Chiết áp / biến trở
            { text: "potentiometer", weight: 50 },

            { text: "chiết áp", weight: 55 },

            { text: "biến trở", weight: 55 },

            { text: "hiệu chỉnh tốc độ", weight: 40 },

            { text: "điều chỉnh tốc độ", weight: 40 },

            // Bộ điều khiển
            { text: "bộ điều khiển", weight: 40 },

            { text: "điều khiển", weight: 25 },

            // Nguồn điều khiển
            { text: "power supply", weight: 35 },

            { text: "smps", weight: 40 },

            { text: "ups", weight: 40 },

            { text: "psu", weight: 40 }

        ]
    },


    // =====================================================
    // CẢM BIẾN
    // =====================================================

    {
        category: "Cảm biến",
        priority: 75,

        keywords: [

            { text: "sensor", weight: 50 },

            { text: "cảm biến", weight: 55 },

            { text: "encoder", weight: 50 },

            { text: "resolver", weight: 50 },

            { text: "photoelectric", weight: 45 },

            { text: "photo sensor", weight: 45 },

            { text: "cảm biến quang", weight: 50 },

            { text: "laser sensor", weight: 45 },

            { text: "proximity", weight: 45 },

            { text: "proximity sensor", weight: 50 },

            { text: "cảm biến tiệm cận", weight: 50 },

            { text: "inductive sensor", weight: 45 },

            { text: "limit switch", weight: 45 },

            { text: "công tắc hành trình", weight: 50 },

            { text: "reed switch", weight: 40 },

            { text: "temperature sensor", weight: 45 },

            { text: "cảm biến nhiệt", weight: 50 },

            { text: "pressure sensor", weight: 45 },

            { text: "cảm biến áp suất", weight: 50 },

            { text: "load cell", weight: 45 },

            { text: "cảm biến lực", weight: 50 }

        ]
    },


    // =====================================================
    // ĐỘNG CƠ
    // =====================================================

    {
        category: "Động cơ",
        priority: 70,

        keywords: [

            { text: "motor", weight: 50 },

            { text: "động cơ", weight: 55 },

            { text: "servo", weight: 50 },

            { text: "servo motor", weight: 55 },

            { text: "gear motor", weight: 55 },

            { text: "gearbox", weight: 35 },

            { text: "hộp số", weight: 35 },

            { text: "brake motor", weight: 50 },

            { text: "động cơ phanh", weight: 55 },

            { text: "fan", weight: 25 },

            { text: "blower", weight: 30 },

            { text: "quạt", weight: 30 }

        ]
    },


    // =====================================================
    // NGUỒN
    // =====================================================

    {
        category: "Nguồn",
        priority: 70,

        keywords: [

            { text: "battery", weight: 45 },

            { text: "ắc quy", weight: 50 },

            { text: "ac quy", weight: 50 },

            { text: "charger", weight: 45 },

            { text: "battery charger", weight: 55 },

            { text: "bộ sạc", weight: 55 },

            { text: "victron", weight: 55 },

            { text: "rectifier", weight: 50 },

            { text: "bộ chỉnh lưu", weight: 55 },

            { text: "transformer", weight: 45 },

            { text: "máy biến áp", weight: 50 },

            { text: "power module", weight: 45 },

            { text: "power supply", weight: 45 },

            { text: "bộ nguồn", weight: 50 },

            { text: "bộ chuyển nguồn", weight: 55 },

            { text: "nguồn", weight: 25 },

            { text: "24 volt", weight: 25 },

            { text: "24v", weight: 20 },

            { text: "24vdc", weight: 30 },

            { text: "48 volt", weight: 25 },

            { text: "48v", weight: 20 },

            { text: "48vdc", weight: 30 }

        ]
    },


    // =====================================================
    // TRUYỀN THÔNG
    // =====================================================

    {
        category: "Truyền thông",
        priority: 60,

        keywords: [

            { text: "ethernet", weight: 40 },

            { text: "profinet", weight: 45 },

            { text: "profibus", weight: 45 },

            { text: "modbus", weight: 45 },

            { text: "canopen", weight: 45 },

            { text: "gateway", weight: 45 },

            { text: "network switch", weight: 50 },

            { text: "industrial switch", weight: 50 },

            { text: "fiber converter", weight: 50 },

            { text: "media converter", weight: 45 },

            { text: "modem", weight: 35 },

            { text: "communication", weight: 40 },

            { text: "truyền thông", weight: 45 },

            { text: "mạng", weight: 25 },

            { text: "switch mạng", weight: 45 }

        ]
    },


    // =====================================================
    // CHỐNG SÉT
    // =====================================================

    {
        category: "Chống sét",
        priority: 80,

        keywords: [

            { text: "surge protector", weight: 60 },

            { text: "surge protection", weight: 60 },

            { text: "surge arrester", weight: 60 },

            { text: "lightning protection", weight: 60 },

            { text: "lightning arrester", weight: 60 },

            { text: "chống sét", weight: 65 },

            { text: "thiết bị chống sét", weight: 65 },

            { text: "bộ chống sét", weight: 65 },

            { text: "bảo vệ chống sét", weight: 60 }

        ]
    }

];