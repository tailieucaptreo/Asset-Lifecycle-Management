// =======================================
// Manufacturers Library
// Chỉ lưu thông tin hãng sản xuất.
// Không chứa logic tính điểm.
// Không quyết định category cuối cùng.
// =======================================

module.exports = [

    // =====================================================
    // DRIVE / INVERTER
    // =====================================================

    {
        name: "ABB",

        aliases: [
            "abb"
        ],

        defaultCategory: "Biến tần"
    },

    {
        name: "VACON",

        aliases: [
            "vacon"
        ],

        defaultCategory: "Biến tần"
    },

    {
        name: "DANFOSS",

        aliases: [
            "danfoss"
        ],

        defaultCategory: "Biến tần"
    },

    // =====================================================
    // PLC / AUTOMATION
    // =====================================================

    {
        name: "PILZ",

        aliases: [
            "pilz"
        ],

        defaultCategory: "PLC"
    },

    {
        name: "SIEMENS",

        aliases: [
            "siemens",
            "simatic"
        ],

        defaultCategory: "PLC"
    },

    {
        name: "MITSUBISHI",

        aliases: [
            "mitsubishi"
        ],

        defaultCategory: "PLC"
    },

    // -----------------------------------------------------
    // OMRON
    // Không mặc định PLC.
    // OMRON có thể là PLC, Relay, Sensor, Switch...
    // Model / tên thiết bị sẽ quyết định category.
    // -----------------------------------------------------

    {
        name: "OMRON",

        aliases: [
            "omron"
        ],

        defaultCategory: ""
    },

    {
        name: "SCHNEIDER",

        aliases: [
            "schneider",
            "telemecanique"
        ],

        defaultCategory: "PLC"
    },

    {
        name: "ALLEN BRADLEY",

        aliases: [
            "allen bradley"
        ],

        defaultCategory: "PLC"
    },

    {
        name: "ROCKWELL",

        aliases: [
            "rockwell"
        ],

        defaultCategory: "PLC"
    },

    // -----------------------------------------------------
    // BECKHOFF
    // Có category riêng BECKHOFF.
    // Không đưa chung vào PLC.
    // -----------------------------------------------------

    {
        name: "BECKHOFF",

        aliases: [
            "beckhoff"
        ],

        defaultCategory: "BECKHOFF"
    },

    // =====================================================
    // CONTROL ELECTRICAL
    // =====================================================

    {
        name: "WAGO",

        aliases: [
            "wago"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "PHOENIX CONTACT",

        aliases: [
            "phoenix",
            "phoenix contact"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "WEIDMULLER",

        aliases: [
            "weidmuller"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "EATON",

        aliases: [
            "eaton"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "FUJI",

        aliases: [
            "fuji"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "DELTA",

        aliases: [
            "delta"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "LS",

        aliases: [
            "ls"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "GE",

        aliases: [
            "general electric",
            "ge"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "CARLO GAVAZZI",

        aliases: [
            "carlo gavazzi"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "FINDER",

        aliases: [
            "finder"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "RITTAL",

        aliases: [
            "rittal"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "MOELLER",

        aliases: [
            "moeller"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "HAGER",

        aliases: [
            "hager"
        ],

        defaultCategory: "Điện điều khiển"
    },

    {
        name: "CHINT",

        aliases: [
            "chint"
        ],

        defaultCategory: "Điện điều khiển"
    },

    // =====================================================
    // SENSOR
    // =====================================================

    {
        name: "SICK",

        aliases: [
            "sick"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "IFM",

        aliases: [
            "ifm"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "BALLUFF",

        aliases: [
            "balluff"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "TURCK",

        aliases: [
            "turck"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "PEPPERL+FUCHS",

        aliases: [
            "pepperl",
            "pepperl+fuchs"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "BANNER",

        aliases: [
            "banner"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "LEUZE",

        aliases: [
            "leuze"
        ],

        defaultCategory: "Cảm biến"
    },

    {
        name: "KEYENCE",

        aliases: [
            "keyence"
        ],

        defaultCategory: "Cảm biến"
    },

    // =====================================================
    // MOTOR / GEAR MOTOR
    // =====================================================

    {
        name: "SEW",

        aliases: [
            "sew"
        ],

        defaultCategory: "Động cơ"
    },

    {
        name: "NORD",

        aliases: [
            "nord"
        ],

        defaultCategory: "Động cơ"
    },

    {
        name: "LENZE",

        aliases: [
            "lenze"
        ],

        defaultCategory: "Động cơ"
    },

    {
        name: "YASKAWA",

        aliases: [
            "yaskawa"
        ],

        defaultCategory: "Động cơ"
    },

    {
        name: "BOSCH REXROTH",

        aliases: [
            "bosch rexroth",
            "rexroth"
        ],

        defaultCategory: "Động cơ"
    }

];