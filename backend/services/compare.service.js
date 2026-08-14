const {
    parseDate,
    sameDate
} = require("../utils/date");

const {
    normalize
} = require("../utils/normalize");


// =====================================================
// HEADER HELPER
// =====================================================

function normalizeHeader(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return normalize(
        String(value)
            .replace(/^\uFEFF/, "")
            .trim()
    );

}


// =====================================================
// LẤY GIÁ TRỊ THEO NHIỀU HEADER
// =====================================================

function getFlexible(
    row,
    aliases = []
) {

    if (
        !row ||
        typeof row !== "object"
    ) {
        return "";
    }

    const keys =
        Object.keys(row);

    const headerMap =
        new Map();


    // ---------------------------------------------
    // MAP HEADER
    // ---------------------------------------------

    for (const key of keys) {

        const normalizedKey =
            normalizeHeader(key);

        if (
            !headerMap.has(
                normalizedKey
            )
        ) {

            headerMap.set(
                normalizedKey,
                key
            );

        }

    }


    // ---------------------------------------------
    // TÌM ALIAS
    // ---------------------------------------------

    for (
        const alias
        of aliases
    ) {

        const normalizedAlias =
            normalizeHeader(alias);

        const realKey =
            headerMap.get(
                normalizedAlias
            );

        if (
            realKey !== undefined &&
            row[realKey] !== undefined &&
            row[realKey] !== null
        ) {

            const value =
                row[realKey];

            if (
                String(value)
                    .trim() !== ""
            ) {

                return value;

            }

        }

    }

    return "";

}


// =====================================================
// CHUẨN HÓA TEXT
// =====================================================

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)

        // -----------------------------------------
        // Xuống dòng
        // -----------------------------------------

        .replace(/\r\n/g, " ")
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")

        // -----------------------------------------
        // Nhiều khoảng trắng
        // -----------------------------------------

        .replace(/\s+/g, " ")

        .trim();

}


// =====================================================
// CHUẨN HÓA DEVICE KEY
//
// Device Key là khóa thật trong DB.
// Không tạo lại.
// Không thay đổi.
// Chỉ dùng để match.
// =====================================================

function normalizeDeviceKey(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim();

}


// =====================================================
// CHUẨN HÓA STATUS
//
// Mục đích:
//
// DB:
// Running
//
// Excel:
// Đang hoạt động
//
// => phải coi là giống nhau.
//
// =====================================================

function normalizeStatus(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const text =
        cleanText(value);

    if (!text) {
        return "";
    }

    const normalized =
        normalize(text);


    // =================================================
    // ĐANG SỬ DỤNG / ACTIVE / RUNNING
    // =================================================

    if (
        [
            "active",
            "running",
            "run",
            "operating",
            "working",

            "dang su dung",
            "dang hoat dong",
            "hoat dong",
            "dang chay",
            "dang van hanh",

            "active device",
            "in service"
        ].includes(normalized)
    ) {

        return "active";

    }


    // =================================================
    // BẢO TRÌ
    // =================================================

    if (
        [
            "maintenance",
            "maintain",
            "service",
            "under maintenance",

            "dang bao tri",
            "bao tri",
            "dang sua chua",
            "sua chua"
        ].includes(normalized)
    ) {

        return "maintenance";

    }


    // =================================================
    // LỖI
    // =================================================

    if (
        [
            "fault",
            "error",
            "failed",
            "failure",

            "loi",
            "bi loi",
            "hong",
            "su co"
        ].includes(normalized)
    ) {

        return "fault";

    }


    // =================================================
    // OFFLINE
    // =================================================

    if (
        [
            "offline",
            "disconnect",
            "disconnected",
            "not connected",

            "mat ket noi",
            "ngat ket noi",
            "khong ket noi"
        ].includes(normalized)
    ) {

        return "offline";

    }


    // =================================================
    // MỚI
    // =================================================

    if (
        [
            "new",
            "moi",
            "thiet bi moi"
        ].includes(normalized)
    ) {

        return "new";

    }


    // =================================================
    // GIÁ TRỊ KHÁC
    // =================================================

    return normalized;

}

// =====================================================
// SO SÁNH STATUS
// =====================================================

function sameStatus(
    a,
    b
) {

    return (
        normalizeStatus(a) ===
        normalizeStatus(b)
    );

}


// =====================================================
// COMPARE KEY
//
// Ưu tiên:
//
// Tuyến + Nhà ga + Khu vực + Ký hiệu
//
// Nếu không có Ký hiệu:
//
// Tuyến + Nhà ga + Khu vực + Tên
// =====================================================

function makeCompareKey(
    line,
    station,
    area,
    code,
    name
) {

    const normalizedLine =
        normalize(
            cleanText(line)
        );

    const normalizedStation =
        normalize(
            cleanText(station)
        );

    const normalizedArea =
        normalize(
            cleanText(area)
        );

    const normalizedCode =
        normalize(
            cleanText(code)
        );

    const normalizedName =
        normalize(
            cleanText(name)
        );


    // ---------------------------------------------
    // CÓ KÝ HIỆU
    // ---------------------------------------------

    if (
        normalizedCode
    ) {

        return [

            normalizedLine,

            normalizedStation,

            normalizedArea,

            normalizedCode

        ].join("_");

    }


    // ---------------------------------------------
    // KHÔNG CÓ KÝ HIỆU
    // ---------------------------------------------

    return [

        normalizedLine,

        normalizedStation,

        normalizedArea,

        normalizedName

    ].join("_");

}


// =====================================================
// KIỂM TRA DÒNG EXCEL RỖNG
// =====================================================

function isEmptyExcelRow(
    row
) {

    if (
        !row ||
        typeof row !== "object"
    ) {

        return true;

    }

    const values =
        Object.values(row);

    if (
        values.length === 0
    ) {

        return true;

    }

    return values.every(
        value => {

            return (
                value === null ||
                value === undefined ||
                String(value).trim() === ""
            );

        }
    );

}


// =====================================================
// PARSE EXCEL ROW
// =====================================================

function parseExcelRow(
    row
) {

    // =================================================
    // DEVICE KEY
    // =================================================

    const deviceKey =
        getFlexible(
            row,
            [

                "Device Key",

                "DeviceKey",

                "deviceKey",

                "DEVICE KEY",

                "Device_Key",

                "Khóa thiết bị",

                "Khóa Device"

            ]
        );


    // =================================================
    // DEVICE ID
    // =================================================

    const deviceId =
        getFlexible(
            row,
            [

                "Mã ID",

                "Mã ID thiết bị",

                "Mã thiết bị",

                "Device ID",

                "DeviceID",

                "deviceId",

                "Device_Id",

                "ID thiết bị",

                "ID"

            ]
        );


    // =================================================
    // TÊN
    // =================================================

    const name =
        getFlexible(
            row,
            [

                "Tên thiết bị",

                "Tên thiết bị ",

                "Tên",

                "Tên TB",

                "Tên máy",

                "Device Name",

                "DeviceName",

                "deviceName",

                "Name"

            ]
        );


    // =================================================
    // PHÂN LOẠI
    // =================================================

    const category =
        getFlexible(
            row,
            [

                "Phân loại",

                "Phân Loại",

                "Category",

                "category",

                "Loại thiết bị"

            ]
        );


    // =================================================
    // TUYẾN
    // =================================================

    const line =
        getFlexible(
            row,
            [

                "Tuyến",

                "Tuyến cáp",

                "Line",

                "line",

                "Cable Line"

            ]
        );


    // =================================================
    // NHÀ GA
    // =================================================

    const station =
        getFlexible(
            row,
            [

                "Nhà ga",

                "Ga",

                "Station",

                "station",

                "Ga cáp treo"

            ]
        );


    // =================================================
    // KÝ HIỆU
    // =================================================

    const code =
        getFlexible(
            row,
            [

                "Ký hiệu",

                "Kí hiệu",

                "Mã ký hiệu",

                "Code",

                "code",

                "Symbol",

                "Mã thiết bị"

            ]
        );


    // =================================================
    // KHU VỰC
    // =================================================

    const area =
        getFlexible(
            row,
            [

                "Khu vực",

                "Khu Vực",

                "Area",

                "area",

                "Vị trí",

                "Khu vực lắp đặt"

            ]
        );


    // =================================================
    // TRẠNG THÁI
    // =================================================

    const status =
        getFlexible(
            row,
            [

                "Trạng thái",

                "Trạng Thái",

                "Status",

                "status",

                "Tình trạng"

            ]
        );


    // =================================================
    // NGÀY LẮP
    // =================================================

    const rawInstallDate =
        getFlexible(
            row,
            [

                "Ngày lắp",

                "Ngày lắp đặt",

                "Install Date",

                "InstallDate",

                "installDate"

            ]
        );


    // =================================================
    // BẢO DƯỠNG
    // =================================================

    const rawLastMaintenance =
        getFlexible(
            row,
            [

                "Bảo dưỡng gần nhất",

                "Ngày bảo dưỡng gần nhất",

                "Last Maintenance",

                "LastMaintenance",

                "lastMaintenance"

            ]
        );


    // =================================================
    // NGÀY THAY THẾ
    // =================================================

    const rawReplacementDate =
        getFlexible(
            row,
            [

                "Ngày thay thế",

                "Ngày thay",

                "Replacement Date",

                "ReplacementDate",

                "replacementDate"

            ]
        );


    // =================================================
    // TUỔI THỌ
    // =================================================

    const rawLifespan =
        getFlexible(
            row,
            [

                "Tuổi thọ",

                "Thời gian sử dụng",

                "Lifespan",

                "lifespan",

                "Life Span"

            ]
        );


    // =================================================
    // NGÀY HẾT HẠN
    // =================================================

    const rawExpiryDate =
        getFlexible(
            row,
            [

                "Ngày hết hạn",

                "Ngày hết hạn sử dụng",

                "Ngày hết tuổi thọ",

                "Expiry Date",

                "ExpiryDate",

                "expiryDate"

            ]
        );


    // =================================================
    // PARSE DATE
    // =================================================

    const installDate =
        parseDate(
            rawInstallDate
        );

    const lastMaintenance =
        parseDate(
            rawLastMaintenance
        );

    const replacementDate =
        parseDate(
            rawReplacementDate
        );

    const expiryDate =
        parseDate(
            rawExpiryDate
        );


    // =================================================
    // LIFESPAN
    // =================================================

    const lifespan =
        rawLifespan === "" ||
            rawLifespan === null ||
            rawLifespan === undefined

            ? 0

            : Number(
                rawLifespan
            ) || 0;


    // =================================================
    // RETURN
    // =================================================

    return {

        deviceKey:
            deviceKey === "" ||
                deviceKey === null ||
                deviceKey === undefined

                ? null

                : normalizeDeviceKey(
                    deviceKey
                ),

        deviceId:
            deviceId === "" ||
                deviceId === null ||
                deviceId === undefined

                ? null

                : cleanText(
                    deviceId
                ),

        name:
            cleanText(
                name
            ),

        category:
            cleanText(
                category
            ),

        line:
            cleanText(
                line
            ),

        station:
            cleanText(
                station
            ),

        code:
            cleanText(
                code
            ),

        area:
            cleanText(
                area
            ),

        status:
            normalizeStatus(
                status
            ),
            
        installDate,

        lastMaintenance,

        replacementDate,

        lifespan,

        expiryDate

    };

}


// =====================================================
// SO SÁNH TEXT
// =====================================================

function sameText(
    a,
    b
) {

    return (
        normalize(
            cleanText(a)
        ) ===
        normalize(
            cleanText(b)
        )
    );

}


// =====================================================
// SO SÁNH NUMBER
// =====================================================

function sameNumber(
    a,
    b
) {

    const numberA =
        Number(a);

    const numberB =
        Number(b);

    return (
        numberA ===
        numberB
    );

}


// =====================================================
// SO SÁNH DEVICE
// =====================================================

function compareDeviceFields(
    old,
    data
) {

    const changedFields = [];


    // =================================================
    // TÊN
    // =================================================

    if (
        !sameText(
            old.name,
            data.name
        )
    ) {

        changedFields.push(
            "Tên thiết bị"
        );

    }


    // =================================================
    // PHÂN LOẠI
    // =================================================

    if (
        !sameText(
            old.category,
            data.category
        )
    ) {

        changedFields.push(
            "Phân loại"
        );

    }


    // =================================================
    // TUYẾN
    // =================================================

    if (
        !sameText(
            old.line,
            data.line
        )
    ) {

        changedFields.push(
            "Tuyến"
        );

    }


    // =================================================
    // NHÀ GA
    // =================================================

    if (
        !sameText(
            old.station,
            data.station
        )
    ) {

        changedFields.push(
            "Nhà ga"
        );

    }


    // =================================================
    // KHU VỰC
    // =================================================

    if (
        !sameText(
            old.area,
            data.area
        )
    ) {

        changedFields.push(
            "Khu vực"
        );

    }


    // =================================================
    // KÝ HIỆU
    // =================================================

    if (
        !sameText(
            old.code,
            data.code
        )
    ) {

        changedFields.push(
            "Ký hiệu"
        );

    }


    // =================================================
    // DEVICE ID
    // =================================================

    if (
        !sameText(
            old.deviceId,
            data.deviceId
        )
    ) {

        changedFields.push(
            "Mã ID"
        );

    }


    // =================================================
    // STATUS
    //
    // QUAN TRỌNG:
    //
    // Không dùng sameText().
    //
    // Dùng sameStatus() để:
    //
    // Running
    // =
    // Đang hoạt động
    // =================================================

    if (
        data.status &&
        !sameStatus(
            old.status,
            data.status
        )
    ) {

        changedFields.push(
            "Trạng thái"
        );
    }

    // =================================================
    // NGÀY LẮP
    // =================================================

    if (
        !sameDate(
            old.installDate,
            data.installDate
        )
    ) {

        changedFields.push(
            "Ngày lắp"
        );

    }


    // =================================================
    // BẢO DƯỠNG
    // =================================================

    if (
        !sameDate(
            old.lastMaintenance,
            data.lastMaintenance
        )
    ) {

        changedFields.push(
            "Bảo dưỡng gần nhất"
        );

    }


    // =================================================
    // NGÀY THAY THẾ
    // =================================================

    if (
        !sameDate(
            old.replacementDate,
            data.replacementDate
        )
    ) {

        changedFields.push(
            "Ngày thay thế"
        );

    }


    // =================================================
    // TUỔI THỌ
    // =================================================

    if (
        !sameNumber(
            old.lifespan,
            data.lifespan
        )
    ) {

        changedFields.push(
            "Tuổi thọ"
        );

    }


    // =================================================
    // NGÀY HẾT HẠN
    // =================================================

    if (
        !sameDate(
            old.expiryDate,
            data.expiryDate
        )
    ) {

        changedFields.push(
            "Ngày hết hạn"
        );

    }


    return changedFields;

}


// =====================================================
// COMPARE ROWS
// =====================================================

async function compareRows(
    prisma,
    rows
) {

    // =================================================
    // 1. LẤY TOÀN BỘ DEVICE
    // =================================================

    const devices =
        await prisma.device.findMany({

            select: {

                id: true,

                deviceId: true,

                deviceKey: true,

                name: true,

                category: true,

                line: true,

                station: true,

                code: true,

                area: true,

                status: true,

                originalInstallDate: true,

                installDate: true,

                lastMaintenance: true,

                replacementDate: true,

                lifespan: true,

                expiryDate: true

            }

        });


    // =================================================
    // 2. DEVICE KEY MAP
    // =================================================

    const deviceKeyMap =
        new Map();

    const duplicateDeviceKeys =
        new Set();


    for (
        const device
        of devices
    ) {

        if (
            !device.deviceKey
        ) {

            continue;

        }


        const key =
            normalizeDeviceKey(
                device.deviceKey
            );


        if (
            !key
        ) {

            continue;

        }


        if (
            deviceKeyMap.has(
                key
            )
        ) {

            duplicateDeviceKeys.add(
                key
            );

        }
        else {

            deviceKeyMap.set(
                key,
                device
            );

        }

    }


    // =================================================
    // 3. DEVICE ID MAP
    //
    // Chỉ sử dụng Device ID nếu duy nhất.
    // =================================================

    const deviceIdMap =
        new Map();

    const duplicateDeviceIds =
        new Set();


    for (
        const device
        of devices
    ) {

        if (
            !device.deviceId
        ) {

            continue;

        }


        const key =
            normalize(
                cleanText(
                    device.deviceId
                )
            );


        if (
            !key
        ) {

            continue;

        }


        if (
            deviceIdMap.has(
                key
            )
        ) {

            duplicateDeviceIds.add(
                key
            );

        }
        else {

            deviceIdMap.set(
                key,
                device
            );

        }

    }


    // =================================================
    // 4. STRUCTURE MAP
    // =================================================

    const deviceMap =
        new Map();

    const duplicateDatabaseKeys =
        new Set();


    for (
        const device
        of devices
    ) {

        if (
            !device.line ||
            !device.station
        ) {

            continue;

        }


        const key =
            makeCompareKey(

                device.line,

                device.station,

                device.area,

                device.code,

                device.name

            );


        if (
            deviceMap.has(
                key
            )
        ) {

            duplicateDatabaseKeys.add(
                key
            );

        }
        else {

            deviceMap.set(
                key,
                device
            );

        }

    }


    // =================================================
    // COUNTER
    // =================================================

    let newCount =
        0;

    let updateCount =
        0;

    let skipCount =
        0;


    // =================================================
    // RESULT
    // =================================================

    const result =
        [];


    // =================================================
    // DUPLICATE TRONG EXCEL
    // =================================================

    const excelDeviceKeys =
        new Map();

    const excelDeviceIds =
        new Map();

    const excelStructureKeys =
        new Map();


    // =================================================
    // DUYỆT EXCEL
    // =================================================

    for (
        let index = 0;
        index < rows.length;
        index++
    ) {

        const row =
            rows[index];

        const excelRowNumber =
            index + 2;


        // =================================================
        // DÒNG TRỐNG
        // =================================================

        if (
            isEmptyExcelRow(
                row
            )
        ) {

            skipCount++;


            result.push({

                action:
                    "SKIP",

                reason:
                    "Dòng Excel trống",

                changedFields: [],

                matchedBy:
                    null,

                existingId:
                    null,

                row: {

                    deviceKey:
                        null,

                    deviceId:
                        null,

                    name:
                        "",

                    line:
                        "",

                    station:
                        "",

                    code:
                        "",

                    area:
                        ""

                }

            });


            continue;

        }


        // =================================================
        // PARSE
        // =================================================

        const data =
            parseExcelRow(
                row
            );


        // =================================================
        // LOG
        // =================================================

        console.log(
            `IMPORT ROW ${excelRowNumber}:`,
            {

                deviceKey:
                    data.deviceKey,

                deviceId:
                    data.deviceId,

                name:
                    data.name,

                line:
                    data.line,

                station:
                    data.station,

                area:
                    data.area,

                code:
                    data.code

            }
        );


        // =================================================
        // VALIDATION
        //
        // BẮT BUỘC:
        //
        // Tên
        // Tuyến
        // Nhà ga
        //
        // KHÔNG bắt buộc:
        //
        // Device Key
        // Device ID
        // Ký hiệu
        // Khu vực
        // =================================================

        const missingFields =
            [];


        if (
            !data.name
        ) {

            missingFields.push(
                "Tên thiết bị"
            );

        }


        if (
            !data.line
        ) {

            missingFields.push(
                "Tuyến"
            );

        }


        if (
            !data.station
        ) {

            missingFields.push(
                "Nhà ga"
            );

        }


        if (
            missingFields.length > 0
        ) {

            skipCount++;


            const reason =
                `Thiếu: ${missingFields.join(", ")}`;


            console.warn(
                `IMPORT SKIP - dòng ${excelRowNumber}:`,
                reason,
                data
            );


            result.push({

                action:
                    "SKIP",

                reason,

                changedFields: [],

                matchedBy:
                    null,

                existingId:
                    null,

                row:
                    data

            });


            continue;

        }


        // =================================================
        // TÌM THIẾT BỊ CŨ
        //
        // ƯU TIÊN:
        //
        // 1. DEVICE KEY
        // 2. DEVICE ID
        // 3. STRUCTURE KEY
        // =================================================

        let old =
            null;

        let matchedBy =
            null;


        // =================================================
        // 1. DEVICE KEY
        // =================================================

        if (
            data.deviceKey
        ) {

            const deviceKey =
                normalizeDeviceKey(
                    data.deviceKey
                );


            if (
                duplicateDeviceKeys.has(
                    deviceKey
                )
            ) {

                skipCount++;


                result.push({

                    action:
                        "SKIP",

                    reason:
                        "Device Key bị trùng trong database",

                    changedFields: [],

                    matchedBy:
                        "DEVICE_KEY_DUPLICATE",

                    existingId:
                        null,

                    row:
                        data

                });


                continue;

            }


            old =
                deviceKeyMap.get(
                    deviceKey
                );


            if (
                old
            ) {

                matchedBy =
                    "DEVICE_KEY";

            }

        }


        // =================================================
        // 2. DEVICE ID
        // =================================================

        if (
            !old &&
            data.deviceId
        ) {

            const deviceId =
                normalize(
                    cleanText(
                        data.deviceId
                    )
                );


            if (
                duplicateDeviceIds.has(
                    deviceId
                )
            ) {

                console.warn(
                    `DEVICE ID DUPLICATE - dòng ${excelRowNumber}:`,
                    data.deviceId
                );

            }
            else {

                old =
                    deviceIdMap.get(
                        deviceId
                    );


                if (
                    old
                ) {

                    matchedBy =
                        "DEVICE_ID";

                }

            }

        }


        // =================================================
        // 3. STRUCTURE KEY
        // =================================================

        const structureKey =
            makeCompareKey(

                data.line,

                data.station,

                data.area,

                data.code,

                data.name

            );


        if (
            !old
        ) {

            if (
                duplicateDatabaseKeys.has(
                    structureKey
                )
            ) {

                skipCount++;


                result.push({

                    action:
                        "SKIP",

                    reason:
                        "Database đang có nhiều thiết bị trùng Tuyến + Nhà ga + Khu vực + Ký hiệu/Tên",

                    changedFields: [],

                    matchedBy:
                        "STRUCTURE_DUPLICATE",

                    existingId:
                        null,

                    row:
                        data

                });


                continue;

            }


            old =
                deviceMap.get(
                    structureKey
                );


            if (
                old
            ) {

                matchedBy =
                    "STRUCTURE_KEY";

            }

        }


        // =================================================
        // 4. DUPLICATE DEVICE KEY TRONG EXCEL
        // =================================================

        if (
            data.deviceKey
        ) {

            const key =
                normalizeDeviceKey(
                    data.deviceKey
                );


            if (
                excelDeviceKeys.has(
                    key
                )
            ) {

                const firstRow =
                    excelDeviceKeys.get(
                        key
                    );


                skipCount++;


                result.push({

                    action:
                        "SKIP",

                    reason:
                        `Trùng Device Key trong file Excel với dòng ${firstRow}`,

                    changedFields: [],

                    matchedBy:
                        null,

                    existingId:
                        null,

                    row:
                        data

                });


                continue;

            }


            excelDeviceKeys.set(
                key,
                excelRowNumber
            );

        }


        // =================================================
        // 5. DEVICE ID TRONG EXCEL
        //
        // Chỉ cảnh báo.
        // Không chặn import.
        // =================================================

        if (
            data.deviceId
        ) {

            const key =
                normalize(
                    cleanText(
                        data.deviceId
                    )
                );


            if (
                excelDeviceIds.has(
                    key
                )
            ) {

                console.warn(
                    `DEVICE ID TRÙNG TRONG EXCEL:`,
                    data.deviceId
                );

            }
            else {

                excelDeviceIds.set(
                    key,
                    excelRowNumber
                );

            }

        }


        // =================================================
        // 6. STRUCTURE DUPLICATE TRONG EXCEL
        // =================================================

        if (
            excelStructureKeys.has(
                structureKey
            )
        ) {

            const firstRow =
                excelStructureKeys.get(
                    structureKey
                );


            /*
             * Chỉ chặn duplicate structure
             * khi dòng hiện tại KHÔNG có Device Key.
             *
             * Nếu có Device Key khác nhau:
             * cho phép tồn tại.
             */

            if (
                !data.deviceKey
            ) {

                skipCount++;


                result.push({

                    action:
                        "SKIP",

                    reason:
                        `Trùng thiết bị trong file Excel với dòng ${firstRow}`,

                    changedFields: [],

                    matchedBy:
                        null,

                    existingId:
                        null,

                    row:
                        data

                });


                continue;

            }

        }
        else {

            excelStructureKeys.set(
                structureKey,
                excelRowNumber
            );

        }


        // =================================================
        // 7. KHÔNG TÌM THẤY
        // =================================================

        if (
            !old
        ) {

            newCount++;


            result.push({

                action:
                    "NEW",

                changedFields: [],

                matchedBy:
                    null,

                existingId:
                    null,

                row:
                    data

            });


            continue;

        }


        // =================================================
        // 8. SO SÁNH
        // =================================================

        const changedFields =
            compareDeviceFields(
                old,
                data
            );


        // =================================================
        // DEBUG MATCH
        // =================================================

        console.log(
            "================================"
        );

        console.log(
            "DEVICE MATCH"
        );

        console.log(
            "MATCHED BY:",
            matchedBy
        );

        console.log(
            "EXCEL DEVICE KEY:",
            data.deviceKey
        );

        console.log(
            "DB DEVICE KEY:",
            old.deviceKey
        );

        console.log(
            "DB ID:",
            old.id
        );

        console.log(
            "STRUCTURE KEY:",
            structureKey
        );

        console.log(
            "OLD STATUS:",
            old.status
        );

        console.log(
            "EXCEL STATUS:",
            data.status
        );

        console.log(
            "NORMALIZED OLD STATUS:",
            normalizeStatus(
                old.status
            )
        );

        console.log(
            "NORMALIZED EXCEL STATUS:",
            normalizeStatus(
                data.status
            )
        );

        console.log(
            "CHANGED:",
            changedFields
        );

        console.log(
            "================================"
        );


        // =================================================
        // 9. UPDATE
        // =================================================

        if (
            changedFields.length > 0
        ) {

            updateCount++;


            result.push({

                action:
                    "UPDATE",

                changedFields,

                matchedBy,

                existingId:
                    old.id,

                row:
                    data

            });


            continue;

        }


        // =================================================
        // 10. KHÔNG THAY ĐỔI
        // =================================================

        skipCount++;


        result.push({

            action:
                "SKIP",

            reason:
                "Thiết bị đã tồn tại và không có thay đổi",

            changedFields: [],

            matchedBy,

            existingId:
                old.id,

            row:
                data

        });

    }


    // =====================================================
    // THỐNG KÊ SKIP
    // =====================================================

    const skipReasons =
        {};


    for (
        const item
        of result
    ) {

        if (
            item.action !==
            "SKIP"
        ) {

            continue;

        }


        const reason =
            item.reason ||
            "Không xác định";


        skipReasons[reason] =
            (
                skipReasons[reason] ||
                0
            ) + 1;

    }


    // =====================================================
    // SUMMARY
    // =====================================================

    console.log(
        "========================================"
    );

    console.log(
        "IMPORT SUMMARY"
    );

    console.log(
        "TOTAL:",
        rows.length
    );

    console.log(
        "NEW:",
        newCount
    );

    console.log(
        "UPDATE:",
        updateCount
    );

    console.log(
        "SKIP:",
        skipCount
    );

    console.log(
        "DUPLICATE DEVICE KEY:",
        duplicateDeviceKeys.size
    );

    console.log(
        "DUPLICATE DEVICE ID:",
        duplicateDeviceIds.size
    );

    console.log(
        "DUPLICATE STRUCTURE KEY:",
        duplicateDatabaseKeys.size
    );

    console.log(
        "SKIP REASONS:",
        skipReasons
    );

    console.log(
        "========================================"
    );


    // =====================================================
    // RETURN
    // =====================================================

    return {
        summary: {
            total: rows.length,

            newCount,

            updateCount,

            skipCount,

            duplicateDeviceKeys:
                duplicateDeviceKeys.size,

            duplicateDeviceIds:
                duplicateDeviceIds.size,

            duplicateDatabaseKeys:
                duplicateDatabaseKeys.size,

            skipReasons
        },

        rows: result
    };

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    compareRows,

    parseExcelRow,

    makeCompareKey,

    getFlexible,

    normalizeHeader,

    isEmptyExcelRow,

    cleanText,

    normalizeDeviceKey,

    normalizeStatus,

    sameStatus,

    compareDeviceFields

};
