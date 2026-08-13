const {
    parseDate,
    calculateExpiryDate
} = require("../utils/date");

const {
    detectCategory
} = require("./category.service");

const crypto = require("crypto");


// =====================================================
// HELPER
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
// CHUẨN HÓA DEVICE KEY
// =====================================================

function normalizeDeviceKey(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return null;

    }

    const key =
        String(value).trim();

    return key || null;

}


// =====================================================
// TẠO DATA CHO DEVICE
//
// LƯU Ý:
//
// Hàm này KHÔNG tạo deviceKey.
//
// deviceKey được xử lý riêng:
//
// NEW    -> tạo key
// UPDATE -> giữ nguyên key cũ
// =====================================================

function buildDeviceData(
    d
) {

    // =================================================
    // DATE
    // =================================================

    const installDate =
        parseDate(
            d.installDate
        );


    const lastMaintenance =
        parseDate(
            d.lastMaintenance
        );


    const replacementDate =
        parseDate(
            d.replacementDate
        );


    const expiryDate =
        parseDate(
            d.expiryDate
        ) ||
        calculateExpiryDate(
            installDate,
            d.lifespan
        );


    // =================================================
    // CATEGORY
    // =================================================

    const categoryInfo =
        detectCategory({

            name:
                d.name,

            code:
                d.code,

            model:
                d.model || ""

        });


    // =================================================
    // LIFESPAN
    // =================================================

    let lifespan =
        null;


    if (
        d.lifespan !== undefined &&
        d.lifespan !== null &&
        d.lifespan !== ""
    ) {

        const number =
            Number(
                d.lifespan
            );


        if (
            Number.isFinite(
                number
            )
        ) {

            lifespan =
                number;

        }

    }


    // =================================================
    // DATA
    // =================================================

    return {

        name:
            cleanText(
                d.name
            ),


        category:
            cleanText(
                d.category
            ) ||
            categoryInfo.category ||
            null,


        line:
            cleanText(
                d.line
            ),


        station:
            cleanText(
                d.station
            ),


        code:
            cleanText(
                d.code
            ) ||
            null,


        area:
            cleanText(
                d.area
            ) ||
            null,


        deviceId:
            cleanText(
                d.deviceId
            ) ||
            null,


        status:
            cleanText(
                d.status
            ) ||
            "Running",


        originalInstallDate:
            installDate,


        installDate:
            installDate,


        lastMaintenance:
            lastMaintenance,


        replacementDate:
            replacementDate,


        lifespan:
            lifespan,


        expiryDate:
            expiryDate

    };

}


// =====================================================
// IMPORT DEVICES
// =====================================================

async function importRows(
    prisma,
    rows
) {

    let created =
        0;

    let updated =
        0;

    let skipped =
        0;


    const failed =
        [];


    // =================================================
    // VALIDATE INPUT
    // =================================================

    if (
        !Array.isArray(rows)
    ) {

        return {

            inserted:
                0,

            updated:
                0,

            skipped:
                0,

            total:
                0,

            errors: [

                {

                    message:
                        "Dữ liệu import không phải là một mảng."

                }

            ]

        };

    }


    // =================================================
    // DUYỆT TỪNG DÒNG
    // =================================================

    for (
        let index = 0;
        index < rows.length;
        index++
    ) {

        const item =
            rows[index];


        const importRowNumber =
            index + 2;


        // =================================================
        // CHECK ITEM
        // =================================================

        if (
            !item ||
            typeof item !== "object"
        ) {

            skipped++;


            failed.push({

                row:
                    importRowNumber,

                message:
                    "Dòng import không hợp lệ."

            });


            continue;

        }


        // =================================================
        // SKIP
        // =================================================

        if (
            item.action === "SKIP"
        ) {

            skipped++;

            continue;

        }


        // =================================================
        // ROW DATA
        // =================================================

        const d =
            item.row;


        if (
            !d ||
            typeof d !== "object"
        ) {

            skipped++;


            failed.push({

                row:
                    importRowNumber,

                message:
                    "Dòng import không có dữ liệu row."

            });


            continue;

        }


        // =================================================
        // LOG
        // =================================================

        console.log(
            "========================================"
        );

        console.log(
            `IMPORT ${item.action} - ROW ${importRowNumber}`
        );

        console.log({

            existingId:
                item.existingId,

            matchedBy:
                item.matchedBy,

            deviceKey:
                d.deviceKey,

            deviceId:
                d.deviceId,

            name:
                d.name,

            line:
                d.line,

            station:
                d.station,

            code:
                d.code

        });


        try {

            // =================================================
            // BUILD DATA
            // =================================================

            const data =
                buildDeviceData(
                    d
                );


            // =================================================
            // NEW
            // =================================================

            if (
                item.action === "NEW"
            ) {

                // ---------------------------------------------
                // DEVICE KEY
                //
                // Nếu Excel đã có Device Key:
                // giữ nguyên.
                //
                // Nếu Excel chưa có:
                // tạo UUID mới.
                // ---------------------------------------------

                const excelDeviceKey =
                    normalizeDeviceKey(
                        d.deviceKey
                    );


                const newDeviceKey =
                    excelDeviceKey ||
                    crypto.randomUUID();


                // ---------------------------------------------
                // KIỂM TRA DEVICE KEY ĐÃ TỒN TẠI
                //
                // Đây là lớp bảo vệ thứ 2.
                //
                // Nếu compare.service.js nói NEW
                // nhưng DB thực tế đã có key:
                //
                // KHÔNG tạo duplicate.
                // ---------------------------------------------

                const existingByKey =
                    await prisma.device.findFirst({

                        where: {

                            deviceKey:
                                newDeviceKey

                        },

                        select: {

                            id: true,

                            deviceKey: true

                        }

                    });


                if (
                    existingByKey
                ) {

                    skipped++;


                    failed.push({

                        row:
                            importRowNumber,

                        deviceId:
                            d.deviceId,

                        name:
                            d.name,

                        message:
                            "Device Key đã tồn tại trong database. Không tạo thiết bị trùng.",

                        existingId:
                            existingByKey.id

                    });


                    console.warn(

                        `IMPORT NEW SKIP - Device Key đã tồn tại: ${newDeviceKey}`

                    );


                    continue;

                }


                // ---------------------------------------------
                // CREATE
                // ---------------------------------------------

                await prisma.device.create({

                    data: {

                        ...data,

                        deviceKey:
                            newDeviceKey

                    }

                });


                created++;


                console.log(

                    `CREATE SUCCESS - row ${importRowNumber}`

                );


                continue;

            }


            // =================================================
            // UPDATE
            // =================================================

            if (
                item.action === "UPDATE"
            ) {

                let oldDevice =
                    null;


                // =================================================
                // 1. ƯU TIÊN existingId
                //
                // compare.service.js đã tìm ra chính xác
                // thiết bị cũ.
                // =================================================

                if (
                    item.existingId !== null &&
                    item.existingId !== undefined
                ) {

                    oldDevice =
                        await prisma.device.findUnique({

                            where: {

                                id:
                                    Number(
                                        item.existingId
                                    )

                            },

                            select: {

                                id: true,

                                deviceKey: true,

                                deviceId: true,

                                name: true

                            }

                        });

                }


                // =================================================
                // 2. FALLBACK DEVICE KEY
                //
                // Trường hợp existingId không có.
                // =================================================

                if (
                    !oldDevice &&
                    d.deviceKey
                ) {

                    const deviceKey =
                        normalizeDeviceKey(
                            d.deviceKey
                        );


                    if (
                        deviceKey
                    ) {

                        oldDevice =
                            await prisma.device.findFirst({

                                where: {

                                    deviceKey:
                                        deviceKey

                                },

                                select: {

                                    id: true,

                                    deviceKey: true,

                                    deviceId: true,

                                    name: true

                                }

                            });

                    }

                }


                // =================================================
                // KHÔNG TÌM THẤY
                // =================================================

                if (
                    !oldDevice
                ) {

                    skipped++;


                    failed.push({

                        row:
                            importRowNumber,

                        deviceId:
                            d.deviceId,

                        deviceKey:
                            d.deviceKey,

                        name:
                            d.name,

                        message:
                            "Không tìm thấy thiết bị cũ để cập nhật."

                    });


                    console.warn(

                        `UPDATE SKIP - Không tìm thấy thiết bị - row ${importRowNumber}`

                    );


                    continue;

                }


                // =================================================
                // QUAN TRỌNG:
                //
                // KHÔNG UPDATE deviceKey
                //
                // data KHÔNG chứa deviceKey.
                //
                // Prisma sẽ giữ nguyên deviceKey hiện tại.
                // =================================================

                await prisma.device.update({

                    where: {

                        id:
                            oldDevice.id

                    },

                    data:
                        data

                });


                updated++;


                console.log(

                    `UPDATE SUCCESS - row ${importRowNumber} - DB ID ${oldDevice.id}`

                );


                continue;

            }


            // =================================================
            // ACTION KHÔNG HỢP LỆ
            // =================================================

            skipped++;


            failed.push({

                row:
                    importRowNumber,

                deviceId:
                    d.deviceId,

                deviceKey:
                    d.deviceKey,

                name:
                    d.name,

                message:
                    `Action không hợp lệ: ${item.action}`

            });


        }

        catch (err) {

            // =================================================
            // ERROR
            // =================================================

            console.error(

                `IMPORT ERROR - row ${importRowNumber}:`,

                err

            );


            skipped++;


            failed.push({

                row:
                    importRowNumber,

                deviceId:
                    d.deviceId,

                deviceKey:
                    d.deviceKey,

                name:
                    d.name,

                message:
                    err.message,

                code:
                    err.code || null

            });

        }

    }


    // =====================================================
    // SUMMARY
    // =====================================================

    console.log(
        "========================================"
    );

    console.log(
        "IMPORT RESULT"
    );

    console.log(
        "TOTAL:",
        rows.length
    );

    console.log(
        "CREATED:",
        created
    );

    console.log(
        "UPDATED:",
        updated
    );

    console.log(
        "SKIPPED:",
        skipped
    );

    console.log(
        "ERRORS:",
        failed.length
    );

    console.log(
        "========================================"
    );


    // =====================================================
    // RETURN
    // =====================================================

    return {

        inserted:
            created,

        updated,

        skipped,

        total:
            rows.length,

        errors:
            failed

    };

}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    importRows

};
