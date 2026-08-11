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

    if (!row || typeof row !== "object") {
        return "";
    }

    const keys = Object.keys(row);

    // ---------------------------------------------
    // Tạo Map Header đã normalize
    // ---------------------------------------------

    const headerMap = new Map();

    for (const key of keys) {

        const normalizedKey =
            normalizeHeader(key);

        if (!headerMap.has(normalizedKey)) {

            headerMap.set(
                normalizedKey,
                key
            );

        }

    }

    // ---------------------------------------------
    // Tìm theo alias
    // ---------------------------------------------

    for (const alias of aliases) {

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

            const value = row[realKey];

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
// TẠO DEVICE KEY DÙNG ĐỂ COMPARE
//
// LƯU Ý:
// Đây KHÔNG phải deviceKey trong Database.
//
// Đây chỉ là khóa tạm thời:
//
// Tuyến + Nhà ga + Ký hiệu
//
// Dùng để xác định cùng một thiết bị.
// =====================================================

function makeCompareKey(
    line,
    station,
    code
) {

    return [
        normalize(line),
        normalize(station),
        normalize(code)
    ].join("_");

}


// =====================================================
// CHUẨN HÓA DỮ LIỆU EXCEL
// =====================================================

function parseExcelRow(row) {

    // =============================================
    // MÃ ID
    // Cho phép trùng
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
        parseDate(rawInstallDate);

    const lastMaintenance =
        parseDate(rawLastMaintenance);

    const replacementDate =
        parseDate(rawReplacementDate);

    const expiryDate =
        parseDate(rawExpiryDate);

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
                : String(deviceId).trim(),

        name:
            name === null ||
            name === undefined
                ? ""
                : String(name).trim(),

        category:
            category === null ||
            category === undefined
                ? ""
                : String(category).trim(),

        line:
            line === null ||
            line === undefined
                ? ""
                : String(line).trim(),

        station:
            station === null ||
            station === undefined
                ? ""
                : String(station).trim(),

        code:
            code === null ||
            code === undefined
                ? ""
                : String(code).trim(),

        area:
            area === null ||
            area === undefined
                ? ""
                : String(area).trim(),

        status:
            status === null ||
            status === undefined
                ? ""
                : String(status).trim(),

        installDate,

        lastMaintenance,

        replacementDate,

        lifespan,

        expiryDate

    };

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
    // 2. TẠO MAP
    //
    // KHÔNG DÙNG deviceId
    //
    // Dùng:
    //
    // Tuyến + Nhà ga + Ký hiệu
    // =================================================

    const deviceMap = new Map();

    const duplicateDatabaseKeys = new Set();


    for (const device of devices) {

        if (
            device.line &&
            device.station &&
            device.code
        ) {

            const key =
                makeCompareKey(

                    device.line,

                    device.station,

                    device.code

                );


            // -----------------------------------------
            // Phát hiện DB có duplicate
            // -----------------------------------------

            if (deviceMap.has(key)) {

                duplicateDatabaseKeys.add(key);

            }
            else {

                deviceMap.set(
                    key,
                    device
                );

            }

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

    const excelKeys = new Map();


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


        // =============================================
        // DEBUG HEADER
        // =============================================

        if (index === 0) {

            console.log(
                "================================"
            );

            console.log(
                "EXCEL COLUMN NAMES:"
            );

            console.log(
                Object.keys(row || {})
            );

            console.log(
                "================================"
            );

        }


        // =============================================
        // PARSE DATA
        // =============================================

        const data =
            parseExcelRow(row);


        // =============================================
        // LOG
        // =============================================

        console.log(
            `IMPORT ROW ${index + 2}:`,
            {
                deviceId:
                    data.deviceId,

                name:
                    data.name,

                line:
                    data.line,

                station:
                    data.station,

                code:
                    data.code
            }
        );


        // =============================================
        // 7. VALIDATE
        //
        // Tuyến + Nhà ga + Ký hiệu + Tên
        // là bắt buộc để xác định thiết bị
        // =============================================

        if (
            !data.line ||
            !data.station ||
            !data.code ||
            !data.name
        ) {

            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    "Thiếu Tuyến hoặc Nhà ga hoặc Ký hiệu hoặc Tên thiết bị",

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

                data.code

            );


        // =============================================
        // 9. DUPLICATE TRONG DATABASE
        // =============================================

        if (
            duplicateDatabaseKeys.has(key)
        ) {

            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    "Database đang có nhiều thiết bị trùng Tuyến + Nhà ga + Ký hiệu",

                changedFields: [],

                row: data

            });


            continue;

        }


        // =============================================
        // 10. DUPLICATE TRONG FILE EXCEL
        // =============================================

        if (
            excelKeys.has(key)
        ) {

            const firstRow =
                excelKeys.get(key);


            skipCount++;


            result.push({

                action: "SKIP",

                reason:
                    `Trùng Tuyến + Nhà ga + Ký hiệu trong file Excel với dòng ${firstRow}`,

                changedFields: [],

                row: data

            });


            continue;

        }


        excelKeys.set(
            key,
            index + 2
        );


        // =============================================
        // 11. TÌM DEVICE CŨ
        // =============================================

        const old =
            deviceMap.get(key);


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
            normalize(old.name) !==
            normalize(data.name)
        ) {

            changedFields.push(
                "Tên thiết bị"
            );

        }


        // ---------------------------------------------
        // Phân loại
        // ---------------------------------------------

        if (
            normalize(old.category) !==
            normalize(data.category)
        ) {

            changedFields.push(
                "Phân loại"
            );

        }


        // ---------------------------------------------
        // Tuyến
        // ---------------------------------------------

        if (
            normalize(old.line) !==
            normalize(data.line)
        ) {

            changedFields.push(
                "Tuyến"
            );

        }


        // ---------------------------------------------
        // Nhà ga
        // ---------------------------------------------

        if (
            normalize(old.station) !==
            normalize(data.station)
        ) {

            changedFields.push(
                "Nhà ga"
            );

        }


        // ---------------------------------------------
        // Ký hiệu
        // ---------------------------------------------

        if (
            normalize(old.code) !==
            normalize(data.code)
        ) {

            changedFields.push(
                "Ký hiệu"
            );

        }


        // ---------------------------------------------
        // Khu vực
        // ---------------------------------------------

        if (
            normalize(old.area) !==
            normalize(data.area)
        ) {

            changedFields.push(
                "Khu vực"
            );

        }


        // ---------------------------------------------
        // Mã ID
        //
        // CHỈ là thông tin.
        //
        // Không dùng để xác định thiết bị.
        // ---------------------------------------------

        if (
            normalize(old.deviceId) !==
            normalize(data.deviceId)
        ) {

            changedFields.push(
                "Mã ID"
            );

        }


        // ---------------------------------------------
        // Trạng thái
        // ---------------------------------------------

        if (
            data.status &&
            normalize(old.status) !==
            normalize(data.status)
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
            Number(old.lifespan || 0) !==
            Number(data.lifespan || 0)
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
        // 14. DEBUG
        // =============================================

        if (
            changedFields.length
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

                    code:
                        old.code,

                    area:
                        old.area,

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
            changedFields.length
        ) {

            updateCount++;


            result.push({

                action: "UPDATE",

                changedFields,

                row: data

            });

        }

        // =============================================
        // 16. SKIP
        // =============================================

        else {

            skipCount++;


            result.push({

                action: "SKIP",

                changedFields: [],

                row: data

            });

        }

    }


    // =================================================
    // 17. RETURN
    // =================================================

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
