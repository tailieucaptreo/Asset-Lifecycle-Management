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
// QUY TẮC:
//
// 1. originalInstallDate KHÔNG xử lý ở đây
//    → giữ nguyên ngày lắp ban đầu trong DB.
//
// 2. replacementDate có giá trị:
//       installDate = replacementDate
//
// 3. replacementDate có giá trị:
//       status = Active
//
// 4. replacementDate có giá trị:
//       expiryDate = replacementDate + lifespan
//
// 5. deviceKey không xử lý ở đây.
// =====================================================

function buildDeviceData(row) {

    const d =
        row || {};


    // =================================================
    // REPLACEMENT DATE
    // =================================================

    const replacementDate =
        parseDate(
            d.replacementDate
        );


    // =================================================
    // INSTALL DATE
    // =================================================
    //
    // Nếu có ngày thay thế:
    //
    //     installDate = replacementDate
    //
    // Nếu không:
    //
    //     installDate = ngày lắp trong Excel
    //
    // =================================================

    let installDate =
        parseDate(
            d.installDate
        );


    if (replacementDate) {

        installDate =
            replacementDate;

    }


    // =================================================
    // LIFESPAN
    // =================================================

    const lifespan =
        toNumber(
            d.lifespan,
            0
        );


    // =================================================
    // EXPIRY DATE
    // =================================================

    let expiryDate =
        parseDate(
            d.expiryDate
        );


    // =================================================
    // NẾU CÓ NGÀY THAY THẾ
    //
    // Bắt buộc tính lại ngày hết hạn.
    //
    // Ví dụ:
    //
    // replacementDate = 18/08/2026
    // lifespan = 10
    //
    // expiryDate = 18/08/2036
    // =================================================

    if (
        replacementDate &&
        lifespan > 0
    ) {

        expiryDate =
            calculateExpiryDate(
                replacementDate,
                lifespan
            );

    }

    // =================================================
    // NẾU KHÔNG CÓ NGÀY THAY THẾ
    //
    // Excel không có expiryDate
    // → tính từ installDate + lifespan.
    // =================================================

    else if (
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


    // =================================================
    // CATEGORY
    // =================================================

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


    // =================================================
    // STATUS
    // =================================================
    //
    // Nếu có ngày thay thế:
    //
    //     Active
    //
    // Nếu không:
    //
    //     lấy status từ Excel.
    //
    // Tuy nhiên khi UPDATE chúng ta sẽ quyết định
    // có ghi status hay không ở phía dưới.
    //
    // =================================================

    let status =
        normalizeStatus(
            d.status
        );


    if (replacementDate) {

        status =
            normalizeStatus(
                "Active"
            );

    }


    // =================================================
    // RETURN
    // =================================================

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

        status,

        installDate,

        lastMaintenance:
            parseDate(
                d.lastMaintenance
            ),

        replacementDate,

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
            // BUILD DATA
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
                            data.name,

                        installDate:
                            data.installDate,

                        replacementDate:
                            data.replacementDate,

                        expiryDate:
                            data.expiryDate,

                        status:
                            data.status

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
                // LẤY THIẾT BỊ CŨ
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

                const updateData = {

                    ...data

                };


                // =================================================
                // ORIGINAL INSTALL DATE
                // =================================================
                //
                // RẤT QUAN TRỌNG:
                //
                // Không cho Excel ghi đè ngày lắp ban đầu.
                //
                // Prisma schema của bạn có:
                //
                // originalInstallDate
                //
                // nên giá trị cũ phải được giữ nguyên.
                //
                // =================================================

                delete updateData.originalInstallDate;


                // =================================================
                // STATUS
                // =================================================
                //
                // TRƯỜNG HỢP 1:
                //
                // Có ngày thay thế
                //
                // → PHẢI cập nhật status = Active
                //
                // TRƯỜNG HỢP 2:
                //
                // Không có ngày thay thế
                //
                // → KHÔNG lấy status export từ Excel
                //    ghi ngược vào DB.
                //
                // =================================================

                if (
                    data.replacementDate
                ) {

                    updateData.status =
                        normalizeStatus(
                            "Active"
                        );

                }
                else {

                    delete updateData.status;

                }


                // =================================================
                // DEBUG REPLACEMENT
                // =================================================

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

                        oldInstallDate:
                            existing.installDate,

                        oldOriginalInstallDate:
                            existing.originalInstallDate,

                        oldReplacementDate:
                            existing.replacementDate,

                        excelInstallDate:
                            data.installDate,

                        excelReplacementDate:
                            data.replacementDate,

                        newExpiryDate:
                            data.expiryDate,

                        newStatus:
                            updateData.status ||
                            "(KHÔNG UPDATE)",

                        changedFields:
                            item.changedFields || []

                    }
                );


                // =================================================
                // UPDATE DATABASE
                // =================================================
                //
                // CHỈ UPDATE BẰNG ID
                //
                // KHÔNG update:
                // - id
                // - deviceKey
                // - originalInstallDate
                //
                // =================================================

                await prisma.device.update({

                    where: {

                        id:
                            existingId

                    },

                    data:
                        updateData

                });


                updated++;


                console.log(
                    `[IMPORT][UPDATE SUCCESS] Excel row ${excelRow}`,
                    {

                        id:
                            existingId,

                        installDate:
                            updateData.installDate,

                        replacementDate:
                            updateData.replacementDate,

                        expiryDate:
                            updateData.expiryDate,

                        status:
                            updateData.status ||
                            "(GIỮ NGUYÊN)"

                    }
                );


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
                    item?.action ||
                    null,

                existingId:
                    item?.existingId ||
                    null,

                matchedBy:
                    item?.matchedBy ||
                    null,

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