const {
    parseDate,
    calculateExpiryDate
} = require("../utils/date");

const {
    detectCategory
} = require("./category.service");

const crypto = require("crypto");


// =====================================================
// IMPORT DEVICES
// =====================================================

async function importRows(prisma, rows) {

    let created = 0;
    let updated = 0;
    let skipped = 0;

    const failed = [];

    for (const item of rows) {

        // ============================================
        // SKIP
        // ============================================

        if (item.action === "SKIP") {

            skipped++;

            continue;

        }

        const d = item.row;

        if (!d) {

            skipped++;

            failed.push({

                message:
                    "Dòng import không có dữ liệu row."

            });

            continue;

        }

        try {

            // ========================================
            // DATE
            // ========================================

            const installDate =
                parseDate(d.installDate);

            // ========================================
            // CATEGORY
            // ========================================

            const categoryInfo =
                detectCategory({

                    name: d.name,

                    code: d.code,

                    model: d.model || ""

                });

            // ========================================
            // DATA
            // ========================================

            const data = {

                name:
                    d.name || "",

                category:
                    d.category ||
                    categoryInfo.category ||
                    null,

                line:
                    d.line || "",

                station:
                    d.station || "",

                code:
                    d.code || null,

                area:
                    d.area || null,

                deviceId:
                    d.deviceId
                        ? String(
                            d.deviceId
                        ).trim()
                        : null,

                status:
                    d.status ||
                    "Running",

                originalInstallDate:
                    installDate,

                installDate:
                    installDate,

                lastMaintenance:
                    parseDate(
                        d.lastMaintenance
                    ),

                replacementDate:
                    parseDate(
                        d.replacementDate
                    ),

                lifespan:
                    d.lifespan !== undefined &&
                    d.lifespan !== ""
                        ? Number(d.lifespan)
                        : null,

                expiryDate:
                    parseDate(
                        d.expiryDate
                    ) ||
                    calculateExpiryDate(
                        installDate,
                        d.lifespan
                    )

            };


            // ========================================
            // NEW
            // ========================================

            if (item.action === "NEW") {

                // ------------------------------------
                // TẠO DEVICE KEY
                // ------------------------------------

                data.deviceKey =
                    crypto.randomUUID();

                await prisma.device.create({

                    data

                });

                created++;

                continue;

            }


            // ========================================
            // UPDATE
            // ========================================

            if (item.action === "UPDATE") {

                /*
                 * Không update deviceKey.
                 *
                 * Thiết bị đã tồn tại được xác định
                 * bằng:
                 *
                 * line + station + code
                 */

                if (
                    !d.line ||
                    !d.station ||
                    !d.code
                ) {

                    skipped++;

                    failed.push({

                        deviceId:
                            d.deviceId,

                        name:
                            d.name,

                        message:
                            "Thiếu Tuyến / Nhà ga / Ký hiệu để xác định thiết bị."

                    });

                    continue;

                }


                // ------------------------------------
                // Tìm thiết bị cũ
                // ------------------------------------

                const oldDevice =
                    await prisma.device.findFirst({

                        where: {

                            line:
                                d.line,

                            station:
                                d.station,

                            code:
                                d.code

                        }

                    });


                if (!oldDevice) {

                    /*
                     * Trường hợp preview nói UPDATE
                     * nhưng DB không tìm thấy.
                     *
                     * Không tự tạo ở đây để tránh
                     * tạo nhầm dữ liệu.
                     */

                    skipped++;

                    failed.push({

                        deviceId:
                            d.deviceId,

                        name:
                            d.name,

                        message:
                            "Không tìm thấy thiết bị cũ để cập nhật."

                    });

                    continue;

                }


                // ------------------------------------
                // UPDATE
                // ------------------------------------

                await prisma.device.update({

                    where: {

                        id:
                            oldDevice.id

                    },

                    data

                });

                updated++;

                continue;

            }


            // ========================================
            // ACTION KHÔNG HỢP LỆ
            // ========================================

            skipped++;

            failed.push({

                deviceId:
                    d.deviceId,

                name:
                    d.name,

                message:
                    `Action không hợp lệ: ${item.action}`

            });

        }

        catch (err) {

            failed.push({

                deviceId:
                    d.deviceId,

                name:
                    d.name,

                message:
                    err.message

            });

        }

    }


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


module.exports = {

    importRows

};
