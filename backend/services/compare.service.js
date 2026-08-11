const {
    parseDate,
    sameDate
} = require("../utils/date");

const {
    normalize
} = require("../utils/normalize");


// =====================================================
// HEADER HELPER
// Tự nhận nhiều cách đặt tên Header Excel
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

function getFlexible(row, aliases = []) {

    if (
        !row ||
        typeof row !== "object"
    ) {

        return "";

    }

    const keys =
        Object.keys(row);


    // ---------------------------------------------
    // Tạo Map Header đã normalize
    // ---------------------------------------------

    const headerMap =
        new Map();


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
    // Tìm theo alias
    // ---------------------------------------------

    for (
        const alias of aliases
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
                String(value).trim() !== ""
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

        .replace(/\r\n/g, " ")

        .replace(/\n/g, " ")

        .replace(/\r/g, " ")

        .replace(/\s+/g, " ")

        .trim();

}


// =====================================================
// TẠO KEY XÁC ĐỊNH THIẾT BỊ
//
// ƯU TIÊN:
//
// Tuyến
// + Nhà ga
// + Khu vực
// + Ký hiệu
//
// Nếu không có Ký hiệu:
//
// Tuyến
// + Nhà ga
// + Khu vực
// + Tên thiết bị
//
// LƯU Ý:
// Đây KHÔNG phải deviceKey trong Database.
//
// Chỉ là khóa tạm dùng cho IMPORT / COMPARE.
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
    // Trường hợp có Ký hiệu
    // ---------------------------------------------

    if (
        normalizedCode
    ) {

        return [
            "CODE",
            normalizedLine,
            normalizedStation,
            normalizedArea,
            normalizedCode
        ].join("_");

    }


    // ---------------------------------------------
    // Không có Ký hiệu
    //
    // Dùng Tên thiết bị làm fallback
    // ---------------------------------------------

    return [
        "NAME",
        normalizedLine,
        normalizedStation,
        normalizedArea,
        normalizedName
    ].join("_");

}


// =====================================================
// KIỂM TRA DÒNG EXCEL CÓ HOÀN TOÀN TRỐNG KHÔNG
// =====================================================

function isEmptyExcelRow(row) {

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


    return values.every(value => {

        return (
            value === null ||
            value === undefined ||
            String(value).trim() === ""
        );

    });

}


// =====================================================
// CHUẨN HÓA DỮ LIỆU EXCEL
// =====================================================

function parseExcelRow(row) {

    // =============================================
    // MÃ ID
    //
    // Cho phép trống.
    //
    // KHÔNG dùng làm khóa xác định thiết bị.
    // =============================================

    const deviceId =
        getFlexible(row, [

            "Mã ID",
            "Mã ID thiết bị",
            "Mã thiết bị",
            "Device ID",
            "DeviceID",
            "deviceId",
            "Device_Id",
            "ID thiết bị",
            "ID"

        ]);


    // =============================================
    // TÊN THIẾT BỊ
    // =============================================

    const name =
        getFlexible(row, [

            "Tên thiết bị",
            "Tên thiết bị ",
            "Tên",
            "Tên TB",
            "Tên máy",
            "Device Name",
            "DeviceName",
            "deviceName",
            "Name"

        ]);


    // =============================================
    // PHÂN LOẠI
    // =============================================

    const category =
        getFlexible(row, [

            "Phân loại",
            "Phân loại thiết bị",
            "Loại thiết bị",
            "Category",
            "category",
            "Type"

        ]);


    // =============================================
    // TUYẾN
    // =============================================

    const line =
        getFlexible(row, [

            "Tuyến",
            "Tuyến cáp",
            "Tuyến cáp treo",
            "Line",
            "line",
            "Cable Line",
            "CableLine"

        ]);


    // =============================================
    // NHÀ GA
    // =============================================

    const station =
        getFlexible(row, [

            "Nhà ga",
            "Ga",
            "Ga máy",
            "Trạm",
            "Station",
            "station",
            "Station Name"

        ]);


    // =============================================
    // KÝ HIỆU
    // =============================================

    const code =
        getFlexible(row, [

            "Ký hiệu",
            "Ký hiệu thiết bị",
            "Mã ký hiệu",
            "Code",
            "code",
            "Symbol",
            "symbol",
            "Tag",
            "Device Code"

        ]);


    // =============================================
    // KHU VỰC
    // =============================================

    const area =
        getFlexible(row, [

            "Khu vực",
            "Khu Vực",
            "KHU VỰC",
            "Vị trí",
            "Vị trí lắp đặt",
            "Khu vực lắp đặt",
            "Area",
            "area",
            "Location"

        ]);


    // =============================================
    // TRẠNG THÁI
    // =============================================

    const status =
        getFlexible(row, [

            "Trạng thái",
            "Tình trạng",
            "Status",
            "status",
            "State"

        ]);


    // =============================================
    // NGÀY LẮP
    // =============================================

    const rawInstallDate =
        getFlexible(row, [

            "Ngày lắp",
            "Ngày lắp đặt",
            "Ngày lắp đặt lần đầu",
            "Ngày lắp lần đầu",
            "Ngày đưa vào sử dụng",
            "Ngày vận hành",
            "Install Date",
            "InstallDate",
            "installDate"

        ]);


    // =============================================
    // NGÀY BẢO DƯỠNG
    // =============================================

    const rawLastMaintenance =
        getFlexible(row, [

            "Bảo dưỡng gần nhất",
            "Ngày bảo dưỡng",
            "Ngày bảo dưỡng gần nhất",
            "Lần bảo dưỡng gần nhất",
            "Last Maintenance",
            "LastMaintenance",
            "lastMaintenance"

        ]);


    // =============================================
    // NGÀY THAY THẾ
    // =============================================

    const rawReplacementDate =
        getFlexible(row, [

            "Ngày thay thế",
            "Ngày thay",
            "Ngày thay mới",
            "Replacement Date",
            "ReplacementDate",
            "replacementDate"

        ]);


    // =============================================
    // TUỔI THỌ
    // =============================================

    const rawLifespan =
        getFlexible(row, [

            "Tuổi thọ",
            "Tuổi thọ thiết bị",
            "Thời gian sử dụng",
            "Lifespan",
            "lifespan",
            "Life Span"

        ]);


    // =============================================
    // NGÀY HẾT HẠN
    // =============================================

    const rawExpiryDate =
        getFlexible(row, [

            "Ngày hết hạn",
            "Ngày hết hạn sử dụng",
            "Ngày hết tuổi thọ",
            "Expiry Date",
            "ExpiryDate",
            "expiryDate"

        ]);


    // =============================================
    // CHUYỂN ĐỔI
    // =============================================

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

            : Number(rawLifespan) || 0;


    // =============================================
    // DATA
    // =============================================

    return {

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
            cleanText(
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
// SO SÁNH GIÁ TRỊ
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
// COMPARE ROWS
// =====================================================

async function compareRows(
    prisma,
    rows
) {

    // =================================================
    // 1. LẤY DEVICE HIỆN TẠI
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
    // 2. TẠO MAP DATABASE
    //
    // Không dùng deviceId.
    //
    // Dùng:
    //
    // Tuyến
    // + Nhà ga
    // + Khu vực
    // + Ký hiệu
    //
    // hoặc:
    //
    // Tuyến
    // + Nhà ga
    // + Khu vực
    // + Tên
    //
    // nếu thiếu Ký hiệu.
    // =================================================

    const deviceMap =
        new Map();


    const duplicateDatabaseKeys =
        new Set();


    for (
        const device of devices
    ) {

        const key =
            makeCompareKey(

                device.line,

                device.station,

                device.area,

                device.code,

                device.name

            );


        // ---------------------------------------------
        // Chỉ tạo key khi có đủ thông tin cơ bản
        // ---------------------------------------------

        if (
            !device.line ||
            !device.station ||
            (
                !device.code &&
                !device.name
            )
        ) {

            continue;

        }


        // ---------------------------------------------
        // Phát hiện duplicate Database
        // ---------------------------------------------

        if (
            deviceMap.has(key)
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
    // 3. COUNTER
    // =================================================

    let newCount = 0;

    let updateCount = 0;

    let skipCount = 0;


    // =================================================
    // 4. KẾT QUẢ
    // =================================================

    const result = [];


    // =================================================
    // 5. THEO DÕI DUPLICATE TRONG FILE EXCEL
    // =================================================

    const excelKeys =
        new Map();


    // =================================================
    // 6. DUYỆT TỪNG DÒNG EXCEL
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


        // =============================================
        // BỎ QUA DÒNG HOÀN TOÀN TRỐNG
        // =============================================

        if (
            isEmptyExcelRow(row)
        ) {

            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    "Dòng Excel trống",

                changedFields: [],

                row: {

                    deviceId: null,

                    name: "",

                    line: "",

                    station: "",

                    code: "",

                    area: ""

                }

            });


            continue;

        }


        // =============================================
        // PARSE DATA
        // =============================================

        const data =
            parseExcelRow(
                row
            );


        // =============================================
        // LOG
        // =============================================

        console.log(
            `IMPORT ROW ${excelRowNumber}:`,
            {

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


        // =============================================
        // 7. VALIDATE
        //
        // Mã ID KHÔNG bắt buộc.
        //
        // Ký hiệu cũng KHÔNG bắt buộc tuyệt đối.
        //
        // Chỉ yêu cầu:
        //
        // Tuyến
        // Nhà ga
        // Tên thiết bị
        //
        // Nếu thiếu Ký hiệu thì dùng Tên
        // để tạo khóa dự phòng.
        // =============================================

        if (
            !data.line ||
            !data.station ||
            !data.name
        ) {

            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    "Thiếu Tuyến hoặc Nhà ga hoặc Tên thiết bị",

                changedFields: [],

                row: data

            });


            continue;

        }


        // =============================================
        // 8. TẠO COMPARE KEY
        // =============================================

        const key =
            makeCompareKey(

                data.line,

                data.station,

                data.area,

                data.code,

                data.name

            );


        // =============================================
        // 9. DUPLICATE DATABASE
        // =============================================

        if (
            duplicateDatabaseKeys.has(
                key
            )
        ) {

            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    "Database đang có nhiều thiết bị trùng Tuyến + Nhà ga + Khu vực + Ký hiệu/Tên",

                changedFields: [],

                row: data

            });


            continue;

        }


        // =============================================
        // 10. DUPLICATE TRONG FILE EXCEL
        // =============================================

        if (
            excelKeys.has(
                key
            )
        ) {

            const firstRow =
                excelKeys.get(
                    key
                );


            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    `Trùng thiết bị trong file Excel với dòng ${firstRow}`,

                changedFields: [],

                row: data

            });


            continue;

        }


        excelKeys.set(
            key,
            excelRowNumber
        );


        // =============================================
        // 11. TÌM DEVICE CŨ
        // =============================================

        const old =
            deviceMap.get(
                key
            );


        // =============================================
        // 12. NEW
        // =============================================

        if (!old) {

            newCount++;


            result.push({

                action: "NEW",

                changedFields: [],

                row: data

            });


            continue;

        }


        // =============================================
        // 13. SO SÁNH
        // =============================================

        const changedFields = [];


        // ---------------------------------------------
        // Tên
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Phân loại
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Tuyến
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Nhà ga
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Khu vực
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Ký hiệu
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Mã ID
        //
        // Chỉ là thông tin.
        //
        // Không dùng để xác định thiết bị.
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Trạng thái
        //
        // Chỉ update khi Excel có dữ liệu.
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Ngày lắp
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Ngày bảo dưỡng
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Ngày thay thế
        // ---------------------------------------------

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


        // ---------------------------------------------
        // Tuổi thọ
        // ---------------------------------------------

        if (
            Number(
                old.lifespan || 0
            ) !==
            Number(
                data.lifespan || 0
            )
        ) {

            changedFields.push(
                "Tuổi thọ"
            );

        }


        // ---------------------------------------------
        // Ngày hết hạn
        // ---------------------------------------------

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


        // =============================================
        // 14. DEBUG MATCH
        // =============================================

        if (
            changedFields.length > 0
        ) {

            console.log(
                "================================"
            );

            console.log(
                "DEVICE MATCH"
            );

            console.log(
                "KEY:",
                key
            );

            console.log(
                "DB ID:",
                old.id
            );

            console.log(
                "DEVICE KEY:",
                old.deviceKey
            );

            console.log(
                "Changed:",
                changedFields
            );

            console.log(
                "OLD:",
                {

                    deviceId:
                        old.deviceId,

                    name:
                        old.name,

                    category:
                        old.category,

                    line:
                        old.line,

                    station:
                        old.station,

                    area:
                        old.area,

                    code:
                        old.code,

                    status:
                        old.status,

                    installDate:
                        old.installDate,

                    lifespan:
                        old.lifespan

                }
            );

            console.log(
                "NEW:",
                data
            );

            console.log(
                "================================"
            );

        }


        // =============================================
        // 15. UPDATE
        // =============================================

        if (
            changedFields.length > 0
        ) {

            updateCount++;


            result.push({

                action: "UPDATE",

                changedFields,

                row: data

            });


            continue;

        }


        // =============================================
        // 16. KHÔNG CÓ THAY ĐỔI
        // =============================================

        skipCount++;


        result.push({

            action: "SKIP",

            reason:
                "Thiết bị đã tồn tại và không có thay đổi",

            changedFields: [],

            row: data

        });

    }


    // =====================================================
    // 17. THỐNG KÊ LÝ DO SKIP
    // =====================================================

    const skipReasons = {};


    for (
        const item of result
    ) {

        if (
            item.action !== "SKIP"
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
    // 18. LOG SUMMARY
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
        "SKIP REASONS:"
    );

    console.log(
        skipReasons
    );

    console.log(
        "========================================"
    );


    // =====================================================
    // 19. RETURN
    // =====================================================

    return {

        summary: {

            total:
                rows.length,

            newCount,

            updateCount,

            skipCount

        },

        rows:
            result

    };

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    compareRows

};