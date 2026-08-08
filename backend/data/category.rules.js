// ============================================================
// CATEGORY RULES
// Asset Lifecycle Management
// ============================================================
//
// Cấu trúc:
//
// {
//     category: "Tên phân loại",
//     priority: 100,
//     keywords: ["từ khóa 1", "từ khóa 2"]
// }
//
// priority càng cao => ưu tiên phân loại càng lớn.
//
// Thứ tự hiện tại:
// 1. Biến tần
// 2. PLC
// 3. BECKHOFF
// 4. An toàn
// 5. Điện điều khiển
// 6. Cảm biến
// 7. Động cơ
// 8. Nguồn
// 9. Truyền thông
// 10. Chống sét
// 11. Khác
//
// ============================================================


module.exports = [

    // ========================================================
    // 1. BIẾN TẦN
    // ========================================================

    {
        category: "Biến tần",

        priority: 100,

        keywords: [

            "biến tần",
            "bien tan",
            "vfd",
            "frequency drive",
            "frequency inverter",
            "inverter drive",
            "inverter",

            // ABB
            "abb drive",
            "acs",
            "acs580",
            "acs880",
            "acs800",
            "acs550",
            "acx",

            // VACON
            "vacon",
            "vacon nx",
            "vacon nxi",
            "vacon nxs",
            "vacon 100",
            "vacon 20",

            // Danfoss
            "danfoss drive",
            "vlt",
            "fc 302",
            "fc302",
            "fc 102",
            "fc102",
            "fc 51",
            "fc51",

            // Schneider
            "altivar",
            "atv",

            // Siemens
            "sinamics",
            "micromaster",

            // Yaskawa
            "yaskawa drive",
            "ga500",
            "ga700",

            // Mitsubishi
            "mitsubishi inverter",
            "fr-d",
            "fr-e",
            "fr-a",

            // Lenze
            "lenze inverter",
            "lenze drive"
        ]
    },


    // ========================================================
    // 2. PLC
    // ========================================================

    {
        category: "PLC",

        priority: 95,

        keywords: [

            "plc",
            "p l c",
            "programmable logic controller",

            // Pilz
            "pilz",
            "pnoz",
            "pss",
            "p10",
            "p10 aio",
            "p10 di",
            "p10 dio",
            "p10 do",
            "p10 epb",
            "p10 epe",

            "pss ai",
            "pss di",
            "pss dif",
            "pss di20",
            "pss ps",
            "pss sb",
            "pss cpu",
            "pss ps 24v",

            // PLC modules
            "cpu module",
            "digital input",
            "digital output",
            "analog input",
            "analog output",
            "dio",
            "ai module",
            "ao module",
            "di module",
            "do module",

            // Siemens PLC
            "simatic",
            "s7-1200",
            "s7-1500",
            "s7-300",
            "s7-400",
            "s7-1200",

            // Allen Bradley
            "allen bradley",
            "compactlogix",
            "controllogix",
            "micrologix",

            // Schneider PLC
            "modicon",
            "m340",
            "m580",
            "twido",

            // Omron PLC
            "omron plc",
            "cj1",
            "cj2",
            "nx plc",
            "cp1",

            // Phoenix PLC
            "phoenix contact plc",
            "axioline",

            // PLC Modem
            "plc modem",
            "plc - modem"
        ]
    },


    // ========================================================
    // 3. BECKHOFF
    // ========================================================

    {
        category: "BECKHOFF",

        priority: 90,

        keywords: [

            "beckhoff",

            "cx",
            "cx9020",
            "cx5120",
            "cx5140",

            "ethercat",
            "ek",
            "el",
            "ep",

            "ethercat coupler",
            "ethercat module",
            "ethercat terminal",

            "beckhoff plc",
            "beckhoff cpu",
            "beckhoff module"
        ]
    },


    // ========================================================
    // 4. AN TOÀN
    // ========================================================

    {
        category: "An toàn",

        priority: 88,

        keywords: [

            "an toàn",
            "an toan",
            "safety",

            "emergency stop",
            "emergency-stop",
            "emerg stop",
            "e-stop",
            "estop",

            "nút emergency",
            "nút dừng khẩn cấp",
            "dừng khẩn cấp",

            "safety relay",
            "relay safety",
            "safety controller",
            "safety plc",

            "safety circuit",
            "safety switch",
            "safety sensor",

            "pnoz",
            "pnoz x",
            "pnozmulti",

            "s1um",

            "light curtain",
            "safety light",

            "overspeed",
            "quá tốc",
            "qua toc",

            "overspeed switch",
            "emergency switch"
        ]
    },


    // ========================================================
    // 5. ĐIỆN ĐIỀU KHIỂN
    // ========================================================

    {
        category: "Điện điều khiển",

        priority: 85,

        keywords: [

            // ------------------------------------------------
            // Công tắc
            // ------------------------------------------------

            "công tắc",
            "cong tac",

            "switch",
            "sw ",

            "selector switch",
            "control switch",

            "sw bước tốc độ",
            "sw bật/tắt bơm phanh",
            "sw chọn scr truyền động",
            "sw chọn chế độ truyền động",
            "sw hướng truyền động",
            "sw kiểm tra điện áp",
            "sw làm nóng nước làm mát",
            "sw phóng cabin",
            "sw đèn chiếu sáng tuyến",

            // ------------------------------------------------
            // Chìa khóa điều khiển
            // ------------------------------------------------

            "chìa khóa",
            "chia khoa",

            "key switch",
            "key selector",

            "chìa khóa chọn chế độ vận hành",

            "chìa khóa hệ thống phụ trợ sẵn sàng",
            "auxiliary ready",
            "auxilary ready",

            "chìa khóa test mode",
            "test mode",

            "chìa khóa bỏ qua",
            "bỏ qua nút stop",
            "bỏ qua quá tốc",
            "bỏ qua thay đổi lực căng",
            "bỏ qua vị trí dây cáp",

            // ------------------------------------------------
            // Nút nhấn
            // ------------------------------------------------

            "nút nhấn",
            "nut nhan",

            "nút bắt đầu",
            "nút bắt đầu chạy",

            "nút dừng",
            "nút dừng stop",

            "nút kiểm tra",
            "nút kiểm tra đèn",

            "push button",
            "pushbutton",
            "start button",
            "stop button",

            // ------------------------------------------------
            // Relay
            // ------------------------------------------------

            "relay",
            "rơ le",
            "ro le",

            "relay omron",
            "omron relay",

            "relay plc",
            "plc-bsc",

            "relay bảo vệ",
            "relay bảo vệ cao thấp áp",

            // ------------------------------------------------
            // Optocoupler
            // ------------------------------------------------

            "optocoupler",
            "opto coupler",
            "opto-coupler",
            "optoisolator",

            // ------------------------------------------------
            // Điện trở
            // ------------------------------------------------

            "điện trở",
            "dien tro",
            "resistor",

            "fp1",
            "wid 10",
            "widwind",

            // ------------------------------------------------
            // Cầu chì
            // ------------------------------------------------

            "cầu chì",
            "cau chi",
            "fuse",

            "liner 4863",
            "4863.063",

            // ------------------------------------------------
            // RCCB / CB
            // ------------------------------------------------

            "rccb",
            "rcbo",
            "mccb",
            "circuit breaker",
            "breaker",

            // ------------------------------------------------
            // Đồng hồ đo
            // ------------------------------------------------

            "đồng hồ",
            "dong ho",

            "ammeter",
            "voltmeter",
            "current meter",
            "voltage meter",

            "armature current",
            "line current",
            "tower fault",

            "đồng hồ điện áp",
            "đồng hồ điện áp 3 pha",
            "đồng hồ điện áp acquy",

            // ------------------------------------------------
            // Đèn / chỉ thị
            // ------------------------------------------------

            "đèn cảnh báo",
            "den canh bao",

            "đèn điện thoại",
            "den dien thoai",

            "light test",
            "telephone lamp",
            "phone lamp",

            // ------------------------------------------------
            // Total trip / điều khiển
            // ------------------------------------------------

            "total trip",

            // ------------------------------------------------
            // Thiết bị đóng cắt / đầu nối
            // ------------------------------------------------

            "ổ cắm",
            "o cam",

            "terminal",
            "terminal block",
            "connector",

            "contact",
            "contactor",

            // ------------------------------------------------
            // Thiết bị tín hiệu
            // ------------------------------------------------

            "signals",
            "signal",
            "fs-signals",
            "fs signals",
            "signals dst",

            // ------------------------------------------------
            // DDW nếu không match truyền thông
            // KHÔNG thêm ddw-100 ở đây
            // ------------------------------------------------
        ]
    },


    // ========================================================
    // 6. CẢM BIẾN
    // ========================================================

    {
        category: "Cảm biến",

        priority: 80,

        keywords: [

            "cảm biến",
            "cam bien",
            "sensor",

            "proximity sensor",
            "proximity",

            "photoelectric",
            "photo sensor",

            "limit switch",
            "limit sensor",

            "pressure sensor",
            "pressure switch",

            "temperature sensor",
            "temperature switch",

            "pt100",
            "pt-100",

            "thermocouple",

            "encoder",
            "resolver",

            "speed sensor",
            "speed switch",

            "position sensor",
            "position switch",

            "level sensor",
            "level switch",

            "flow sensor",
            "flow switch",

            "current sensor",
            "voltage sensor",

            "load cell",

            "tension sensor",
            "cable tension sensor",

            "mcr-t/ui-e pt100",
            "mcr-c-ui/ui450dci",
            "mcr-s-10/50-ui-sw"
        ]
    },


    // ========================================================
    // 7. ĐỘNG CƠ
    // ========================================================

    {
        category: "Động cơ",

        priority: 75,

        keywords: [

            "động cơ",
            "dong co",
            "motor",

            "electric motor",
            "motor drive",

            "brake motor",
            "brake motor",

            "gear motor",
            "gearmotor",

            "servo motor",
            "servo",

            "induction motor",

            "ac motor",
            "dc motor",

            "motor cooling",
            "cooling motor",

            "fan motor",

            "main motor",
            "động cơ chính",

            "động cơ phanh",
            "động cơ làm mát",

            "m1",
            "m2"
        ]
    },


    // ========================================================
    // 8. NGUỒN
    // ========================================================

    {
        category: "Nguồn",

        priority: 70,

        keywords: [

            "nguồn",
            "nguon",

            "power supply",
            "power supply unit",
            "power unit",

            "psu",

            "24v",
            "24 v",
            "24vdc",
            "24 vdc",

            "230vac",
            "230 vac",

            "110vac",
            "110 vac",

            "400vac",
            "400 vac",

            "converter",
            "bộ chuyển nguồn",
            "bộ chuyển đổi nguồn",

            "power converter",

            "battery",
            "acquy",
            "ắc quy",

            "charger",
            "battery charger",
            "bộ sạc",

            "victron",

            "pss ps 24v"
        ]
    },


    // ========================================================
    // 9. TRUYỀN THÔNG
    // ========================================================

    {
        category: "Truyền thông",

        priority: 65,

        keywords: [

            "truyền thông",
            "truyen thong",

            "communication",

            "communications",

            "network",

            "networking",

            "ethernet",

            "ethernet switch",
            "ethernet hub",

            "industrial ethernet",

            "switch network",
            "network switch",

            "hub",

            "phoenix contact hub",
            "phoenix contact",

            "hub 8",

            // DDW-100
            "ddw-100",
            "ddw100",
            "ddw",

            "shdsl",
            "ethernet extender",
            "ethernet bridge",

            "modem",
            "communication modem",

            "plc modem",

            "profibus",
            "profinet",
            "modbus",
            "modbus tcp",
            "modbus rtu",

            "can bus",
            "canbus",

            "rs232",
            "rs485",

            "fiber optic",
            "optical fiber",

            "switch công nghiệp",
            "switch cong nghiep"
        ]
    },


    // ========================================================
    // 10. CHỐNG SÉT
    // ========================================================

    {
        category: "Chống sét",

        priority: 92,

        keywords: [

            "chống sét",
            "chong set",

            "surge protection",
            "surge protector",
            "surge arrester",
            "surge arrestor",

            "lightning protection",
            "lightning arrester",

            "spd",

            "thiết bị chống sét",
            "bo chống sét",
            "bộ chống sét",

            "bls",
            "blscha",
            "blschas2",

            "bls-chas2",

            "overvoltage protection",
            "transient protection"
        ]
    },


    // ========================================================
    // 11. KHÁC
    // ========================================================
    //
    // KHÔNG dùng keyword ở đây.
    //
    // Nếu thiết bị không match bất kỳ rule nào,
    // classifier sẽ tự đưa về "Khác".
    //
    // Không nên thêm:
    //
    // {
    //     category: "Khác",
    //     priority: 1,
    //     keywords: ["..."]
    // }
    //
    // vì sẽ làm rule "Khác" bắt thiết bị trước khi
    // các rule chuyên ngành xử lý.
    //
    // ========================================================
];