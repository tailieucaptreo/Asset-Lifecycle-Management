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

        // CRLF / xuống dòng
        .replace(/\r\n/g, " ")

        .replace(/\n/g, " ")

        .replace(/\r/g, " ")

        // nhiều khoảng trắng
        .replace(/\s+/g, " ")

        .trim();

}


// =====================================================
// DEVICE KEY TỪ DATABASE
//
// Đây là deviceKey thật của DB.
//
// KHÔNG tạo lại.
// KHÔNG thay đổi.
// Chỉ dùng để đối chiếu.
// =====================================================

function normalizeDeviceKey(
    value
) {

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
// COMPARE KEY DỰ PHÒNG
//
// Không phải deviceKey.
//
// Dùng khi Excel không có Device Key.
//
// Ưu tiên:
// Tuyến + Nhà ga + Khu vực + Ký hiệu
//
// Nếu không có Ký hiệu:
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
    //
    // Dùng tên thiết bị
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
    //
    // File Export mới sẽ có cột này.
    //
    // File Excel cũ không có cũng không sao.
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
    // MÃ ID
    //
    // Không dùng trực tiếp làm khóa chính.
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
    // NGÀY BẢO DƯỠNG
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
    // CHUYỂN ĐỔI
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

        // ---------------------------------------------
        // DEVICE KEY
        // ---------------------------------------------

        deviceKey:
            deviceKey === "" ||
            deviceKey === null ||
            deviceKey === undefined

                ? null

                : normalizeDeviceKey(
                    deviceKey
                ),


        // ---------------------------------------------
        // DEVICE ID
        // ---------------------------------------------

        deviceId:
            deviceId === "" ||
            deviceId === null ||
            deviceId === undefined

                ? null

                : cleanText(
                    deviceId
                ),


        // ---------------------------------------------
        // NAME
        // ---------------------------------------------

        name:
            cleanText(
                name
            ),


        // ---------------------------------------------
        // CATEGORY
        // ---------------------------------------------

        category:
            cleanText(
                category
            ),


        // ---------------------------------------------
        // LINE
        // ---------------------------------------------

        line:
            cleanText(
                line
            ),


        // ---------------------------------------------
        // STATION
        // ---------------------------------------------

        station:
            cleanText(
                station
            ),


        // ---------------------------------------------
        // CODE
        // ---------------------------------------------

        code:
            cleanText(
                code
            ),


        // ---------------------------------------------
        // AREA
        // ---------------------------------------------

        area:
            cleanText(
                area
            ),


        // ---------------------------------------------
        // STATUS
        // ---------------------------------------------

        status:
            cleanText(
                status
            ),


        // ---------------------------------------------
        // DATES
        // ---------------------------------------------

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

    return (
        Number(a || 0) ===
        Number(b || 0)
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
    // MÃ ID
    //
    // Mã ID chỉ là thông tin.
    // Không dùng làm khóa chính.
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
    // TRẠNG THÁI
    // =================================================

    if (
        data.status &&
        !sameText(
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
    // NGÀY BẢO DƯỠNG
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
        data.expiryDate &&
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
    // 2. MAP DEVICE KEY
    //
    // Device Key là khóa ưu tiên số 1.
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
            device.deviceKey
        ) {

            const key =
                normalizeDeviceKey(
                    device.deviceKey
                );


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

    }


    // =================================================
    // 3. MAP DEVICE ID
    //
    // Chỉ dùng khi Device ID là duy nhất.
    //
    // Nếu DB có Device ID trùng:
    // KHÔNG dùng Device ID để match.
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
    // 4. MAP STRUCTURE
    //
    // Fallback cuối:
    //
    // Tuyến + Nhà ga + Khu vực + Ký hiệu
    //
    // hoặc:
    //
    // Tuyến + Nhà ga + Khu vực + Tên
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
    // 5. COUNTER
    // =================================================

    let newCount =
        0;

    let updateCount =
        0;

    let skipCount =
        0;


    // =================================================
    // 6. RESULT
    // =================================================

    const result =
        [];


    // =================================================
    // 7. THEO DÕI DUPLICATE TRONG EXCEL
    // =================================================

    const excelDeviceKeys =
        new Map();

    const excelDeviceIds =
        new Map();

    const excelStructureKeys =
        new Map();


    // =================================================
    // 8. DUYỆT TỪNG DÒNG
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
        // VALIDATE
        //
        // BẮT BUỘC:
        // - Tên
        // - Tuyến
        // - Nhà ga
        //
        // KHÔNG bắt buộc:
        // - Device Key
        // - Device ID
        // - Ký hiệu
        // - Khu vực
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
                `IMPORT SKIP - dòng Excel ${excelRowNumber}:`,
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
        // 9. TÌM THIẾT BỊ CŨ
        //
        // THỨ TỰ:
        //
        // 1. Device Key
        // 2. Device ID nếu duy nhất
        // 3. Structure Key
        // =================================================

        let old =
            null;

        let matchedBy =
            null;


        // =================================================
        // 9.1 DEVICE KEY
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
        // 9.2 DEVICE ID
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


            // ---------------------------------------------
            // Nếu Device ID trùng DB:
            // Không tự chọn một thiết bị.
            // ---------------------------------------------

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
        // 9.3 STRUCTURE KEY
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
        // 10. DUPLICATE TRONG FILE EXCEL
        // =================================================

        // ---------------------------------------------
        // DEVICE KEY
        // ---------------------------------------------

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


        // ---------------------------------------------
        // DEVICE ID
        //
        // Chỉ cảnh báo duplicate,
        // không dùng để chặn nếu Device Key khác.
        // ---------------------------------------------

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

                    `DEVICE ID trùng trong Excel: ${data.deviceId}`

                );

            }
            else {

                excelDeviceIds.set(
                    key,
                    excelRowNumber
                );

            }

        }


        // ---------------------------------------------
        // STRUCTURE KEY
        // ---------------------------------------------

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
             * Chỉ coi là duplicate nếu
             * KHÔNG có Device Key khác nhau.
             *
             * Tránh trường hợp nhiều thiết bị
             * hợp lệ có cùng tên/ký hiệu.
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
        // 11. KHÔNG TÌM THẤY
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
        // 12. SO SÁNH
        // =================================================

        const changedFields =
            compareDeviceFields(
                old,
                data
            );


        // =================================================
        // 13. DEBUG MATCH
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
            "CHANGED:",
            changedFields
        );

        console.log(
            "================================"
        );


        // =================================================
        // 14. UPDATE
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
        // 15. SKIP
        //
        // Tìm đúng thiết bị
        // nhưng dữ liệu không thay đổi.
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
    // 16. THỐNG KÊ LÝ DO SKIP
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
    // 17. LOG SUMMARY
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
    // 18. RETURN
    // =====================================================

    return {

        total:
            rows.length,

        newCount,

        updateCount,

        skipCount,

        duplicateDeviceKeys:
            duplicateDeviceKeys.size,

        duplicateDeviceIds:
            duplicateDeviceIds.size,

        duplicateDatabaseKeys:
            duplicateDatabaseKeys.size,

        skipReasons,

        rows:
            result

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

    isEmptyExcelRow

};
