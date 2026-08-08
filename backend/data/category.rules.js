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

            { text: "drive", weight: 30 },
            { text: "vfd", weight: 55 },
            { text: "inverter", weight: 55 },
            { text: "frequency converter", weight: 60 },
            { text: "frequency drive", weight: 55 },

            { text: "acs", weight: 45 },
            { text: "vacon", weight: 55 },
            { text: "danfoss", weight: 45 },

            { text: "sinamics", weight: 55 },
            { text: "atv", weight: 50 },

            { text: "movidrive", weight: 55 },
            { text: "movitrac", weight: 55 },

            { text: "biến tần", weight: 70 },
            { text: "bien tan", weight: 70 }
        ]
    },


    // =====================================================
    // PLC
    // =====================================================

    {
        category: "PLC",
        priority: 98,

        keywords: [

            { text: "plc", weight: 70 },
            { text: "programmable logic controller", weight: 70 },

            { text: "simatic", weight: 60 },
            { text: "s7", weight: 60 },

            { text: "pilz", weight: 55 },
            { text: "pss", weight: 65 },
            { text: "pssu", weight: 65 },

            { text: "mitsubishi", weight: 45 },
            { text: "schneider", weight: 40 },
            { text: "modicon", weight: 55 },

            { text: "allen bradley", weight: 50 },
            { text: "rockwell", weight: 45 },

            { text: "controller", weight: 40 },
            { text: "logic controller", weight: 60 },

            { text: "p10 aio", weight: 80 },
            { text: "p10 di", weight: 80 },
            { text: "p10 dio", weight: 80 },
            { text: "p10 do", weight: 80 },
            { text: "p10 epb", weight: 80 },
            { text: "p10 epe", weight: 80 }
        ]
    },


    // =====================================================
    // BECKHOFF
    // =====================================================

    {
        category: "BECKHOFF",
        priority: 96,

        keywords: [

            { text: "beckhoff", weight: 80 },
            { text: "beckhoff ethercat", weight: 80 },

            { text: "ethercat", weight: 45 },

            { text: "ek", weight: 25 },
            { text: "el", weight: 25 },
            { text: "kl", weight: 25 },
            { text: "bk", weight: 25 },
            { text: "cx", weight: 30 }
        ]
    },


    // =====================================================
    // AN TOÀN
    // =====================================================

    {
        category: "An toàn",
        priority: 97,

        keywords: [

            { text: "safety", weight: 60 },

            { text: "emergency stop", weight: 80 },
            { text: "emergency", weight: 45 },

            { text: "estop", weight: 80 },
            { text: "e-stop", weight: 80 },

            { text: "nút dừng khẩn", weight: 80 },
            { text: "dừng khẩn", weight: 75 },

            { text: "nút dừng stop", weight: 70 },

            { text: "safety relay", weight: 70 },
            { text: "safety controller", weight: 70 },

            { text: "light curtain", weight: 65 },
            { text: "guard switch", weight: 60 },
            { text: "rope switch", weight: 65 },

            { text: "speed monitor", weight: 65 },
            { text: "overspeed", weight: 75 },

            { text: "quá tốc", weight: 80 },
            { text: "quá tốc độ", weight: 80 },

            { text: "anti collision", weight: 70 },
            { text: "anti-collision", weight: 70 },

            { text: "chống va đập", weight: 75 },

            { text: "khóa an toàn", weight: 70 },
            { text: "chìa khóa an toàn", weight: 75 },

            { text: "giám sát kẹp cáp", weight: 75 },
            { text: "bỏ qua giám sát", weight: 65 },

            { text: "bỏ qua quá tốc", weight: 85 },
            { text: "bỏ qua nút stop", weight: 85 },
            { text: "bỏ qua thay đổi lực căng", weight: 85 },
            { text: "bỏ qua vị trí dây cáp", weight: 85 },

            { text: "lực căng cáp", weight: 70 },
            { text: "vị trí dây cáp", weight: 70 },

            { text: "interlock", weight: 65 }
        ]
    },


    // =====================================================
    // CẢM BIẾN
    // =====================================================

    {
        category: "Cảm biến",
        priority: 90,

        keywords: [

            { text: "sensor", weight: 65 },
            { text: "cảm biến", weight: 75 },

            { text: "encoder", weight: 65 },
            { text: "resolver", weight: 65 },

            { text: "photoelectric", weight: 60 },
            { text: "photo sensor", weight: 60 },
            { text: "cảm biến quang", weight: 65 },

            { text: "laser sensor", weight: 60 },

            { text: "proximity", weight: 60 },
            { text: "proximity sensor", weight: 65 },
            { text: "cảm biến tiệm cận", weight: 70 },

            { text: "inductive sensor", weight: 60 },

            { text: "limit switch", weight: 60 },
            { text: "công tắc hành trình", weight: 70 },

            { text: "reed switch", weight: 55 },

            { text: "temperature sensor", weight: 60 },
            { text: "cảm biến nhiệt", weight: 70 },

            { text: "pressure sensor", weight: 60 },
            { text: "cảm biến áp suất", weight: 70 },

            { text: "load cell", weight: 60 },
            { text: "cảm biến lực", weight: 70 }
        ]
    },


    // =====================================================
    // ĐỘNG CƠ
    // =====================================================

    {
        category: "Động cơ",
        priority: 90,

        keywords: [

            { text: "motor", weight: 70 },
            { text: "động cơ", weight: 80 },

            { text: "servo motor", weight: 75 },
            { text: "servo", weight: 65 },

            { text: "gear motor", weight: 75 },
            { text: "gearbox", weight: 45 },

            { text: "hộp số", weight: 45 },

            { text: "brake motor", weight: 70 },
            { text: "động cơ phanh", weight: 80 },

            { text: "fan motor", weight: 60 },
            { text: "quạt", weight: 45 },
            { text: "blower", weight: 45 }
        ]
    },


    // =====================================================
    // NGUỒN
    // =====================================================

    {
        category: "Nguồn",
        priority: 88,

        keywords: [

            { text: "battery", weight: 60 },
            { text: "ắc quy", weight: 70 },
            { text: "ac quy", weight: 70 },

            { text: "charger", weight: 60 },
            { text: "battery charger", weight: 70 },

            { text: "bộ sạc", weight: 75 },
            { text: "victron", weight: 75 },

            { text: "rectifier", weight: 65 },
            { text: "bộ chỉnh lưu", weight: 75 },

            { text: "transformer", weight: 60 },
            { text: "máy biến áp", weight: 70 },

            { text: "power module", weight: 60 },
            { text: "power supply", weight: 60 },

            { text: "bộ nguồn", weight: 70 },
            { text: "bộ chuyển nguồn", weight: 80 },

            { text: "nguồn", weight: 35 },

            { text: "24 volt", weight: 35 },
            { text: "24v", weight: 30 },
            { text: "24vdc", weight: 45 },

            { text: "48 volt", weight: 35 },
            { text: "48v", weight: 30 },
            { text: "48vdc", weight: 45 }
        ]
    },


    // =====================================================
    // TRUYỀN THÔNG
    // =====================================================

    {
        category: "Truyền thông",
        priority: 87,

        keywords: [

            { text: "ethernet", weight: 55 },
            { text: "profinet", weight: 65 },
            { text: "profibus", weight: 65 },
            { text: "modbus", weight: 65 },
            { text: "canopen", weight: 65 },

            { text: "gateway", weight: 60 },

            { text: "network switch", weight: 70 },
            { text: "industrial switch", weight: 70 },

            { text: "fiber converter", weight: 70 },
            { text: "media converter", weight: 65 },

            { text: "modem", weight: 50 },
            { text: "communication", weight: 55 },

            { text: "truyền thông", weight: 70 },
            { text: "mạng", weight: 35 },
            { text: "switch mạng", weight: 65 },

            { text: "hub", weight: 55 },
            { text: "network hub", weight: 70 },

            { text: "phonix contact hub", weight: 85 }
        ]
    },


    // =====================================================
    // CHỐNG SÉT
    // =====================================================

    {
        category: "Chống sét",
        priority: 95,

        keywords: [

            { text: "surge protector", weight: 80 },
            { text: "surge protection", weight: 80 },
            { text: "surge arrester", weight: 80 },

            { text: "lightning protection", weight: 80 },
            { text: "lightning arrester", weight: 80 },

            { text: "chống sét", weight: 90 },
            { text: "thiết bị chống sét", weight: 90 },
            { text: "bộ chống sét", weight: 90 },
            { text: "bảo vệ chống sét", weight: 85 }
        ]
    },


    // =====================================================
    // ĐIỆN ĐIỀU KHIỂN
    // =====================================================

    {
        category: "Điện điều khiển",
        priority: 86,

        keywords: [

            // Relay
            { text: "relay", weight: 60 },
            { text: "rơ le", weight: 65 },
            { text: "role", weight: 60 },

            { text: "interface relay", weight: 70 },
            { text: "time relay", weight: 70 },
            { text: "solid state relay", weight: 70 },

            // Contactor
            { text: "contactor", weight: 65 },
            { text: "khởi động từ", weight: 65 },

            // Breaker
            { text: "breaker", weight: 45 },
            { text: "circuit breaker", weight: 55 },

            { text: "mcb", weight: 55 },
            { text: "mccb", weight: 55 },
            { text: "rcbo", weight: 55 },
            { text: "rccb", weight: 65 },

            // Fuse
            { text: "fuse", weight: 60 },
            { text: "cầu chì", weight: 70 },

            // Terminal
            { text: "terminal", weight: 45 },
            { text: "terminal block", weight: 60 },
            { text: "cầu đấu", weight: 65 },

            // Selector
            { text: "selector", weight: 55 },
            { text: "selector switch", weight: 65 },

            { text: "công tắc", weight: 50 },
            { text: "công tắc chọn", weight: 65 },

            // Push button
            { text: "push button", weight: 65 },
            { text: "pushbutton", weight: 65 },

            { text: "nút nhấn", weight: 65 },
            { text: "nút ấn", weight: 65 },

            // Pilot lamp
            { text: "pilot lamp", weight: 55 },
            { text: "indicator lamp", weight: 55 },
            { text: "đèn báo", weight: 60 },
            { text: "đèn cảnh báo", weight: 60 },

            // Buzzer
            { text: "buzzer", weight: 50 },
            { text: "horn", weight: 50 },
            { text: "còi", weight: 50 },

            // Chiết áp
            { text: "potentiometer", weight: 70 },
            { text: "chiết áp", weight: 80 },
            { text: "biến trở", weight: 80 },

            { text: "hiệu chỉnh tốc độ", weight: 60 },
            { text: "điều chỉnh tốc độ", weight: 60 },

            // Điều khiển
            { text: "bộ điều khiển", weight: 55 },
            { text: "điều khiển", weight: 35 },

            // MCR
            { text: "mcr", weight: 55 },

            // Lọc nhiễu
            { text: "lọc nhiễu", weight: 65 },
            { text: "noise filter", weight: 65 },
            { text: "rcprb", weight: 70 },

            // Optocoupler
            { text: "optocoupler", weight: 75 },

            // PT100 trong module MCR
            { text: "pt100", weight: 55 },

            // Công tắc / SW
            { text: "sw ", weight: 40 },

            { text: "bước tốc độ", weight: 65 },
            { text: "chọn chế độ", weight: 60 },
            { text: "chế độ truyền động", weight: 65 },
            { text: "hướng truyền động", weight: 65 },

            { text: "bơm phanh", weight: 65 },
            { text: "làm nóng nước làm mát", weight: 65 },
            { text: "đèn chiếu sáng", weight: 55 },

            // Điện trở
            { text: "điện trở", weight: 65 },
            { text: "resistor", weight: 60 },

            // Đồng hồ
            { text: "đồng hồ", weight: 60 },
            { text: "ammeter", weight: 60 },
            { text: "voltmeter", weight: 60 },

            { text: "armature current", weight: 70 },
            { text: "line current", weight: 65 },
            { text: "tower fault", weight: 55 },

            // Light / Test / Trip
            { text: "light test", weight: 55 },
            { text: "total trip", weight: 50 },

            // Ổ cắm
            { text: "ổ cắm", weight: 45 },
            { text: "socket", weight: 45 }
        ]
    }

];