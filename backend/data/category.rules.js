// ============================================================
// CATEGORY RULES
// Asset Lifecycle Management
// ============================================================
//
// Mục đích:
// - Tự động phân loại thiết bị
// - Ưu tiên nhận diện theo nhóm chuyên ngành
// - Hạn chế thiết bị rơi vào "Khác"
// - Không dùng rule "Khác" để bắt thiết bị
//
// PRIORITY:
// Số càng lớn => ưu tiên càng cao
//
// Thứ tự ưu tiên thực tế:
// 1. Biến tần
// 2. An toàn
// 3. Chống sét
// 4. BECKHOFF
// 5. Nguồn
// 6. Truyền thông
// 7. PLC
// 8. Cảm biến
// 9. Điện điều khiển
// 10. Động cơ
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
    // 2. AN TOÀN
    // ========================================================

    {
        category: "An toàn",
        priority: 99,

        keywords: [

            "an toàn",
            "an toan",

            "safety",

            // Emergency
            "emergency stop",
            "emergency-stop",
            "emerg stop",
            "emergency",
            "e-stop",
            "estop",

            "nút emergency",
            "nút dừng khẩn cấp",
            "dừng khẩn cấp",

            // Safety relay
            "safety relay",
            "relay safety",

            "safety controller",
            "safety circuit",
            "safety switch",
            "safety sensor",

            // Pilz Safety
            "pnoz",
            "pnoz x",
            "pnozmulti",
            "pnozmulti",

            "s1um",

            // Safety PLC
            "safety plc",

            // Safety relay cụ thể
            "sf4-b1",
            "sf4-b1-ac/dc",
            "sf4-b1-ac",

            // Overspeed
            "overspeed",
            "quá tốc",
            "qua toc",

            "overspeed switch",

            // Emergency switch
            "emergency switch",

            // Safety equipment
            "light curtain",
            "safety light",

            // Còi cảnh báo
            "còi",
            "coi",
            "còi báo",
            "coi bao",

            // Thiết bị cảnh báo
            "đèn cảnh báo",
            "den canh bao"
        ]
    },


    // ========================================================
    // 3. CHỐNG SÉT
    // ========================================================

    {
        category: "Chống sét",
        priority: 98,

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
    // 4. BECKHOFF
    // ========================================================

    {
        category: "BECKHOFF",
        priority: 97,

        keywords: [

            "beckhoff",

            "beckhoff plc",
            "beckhoff cpu",
            "beckhoff module",

            "cx",
            "cx9020",
            "cx5120",
            "cx5140",

            "ethercat",
            "ethercat coupler",
            "ethercat module",
            "ethercat terminal",

            "ek",
            "el",
            "ep"
        ]
    },


    // ========================================================
    // 5. NGUỒN
    // ========================================================

    {
        category: "Nguồn",
        priority: 96,

        keywords: [

            "nguồn",
            "nguon",

            "power supply",
            "power supply unit",
            "power unit",

            "psu",

            // Điện áp nguồn
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

            // Bộ chuyển nguồn
            "converter",
            "bộ chuyển nguồn",
            "bo chuyen nguon",

            "bộ chuyển đổi nguồn",
            "bo chuyen doi nguon",

            "power converter",

            // Acquy
            "battery",
            "acquy",
            "ắc quy",

            // Bộ sạc
            "charger",
            "battery charger",
            "bộ sạc",
            "bo sac",

            "victron",

            // Pilz Power Supply
            "pss ps 24v",

            // Mã nguồn
            "vtm23wc24",
            "24vdc vtm23wc24"
        ]
    },


    // ========================================================
    // 6. TRUYỀN THÔNG
    // ========================================================

    {
        category: "Truyền thông",
        priority: 95,

        keywords: [

            "truyền thông",
            "truyen thong",

            "communication",
            "communications",

            "network",
            "networking",

            "ethernet",
            "industrial ethernet",

            "ethernet switch",
            "ethernet hub",

            "network switch",
            "switch network",

            "switch công nghiệp",
            "switch cong nghiep",

            // Hub
            "hub",
            "hub 8",

            "phoenix contact hub",
            "phoenix contact",

            // DDW
            "ddw-100",
            "ddw100",
            "ddw",

            // SHDSL
            "shdsl",

            // Ethernet devices
            "ethernet extender",
            "ethernet bridge",

            // Modem
            "modem",
            "communication modem",
            "plc modem",
            "plc - modem",

            // Protocol
            "profibus",
            "profinet",
            "modbus",
            "modbus tcp",
            "modbus rtu",

            "can bus",
            "canbus",

            "rs232",
            "rs485",

            // Fiber
            "fiber optic",
            "optical fiber"
        ]
    },


    // ========================================================
    // 7. PLC
    // ========================================================

    {
        category: "PLC",
        priority: 94,

        keywords: [

            "plc",
            "p l c",
            "programmable logic controller",

            // Pilz PLC
            "pilz",

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

            // PLC module
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

            // Siemens
            "simatic",
            "s7-1200",
            "s7-1500",
            "s7-300",
            "s7-400",

            // Allen Bradley
            "allen bradley",
            "compactlogix",
            "controllogix",
            "micrologix",

            // Schneider
            "modicon",
            "m340",
            "m580",
            "twido",

            // Omron
            "omron plc",
            "cj1",
            "cj2",
            "nx plc",
            "cp1",

            // Phoenix PLC
            "phoenix contact plc",
            "axioline"
        ]
    },


    // ========================================================
    // 8. CẢM BIẾN
    // ========================================================

    {
        category: "Cảm biến",
        priority: 93,

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

            // MCR
            "mcr-t/ui-e pt100",
            "mcr-c-ui/ui450dci",
            "mcr-s-10/50-ui-sw"
        ]
    },


    // ========================================================
    // 9. ĐIỆN ĐIỀU KHIỂN
    // ========================================================

    {
        category: "Điện điều khiển",
        priority: 90,

        keywords: [

            // ------------------------------------------------
            // Biến trở / Chiết áp
            // ------------------------------------------------

            "biến trở",
            "bien tro",

            "chiết áp",
            "chiet ap",

            "chiết áp hiệu chỉnh tốc độ",
            "chiet ap hieu chinh toc do",

            "biến trở tốc độ",
            "bien tro toc do",

            "potentiometer",

            "speed potentiometer",
            "speed adjustment",

            // ------------------------------------------------
            // Bộ điều khiển
            // ------------------------------------------------

            "bộ điều khiển",
            "bo dieu khien",

            "bộ điều khiển chạy cứu hộ",
            "bo dieu khien chay cuu ho",

            "màn hình điều khiển",
            "man hinh dieu khien",

            "control panel",
            "control display",

            // ------------------------------------------------
            // Công tắc
            // ------------------------------------------------

            "công tắc",
            "cong tac",

            "switch",

            "selector switch",
            "control switch",

            "sw bước tốc độ",
            "sw bật/tắt bơm phanh",
            "sw chọn scr truyền động",
            "sw chọn chế độ truyền động",
            "sw hướng truyền động",
            "sw kiểm tra điện áp",
            "sw làm nóng nước làm mát",
            "sw làm nóng nước làm mát đcch",
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
            "chia khoa bo qua",

            "bỏ qua nút stop",
            "bo qua nut stop",

            "bỏ qua thay đổi lực căng",
            "bo qua thay doi luc cang",

            "bỏ qua vị trí dây cáp",
            "bo qua vi tri day cap",

            // ------------------------------------------------
            // Nút nhấn
            // ------------------------------------------------

            "nút nhấn",
            "nut nhan",

            "nút bắt đầu",
            "nut bat dau",

            "nút bắt đầu chạy",
            "nut bat dau chay",

            "nút dừng",
            "nut dung",

            "nút dừng stop",
            "nut dung stop",

            "nút kiểm tra",
            "nut kiem tra",

            "nút kiểm tra đèn",
            "nut kiem tra den",

            "push button",
            "pushbutton",

            "start button",
            "stop button",

            // ------------------------------------------------
            // Relay điều khiển
            // ------------------------------------------------

            "relay",

            "rơ le",
            "ro le",

            "relay omron",
            "omron relay",

            "relay plc",
            "plc-bsc",

            "relay bảo vệ",
            "relay bao ve",

            "relay bảo vệ cao thấp áp",

            // Relay nhiệt
            "rơ le nhiệt",
            "ro le nhiet",

            "role nhiệt",
            "role nhiet",

            "thermal relay",
            "thermal overload",

            "3rv",
            "3rv1021",

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
            // CB / MCB / RCCB / MCCB
            // ------------------------------------------------

            "mcb",
            "mc b",

            "rccb",
            "rcbo",
            "mccb",

            "circuit breaker",
            "breaker",

            "5sy",
            "5sy6104",
            "5sy6106",
            "5sy6110",
            "5sy6116",
            "5sy6140",
            "5sy6302",

            "s5y6110",

            "5st301",
            "5st301 as",

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
            "dong ho dien ap",

            "đồng hồ điện áp 3 pha",
            "dong ho dien ap 3 pha",

            "đồng hồ điện áp acquy",
            "dong ho dien ap acquy",

            // ------------------------------------------------
            // Đèn / chỉ thị
            // ------------------------------------------------

            "đèn điện thoại",
            "den dien thoai",

            "light test",
            "telephone lamp",
            "phone lamp",

            // ------------------------------------------------
            // Total trip
            // ------------------------------------------------

            "total trip",

            // ------------------------------------------------
            // Ổ cắm / đầu nối
            // ------------------------------------------------

            "ổ cắm",
            "o cam",

            "terminal",
            "terminal block",

            "connector",

            "contact",
            "contactor",

            // ------------------------------------------------
            // Tín hiệu
            // ------------------------------------------------

            "signals",
            "signal",

            "fs-signals",
            "fs signals",
            "signals dst"
        ]
    },


    // ========================================================
    // 10. ĐỘNG CƠ
    // ========================================================

    {
        category: "Động cơ",
        priority: 80,

        keywords: [

            "động cơ",
            "dong co",

            "motor",
            "electric motor",

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
            "dong co chinh",

            "động cơ phanh",
            "dong co phanh",

            "động cơ làm mát",
            "dong co lam mat"
        ]
    },


    // ========================================================
    // 11. KHÁC
    // ========================================================
    //
    // Không khai báo keyword.
    //
    // Classifier phải tự fallback về:
    //
    //     "Khác"
    //
    // khi không match rule nào.
    //
    // ========================================================
];