// backend/data/category.rules.js

module.exports = [

    // =====================================================
    // BIẾN TẦN
    // =====================================================

    {
        category: "Biến tần",
        priority: 100,

        keywords: [

            { text: "drive", weight: 25 },
            { text: "vfd", weight: 40 },
            { text: "inverter", weight: 40 },
            { text: "frequency converter", weight: 45 },

            { text: "acs", weight: 30 },
            { text: "vacon", weight: 40 },
            { text: "danfoss", weight: 30 },

            { text: "sinamics", weight: 40 },
            { text: "atv", weight: 35 },
            { text: "movidrive", weight: 40 },
            { text: "movitrac", weight: 40 }

        ]
    },

    // =====================================================
    // PLC
    // =====================================================

    {
        category: "PLC",
        priority: 95,

        keywords: [

            { text: "plc", weight: 50 },
            { text: "cpu", weight: 40 },

            { text: "simatic", weight: 40 },
            { text: "s7", weight: 45 },

            { text: "pilz", weight: 35 },
            { text: "pss", weight: 35 },

            { text: "mitsubishi", weight: 30 },
            { text: "omron", weight: 30 },

            { text: "schneider", weight: 20 },
            { text: "modicon", weight: 35 },

            { text: "allen bradley", weight: 35 },
            { text: "rockwell", weight: 30 }

        ]
    },

    // =====================================================
    // BECKHOFF
    // =====================================================

    {
        category: "BECKHOFF",
        priority: 90,

        keywords: [

            { text: "beckhoff", weight: 50 },

            { text: "ethercat", weight: 30 },

            { text: "ek", weight: 20 },
            { text: "el", weight: 20 },
            { text: "kl", weight: 20 },
            { text: "bk", weight: 20 },
            { text: "cx", weight: 20 }

        ]
    },

    // =====================================================
    // AN TOÀN
    // =====================================================

    {
        category: "An toàn",
        priority: 85,

        keywords: [

            { text: "safety", weight: 40 },

            { text: "emergency stop", weight: 45 },
            { text: "estop", weight: 45 },

            { text: "safety relay", weight: 45 },
            { text: "light curtain", weight: 45 },

            { text: "guard switch", weight: 35 },

            { text: "rope switch", weight: 40 },

            { text: "speed monitor", weight: 35 },

            { text: "overspeed", weight: 35 }

        ]
    },

    // =====================================================
    // ĐIỆN ĐIỀU KHIỂN
    // =====================================================

    {
        category: "Điện điều khiển",
        priority: 80,

        keywords: [

            { text: "relay", weight: 20 },

            { text: "interface relay", weight: 35 },

            { text: "time relay", weight: 35 },

            { text: "solid state relay", weight: 35 },

            { text: "contactor", weight: 30 },

            { text: "breaker", weight: 20 },

            { text: "mcb", weight: 25 },
            { text: "mccb", weight: 25 },
            { text: "rcbo", weight: 25 },

            { text: "terminal", weight: 25 },

            { text: "terminal block", weight: 30 },

            { text: "selector", weight: 25 },

            { text: "push button", weight: 30 },

            { text: "pilot lamp", weight: 25 },

            { text: "buzzer", weight: 20 },

            { text: "horn", weight: 20 },

            { text: "power supply", weight: 30 },

            { text: "smps", weight: 30 },

            { text: "ups", weight: 35 },

            { text: "psu", weight: 35 }

        ]
    },

    // =====================================================
    // CẢM BIẾN
    // =====================================================

    {
        category: "Cảm biến",
        priority: 75,

        keywords: [

            { text: "sensor", weight: 40 },

            { text: "encoder", weight: 40 },

            { text: "resolver", weight: 40 },

            { text: "photoelectric", weight: 35 },

            { text: "photo sensor", weight: 35 },

            { text: "laser", weight: 35 },

            { text: "proximity", weight: 35 },

            { text: "inductive", weight: 35 },

            { text: "limit switch", weight: 30 },

            { text: "reed switch", weight: 30 },

            { text: "temperature sensor", weight: 35 },

            { text: "pressure sensor", weight: 35 },

            { text: "load cell", weight: 35 }

        ]
    },

    // =====================================================
    // ĐỘNG CƠ
    // =====================================================

    {
        category: "Động cơ",
        priority: 70,

        keywords: [

            { text: "motor", weight: 40 },

            { text: "servo", weight: 40 },

            { text: "gear motor", weight: 45 },

            { text: "gearbox", weight: 30 },

            { text: "brake motor", weight: 40 },

            { text: "fan", weight: 20 },

            { text: "blower", weight: 25 }

        ]
    },

    // =====================================================
    // NGUỒN
    // =====================================================

    {
        category: "Nguồn",
        priority: 65,

        keywords: [

            { text: "battery", weight: 35 },

            { text: "rectifier", weight: 40 },

            { text: "transformer", weight: 35 },

            { text: "power module", weight: 35 },

            { text: "24 volt", weight: 20 },

            { text: "48 volt", weight: 20 }

        ]
    },

    // =====================================================
    // TRUYỀN THÔNG
    // =====================================================

    {
        category: "Truyền thông",
        priority: 60,

        keywords: [

            { text: "ethernet", weight: 35 },

            { text: "profinet", weight: 35 },

            { text: "profibus", weight: 35 },

            { text: "modbus", weight: 35 },

            { text: "ethercat", weight: 35 },

            { text: "canopen", weight: 35 },

            { text: "gateway", weight: 35 },

            { text: "converter", weight: 30 },

            { text: "network switch", weight: 35 },

            { text: "fiber converter", weight: 35 },

            { text: "modem", weight: 25 }

        ]
    }

];
