// =======================================
// Category Alias Library
// Chuẩn hóa các cách gọi khác nhau về một
// từ khóa (canonical token).
//
// Không chứa:
// - Model
// - Manufacturer
// - Score
// - Regex
// =======================================

module.exports = {

    // =====================================================
    // DRIVE / INVERTER
    // =====================================================

    "frequency converter": "drive",
    "variable frequency drive": "drive",
    "variable speed drive": "drive",
    "ac drive": "drive",
    "motor drive": "drive",
    "vf drive": "drive",
    "vfd": "drive",
    "inverter": "drive",
    "drive inverter": "drive",

    // =====================================================
    // PLC
    // =====================================================

    "programmable logic controller": "plc",
    "logic controller": "plc",
    "controller": "plc",

    "cpu module": "cpu",
    "processor module": "cpu",

    // =====================================================
    // SAFETY
    // =====================================================

    "e-stop": "emergency stop",
    "estop": "emergency stop",
    "emg stop": "emergency stop",
    "emergency push button": "emergency stop",

    "safety relay": "safety relay",
    "safety controller": "safety controller",

    "guard switch": "safety switch",
    "safety switch": "safety switch",
    "interlock switch": "safety switch",

    "light curtain": "light curtain",

    // =====================================================
    // ELECTRICAL CONTROL
    // =====================================================

    "miniature circuit breaker": "mcb",
    "circuit breaker": "mcb",

    "molded case circuit breaker": "mccb",

    "earth leakage relay": "elr",
    "earth leakage breaker": "elcb",

    "magnetic contactor": "contactor",
    "ac contactor": "contactor",

    "thermal overload relay": "olr",
    "overload relay": "olr",

    "selector switch": "selector",

    "key switch": "key",

    "push button": "button",
    "pushbutton": "button",

    "indicator lamp": "lamp",
    "pilot lamp": "lamp",
    "signal lamp": "lamp",
    "led lamp": "lamp",

    "power supply": "psu",
    "switching power supply": "psu",
    "24vdc power supply": "psu",
    "24v power supply": "psu",
    "dc power supply": "psu",
    "ac/dc power supply": "psu",
    "smps": "psu",

    "potentiometer": "variable resistor",

    "terminal block": "terminal",

    // =====================================================
    // SENSOR
    // =====================================================

    "photo sensor": "photoelectric",
    "photoelectric sensor": "photoelectric",

    "proximity sensor": "proximity",
    "inductive proximity sensor": "proximity",

    "inductive sensor": "inductive",

    "limit switch": "limit switch",

    "laser sensor": "laser",

    "magnetic sensor": "magnetic",

    "rotary encoder": "encoder",
    "absolute encoder": "encoder",
    "incremental encoder": "encoder",

    // =====================================================
    // MOTOR
    // =====================================================

    "electric motor": "motor",
    "induction motor": "motor",
    "gear motor": "motor",
    "geared motor": "motor",
    "gearbox motor": "motor",
    "brake motor": "motor",

    "servo motor": "servo",

    "cooling fan": "fan",

    // =====================================================
    // COMMUNICATION
    // =====================================================

    "ethernet switch": "network switch",
    "industrial ethernet switch": "network switch",

    "media converter": "converter",
    "fiber converter": "converter",
    "protocol converter": "converter",
    "rs485 converter": "converter",

    "profinet": "ethernet",
    "ethernet/ip": "ethernet",

    "profibus": "fieldbus",

    "modbus tcp": "modbus",
    "modbus rtu": "modbus",

    "can bus": "canopen",
    "can-bus": "canopen",

    // =====================================================
    // HMI
    // =====================================================

    "operator panel": "hmi",
    "touch panel": "hmi",
    "touch screen": "hmi",

    // =====================================================
    // POWER
    // =====================================================

    "ups system": "ups",
    "uninterruptible power supply": "ups",

    "battery charger": "charger",

    "transformer": "transformer",

    // =====================================================
    // PNEUMATIC
    // =====================================================

    "solenoid valve": "valve",

    "air cylinder": "cylinder",

    "pressure regulator": "regulator"

};
