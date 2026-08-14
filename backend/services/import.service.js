const crypto = require("crypto");

// =====================================================
// DATE
// =====================================================

const {
    parseDate,
    calculateExpiryDate
} = require("../utils/date");


// =====================================================
// STATUS
// =====================================================

const {
    normalizeStatus
} = require("../utils/status");


// =====================================================
// CATEGORY
// =====================================================

const {
    detectCategory
} = require("./category.service");


// =====================================================
// HELPERS
// =====================================================

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value).trim();
}


function toNumber(value, fallback = 0) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return fallback;
    }

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// =====================================================
// BUILD DEVICE DATA
// =====================================================
//
// Dùng chung cho NEW và UPDATE.
//
// LƯU Ý:
// Không đưa deviceKey vào đây cho UPDATE.
// Device Key là khóa bất biến.
// =====================================================

function buildDeviceData(row) {

    const d =
        row || {};


    const installDate =
        parseDate(
            d.installDate
        );


    const lifespan =
        toNumber(
            d.lifespan,
            0
        );


    let expiryDate =
        parseDate(
            d.expiryDate
        );


    // Nếu Excel không có ngày hết hạn
    // thì tính từ ngày lắp + tuổi thọ.

    if (
        !expiryDate &&
        installDate &&
        lifespan > 0
    ) {
        expiryDate =
            calculateExpiryDate(
                installDate,
                lifespan
            );
    }


    // -------------------------------------------------
    // CATEGORY
    // -------------------------------------------------

    let category =
        cleanText(
            d.category
        );


    if (!category) {

        const categoryInfo =
            detectCategory({
                name:
                    d.name || "",

                code:
                    d.code || "",

                model:
                    d.model || "",

                brand:
                    d.brand || ""
            });


        category =
            categoryInfo?.category ||
            "";
    }


    return {

        name:
            cleanText(
                d.name
            ),

        category,

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
            ),

        area:
            cleanText(
                d.area
            ),

        deviceId:
            d.deviceId === null ||
            d.deviceId === undefined ||
            d.deviceId === ""
                ? null
                : cleanText(
                    d.deviceId
                ),

        status:
            normalizeStatus(
                d.status
            ),

        installDate,

        lastMaintenance:
            parseDate(
                d.lastMaintenance
            ),

        replacementDate:
            parseDate(
                d.replacementDate
            ),

        lifespan,

        expiryDate
    };
}


// =====================================================
// IMPORT ROWS
// =====================================================

async function importRows(
    prisma,
    rows = []
) {

    let inserted = 0;

    let updated = 0;

    let skipped = 0;

    const errors = [];


    console.log(
        "========================================"
    );

    console.log(
        "IMPORT START"
    );

    console.log(
        "TOTAL ROWS:",
        rows.length
    );

    console.log(
        "========================================"
    );


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


        const excelRow =
            index + 2;


        try {

            // =========================================
            // VALIDATE ITEM
            // =========================================

            if (
                !item ||
                typeof item !== "object"
            ) {

                throw new Error(
                    "Dòng import không hợp lệ."
                );
            }


            const action =
                item.action;


            const row =
                item.row || {};


            // =========================================
            // SKIP
            // =========================================
            //
            // SKIP tuyệt đối không chạm database.
            //
            // =========================================

            if (
                action === "SKIP"
            ) {

                skipped++;

                continue;
            }


            // =========================================
            // DATA
            // =========================================

            const data =
                buildDeviceData(
                    row
                );


            // =========================================
            // NEW
            // =========================================

            if (
                action === "NEW"
            ) {

                // -------------------------------------
                // Device Key chỉ tạo ở NEW
                // -------------------------------------

                const deviceKey =
                    crypto.randomUUID();


                await prisma.device.create({

                    data: {

                        deviceKey,

                        ...data
                    }

                });


                inserted++;


                console.log(
                    `[IMPORT][NEW] Excel row ${excelRow}`,
                    {
                        deviceKey,
                        deviceId:
                            data.deviceId,
                        name:
                            data.name
                    }
                );


                continue;
            }


            // =========================================
            // UPDATE
            // =========================================

            if (
                action === "UPDATE"
            ) {

                // -------------------------------------
                // existingId được tạo bởi compareRows()
                // -------------------------------------

                const existingId =
                    Number(
                        item.existingId
                    );


                if (
                    !Number.isInteger(
                        existingId
                    ) ||
                    existingId <= 0
                ) {

                    throw new Error(
                        `UPDATE nhưng existingId không hợp lệ: ${item.existingId}`
                    );
                }


                // -------------------------------------
                // KIỂM TRA THIẾT BỊ
                // -------------------------------------

                const existing =
                    await prisma.device.findUnique({

                        where: {
                            id:
                                existingId
                        }

                    });


                if (!existing) {

                    throw new Error(
                        `Không tìm thấy thiết bị ID=${existingId}`
                    );
                }


                // -------------------------------------
                // UPDATE DATA
                // -------------------------------------
                //
                // TUYỆT ĐỐI KHÔNG update:
                // - id
                // - deviceKey
                //
                // Device Key phải giữ nguyên.
                // -------------------------------------

                const updateData = {

                    ...data

                };


                // -------------------------------------
                // DEBUG
                // -------------------------------------

                console.log(
                    `[IMPORT][UPDATE] Excel row ${excelRow}`,
                    {
                        existingId,

                        oldDeviceKey:
                            existing.deviceKey,

                        excelDeviceKey:
                            row.deviceKey,

                        matchedBy:
                            item.matchedBy,

                        deviceId:
                            data.deviceId,

                        name:
                            data.name,

                        changedFields:
                            item.changedFields || []
                    }
                );


                // -------------------------------------
                // UPDATE BẰNG ID
                // -------------------------------------
                //
                // Đây là điểm quan trọng nhất.
                //
                // KHÔNG dùng:
                //
                // where: {
                //     line_code: ...
                // }
                //
                // -------------------------------------

                await prisma.device.update({

                    where: {
                        id:
                            existingId
                    },

                    data:
                        updateData

                });


                updated++;


                continue;
            }


            // =========================================
            // ACTION KHÔNG HỢP LỆ
            // =========================================

            throw new Error(
                `Action không hợp lệ: ${action}`
            );

        }

        catch (err) {

            console.error(
                `[IMPORT][ERROR] Excel row ${excelRow}:`,
                err
            );


            errors.push({

                row:
                    excelRow,

                action:
                    item?.action || null,

                existingId:
                    item?.existingId || null,

                matchedBy:
                    item?.matchedBy || null,

                deviceKey:
                    item?.row?.deviceKey ||
                    null,

                deviceId:
                    item?.row?.deviceId ||
                    null,

                name:
                    item?.row?.name ||
                    "",

                message:
                    err.message

            });

        }

    }


    // =================================================
    // SUMMARY
    // =================================================

    const result = {

        total:
            rows.length,

        inserted,

        updated,

        skipped,

        errors

    };


    console.log(
        "========================================"
    );

    console.log(
        "IMPORT SUMMARY"
    );

    console.log(
        "TOTAL:",
        result.total
    );

    console.log(
        "INSERTED:",
        result.inserted
    );

    console.log(
        "UPDATED:",
        result.updated
    );

    console.log(
        "SKIPPED:",
        result.skipped
    );

    console.log(
        "ERRORS:",
        result.errors.length
    );

    console.log(
        "========================================"
    );


    return result;
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    importRows

};