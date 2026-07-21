// =======================================
// Category Rules
// Priority: càng lớn càng ưu tiên
// =======================================

module.exports = [

    // ===========================
    // BIẾN TẦN
    // ===========================
    {
        category: "Biến tần",
        priority: 100,
        keywords: [

            // ABB
            "acs355",
            "acs550",
            "acs580",
            "acs800",
            "acs880",

            // VACON
            "vacon",
            "nxa",
            "nxb",
            "nxi",

            // Danfoss
            "danfoss",
            "fc51",
            "fc102",
            "fc202",
            "fc302",

            "inverter",
            "frequency converter",
            "drive",
            "vfd"
        ]
    },

    // ===========================
    // PLC
    // ===========================
    {
        category: "PLC",
        priority: 95,
        keywords: [

            "plc",

            "cpu",

            "pilz",

            "pss",
            "pssu",

            "siemens",
            "simatic",
            "s7",

            "omron",
            "cj1",
            "cp1",
            "nx1",

            "mitsubishi",
            "fx3",
            "fx5",
            "q series",

            "allen bradley",

            "rockwell"
        ]
    },

    // ===========================
    // BECKHOFF
    // ===========================
    {
        category: "BECKHOFF",
        priority: 90,
        keywords: [

            "beckhoff",

            "ethercat",

            "ek1100",

            "bk9050",

            "cx",

            "el1008",
            "el1018",
            "el1809",
            "el2008",
            "el2809",
            "el3002",
            "el3054",
            "el3062",
            "el3202",
            "el3314",
            "el3403",

            "kl1408",
            "kl2408",
            "kl3202"
        ]
    },

    // ===========================
    // THIẾT BỊ AN TOÀN
    // ===========================
    {
        category: "An toàn",
        priority: 85,
        keywords: [

            "emergency stop",

            "emergency",

            "estop",

            "e-stop",

            "safety",

            "safety relay",

            "safety switch",

            "light curtain",

            "pilz s1um",

            "overspeed",

            "speed monitor",

            "rope switch",

            "safety contact",

            "guard switch"
        ]
    },

    // ===========================
    // ĐIỆN ĐIỀU KHIỂN
    // ===========================
    {
        category: "Điện điều khiển",
        priority: 80,
        keywords: [

            "relay",

            "interposing relay",

            "contactor",

            "mcb",

            "mccb",

            "rcbo",

            "rcd",

            "fuse",

            "cau chi",

            "elr",

            "terminal",

            "terminal block",

            "socket",

            "selector",

            "selector switch",

            "key switch",

            "chia khoa",

            "switch",

            "push button",

            "button",

            "nut nhan",

            "pilot lamp",

            "indicator",

            "lamp",

            "den",

            "buzzer",

            "horn",

            "power supply",

            "24vdc",

            "smps",

            "ups",

            "charger",

            "potentiometer",

            "bien tro",

            "chiet ap"
        ]
    },

    // ===========================
    // CẢM BIẾN
    // ===========================
    {
        category: "Cảm biến",
        priority: 75,
        keywords: [

            "sensor",

            "encoder",

            "resolver",

            "photo sensor",

            "photoelectric",

            "laser sensor",

            "inductive",

            "proximity",

            "limit switch",

            "reed switch",

            "temperature sensor",

            "pressure sensor",

            "load cell"
        ]
    },

    // ===========================
    // ĐỘNG CƠ
    // ===========================
    {
        category: "Động cơ",
        priority: 70,
        keywords: [

            "motor",

            "servo",

            "gear motor",

            "gearbox",

            "brake motor",

            "fan",

            "blower",

            "cooling fan"
        ]
    },

    // ===========================
    // NGUỒN
    // ===========================
    {
        category: "Nguồn",
        priority: 65,
        keywords: [

            "battery",

            "ac dc",

            "dc dc",

            "power module",

            "rectifier",

            "transformer",

            "24 volt",

            "48 volt"
        ]
    },

    // ===========================
    // TRUYỀN THÔNG
    // ===========================
    {
        category: "Truyền thông",
        priority: 60,
        keywords: [

            "ethernet",

            "ethercat",

            "profibus",

            "profinet",

            "modbus",

            "canopen",

            "gateway",

            "converter",

            "hub",

            "network switch",

            "industrial switch",

            "fiber converter",

            "modem"
        ]
    }

];
