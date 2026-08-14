const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const crypto = require("crypto");

const prisma = new PrismaClient();


// =====================================================
// UTILS
// =====================================================

const {
    parseDate,
    formatDate,
    calculateExpiryDate
} = require("../utils/date");

const {
    normalizeStatus,
    calcMaintenance
} = require("../utils/status");


// =====================================================
// CATEGORY
// =====================================================

const {
    detectCategory
} = require("../services/category.service");


// =====================================================
// IMPORT SERVICES
// =====================================================

const {
    compareRows
} = require("../services/compare.service");

const {
    importRows
} = require("../services/import.service");


// =====================================================
// HISTORY
// =====================================================

async function writeHistory({
    deviceId = null,
    action,
    user,
    code,
    name,
    note = "",
    changes = null
}) {

    try {

        await prisma.deviceHistory.create({

            data: {

                deviceId,

                action,

                user,

                code,

                name,

                note,

                changes

            }

        });

    }
    catch (err) {

        console.error(
            "DeviceHistory:",
            err.message
        );

    }

}


// =====================================================
// IMPORT SESSION
// =====================================================
//
// Session dùng để:
//
// PREVIEW
//    ↓
// tạo sessionId
//    ↓
// lưu rows tạm thời
//    ↓
// CONFIRM
//    ↓
// importRows()
//    ↓
// xóa session
//
// Session sống tối đa 30 phút.
// =====================================================

const importSessions =
    new Map();


function createImportSession(
    rows,
    summary
) {

    const sessionId =
        crypto.randomUUID();


    importSessions.set(
        sessionId,
        {

            rows,

            summary,

            createdAt:
                Date.now()

        }
    );


    return sessionId;
}


function getImportSession(
    sessionId
) {

    return importSessions.get(
        sessionId
    );

}


function deleteImportSession(
    sessionId
) {

    importSessions.delete(
        sessionId
    );

}


// =====================================================
// AUTO CLEAN IMPORT SESSION
// =====================================================
//
// Xóa session sau 30 phút.
// =====================================================

setInterval(() => {

    const now =
        Date.now();


    for (
        const [
            id,
            session
        ]
        of importSessions.entries()
    ) {

        if (
            now -
            session.createdAt
            >
            30 * 60 * 1000
        ) {

            importSessions.delete(
                id
            );

        }

    }

}, 5 * 60 * 1000);


// =====================================================
// NORMALIZE VALUE
// =====================================================

function normalizeCompare(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(
        value
    ).trim();

}


// =====================================================
// BUILD DEVICE DATA
// =====================================================
//
// Dùng cho CREATE / UPDATE thủ công.
//
// KHÔNG cho phép frontend thay deviceKey.
// =====================================================

function buildManualDeviceData(
    d
) {

    const data = {

        deviceId:
            d.deviceId === null ||
            d.deviceId === undefined ||
            d.deviceId === ""
                ? null
                : String(
                    d.deviceId
                ).trim(),

        name:
            d.name || "",

        category:
            d.category || null,

        line:
            d.line || "",

        station:
            d.station || "",

        code:
            d.code || null,

        area:
            d.area || "",

        status:
            normalizeStatus(
                d.status
            ),

        installDate:
            parseDate(
                d.installDate
            ),

        lastMaintenance:
            parseDate(
                d.lastMaintenance
            ),

        replacementDate:
            parseDate(
                d.replacementDate
            ),

        lifespan:
            d.lifespan === "" ||
            d.lifespan === null ||
            d.lifespan === undefined
                ? 0
                : Number(
                    d.lifespan
                ) || 0,

        expiryDate:
            parseDate(
                d.expiryDate
            ),

        note:
            d.note || ""

    };


    // =================================================
    // CATEGORY AUTO DETECT
    // =================================================

    if (
        !data.category
    ) {

        const categoryInfo =
            detectCategory({

                name:
                    data.name,

                code:
                    data.code,

                model:
                    d.model || "",

                brand:
                    d.brand || ""

            });


        data.category =
            categoryInfo?.category ||
            null;

    }


    // =================================================
    // EXPIRY DATE
    // =================================================

    if (
        !data.expiryDate &&
        data.installDate &&
        data.lifespan > 0
    ) {

        data.expiryDate =
            calculateExpiryDate(
                data.installDate,
                data.lifespan
            );

    }


    return data;

}


// =====================================================
// GET HISTORY
// =====================================================

exports.getHistory =
async (
    req,
    res
) => {

    try {

        const histories =
            await prisma.deviceHistory.findMany({

                orderBy: {

                    createdAt:
                        "desc"

                }

            });


        res.json(
            histories
        );

    }
    catch (err) {

        console.error(
            err
        );

        res.status(500).json({

            success:
                false,

            message:
                "Không thể lấy lịch sử thiết bị."

        });

    }

};


// =====================================================
// GET ALL DEVICES
// =====================================================

exports.getDevices =
async (
    req,
    res
) => {

    try {

        const devices =
            await prisma.device.findMany({

                orderBy: {

                    id:
                        "desc"

                }

            });


        const data =
            devices.map(
                device => ({

                    ...device,

                    status:
                        calcMaintenance(
                            device
                        )

                })
            );


        res.json(
            data
        );

    }
    catch (err) {

        console.error(
            "GET DEVICES ERROR:",
            err
        );

        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// GET ONE DEVICE
// =====================================================

exports.getOne =
async (
    req,
    res
) => {

    try {

        const rawId =
            req.params.id;


        if (
            !rawId
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Thiếu id."

            });

        }


        const id =
            Number(
                rawId
            );


        if (
            !Number.isInteger(
                id
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "ID không hợp lệ."

            });

        }


        const device =
            await prisma.device.findUnique({

                where: {
                    id
                }

            });


        if (
            !device
        ) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Không tìm thấy thiết bị."

            });

        }


        res.json({

            ...device,

            status:
                calcMaintenance(
                    device
                )

        });

    }
    catch (err) {

        console.error(
            "GET ONE DEVICE ERROR:",
            err
        );

        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// CREATE DEVICE
// =====================================================
//
// Device Key:
//
// KHÔNG nhận từ frontend.
// KHÔNG nhận từ Excel.
// Server tự tạo.
//
// =====================================================

exports.createDevice =
async (
    req,
    res
) => {

    try {

        const d =
            req.body || {};


        if (
            !d.name ||
            !String(
                d.name
            ).trim()
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Tên thiết bị không được để trống."

            });

        }


        const data =
            buildManualDeviceData(
                d
            );


        // =================================================
        // DEVICE KEY
        // =================================================

        const deviceKey =
            crypto.randomUUID();


        const device =
            await prisma.device.create({

                data: {

                    deviceKey,

                    ...data

                }

            });


        // =================================================
        // HISTORY
        // =================================================

        await writeHistory({

            deviceId:
                device.id,

            action:
                "CREATE",

            user:
                req.user?.username ||
                "System",

            code:
                device.deviceId,

            name:
                device.name,

            note:
                "Thêm thiết bị"

        });


        res.status(201).json(
            device
        );

    }
    catch (err) {

        console.error(
            "CREATE DEVICE ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// UPDATE DEVICE
// =====================================================
//
// QUAN TRỌNG:
//
// Không cho UPDATE thay:
//
// - id
// - deviceKey
//
// Device Key phải bất biến.
// =====================================================

exports.updateDevice =
async (
    req,
    res
) => {

    try {

        const id =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(
                id
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "ID không hợp lệ."

            });

        }


        const d =
            req.body || {};


        const oldDevice =
            await prisma.device.findUnique({

                where: {
                    id
                }

            });


        if (
            !oldDevice
        ) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Không tìm thấy thiết bị."

            });

        }


        const data =
            buildManualDeviceData(
                d
            );


        // =================================================
        // KHÔNG cho phép frontend thay Device Key
        // =================================================

        delete data.deviceKey;


        // =================================================
        // UPDATE
        // =================================================

        const updated =
            await prisma.device.update({

                where: {
                    id
                },

                data

            });


        // =================================================
        // CHANGE HISTORY
        // =================================================

        const changes = {};


        const fields = [

            "deviceId",

            "name",

            "category",

            "line",

            "station",

            "code",

            "area",

            "status",

            "installDate",

            "lastMaintenance",

            "replacementDate",

            "lifespan",

            "expiryDate",

            "note"

        ];


        for (
            const key
            of fields
        ) {

            const oldValue =
                oldDevice[key];


            const newValue =
                updated[key];


            if (
                key ===
                "installDate" ||
                key ===
                "lastMaintenance" ||
                key ===
                "replacementDate" ||
                key ===
                "expiryDate"
            ) {

                const oldDate =
                    oldValue
                        ? new Date(
                            oldValue
                        )
                            .toISOString()
                            .slice(
                                0,
                                10
                            )
                        : "";

                const newDate =
                    newValue
                        ? new Date(
                            newValue
                        )
                            .toISOString()
                            .slice(
                                0,
                                10
                            )
                        : "";


                if (
                    oldDate !==
                    newDate
                ) {

                    changes[key] = {

                        old:
                            oldValue,

                        new:
                            newValue

                    };

                }


                continue;

            }


            if (
                normalizeCompare(
                    oldValue
                ) !==
                normalizeCompare(
                    newValue
                )
            ) {

                changes[key] = {

                    old:
                        oldValue,

                    new:
                        newValue

                };

            }

        }


        // =================================================
        // WRITE HISTORY
        // =================================================

        if (
            Object.keys(
                changes
            ).length > 0
        ) {

            await writeHistory({

                deviceId:
                    updated.id,

                action:
                    "UPDATE",

                user:
                    req.user?.username ||
                    "System",

                code:
                    updated.deviceId,

                name:
                    updated.name,

                note:
                    "Cập nhật thiết bị",

                changes

            });

        }


        res.json(
            updated
        );

    }
    catch (err) {

        console.error(
            "UPDATE DEVICE ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// DELETE DEVICE
// =====================================================

exports.deleteDevice =
async (
    req,
    res
) => {

    try {

        const id =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(
                id
            )
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "ID không hợp lệ."

            });

        }


        const device =
            await prisma.device.findUnique({

                where: {
                    id
                }

            });


        if (
            !device
        ) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Không tìm thấy thiết bị."

            });

        }


        await prisma.device.delete({

            where: {
                id
            }

        });


        await writeHistory({

            deviceId:
                id,

            action:
                "DELETE",

            user:
                req.user?.username ||
                "System",

            code:
                device.deviceId,

            name:
                device.name,

            note:
                "Xóa thiết bị"

        });


        res.json({

            success:
                true,

            message:
                "Đã xóa thiết bị."

        });

    }
    catch (err) {

        console.error(
            "DELETE DEVICE ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// PREVIEW IMPORT
// =====================================================
//
// Excel
//   ↓
// XLSX buffer
//   ↓
// excelRows
//   ↓
// compareRows()
//   ↓
// session
//   ↓
// frontend
//
// Chưa ghi database.
// =====================================================

exports.previewImport =
async (
    req,
    res
) => {

    try {

        if (
            !req.file
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Chưa chọn file Excel."

            });

        }


        if (
            !req.file.buffer
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Không đọc được nội dung file Excel."

            });

        }


        // =================================================
        // READ EXCEL
        // =================================================

        const workbook =
            XLSX.read(

                req.file.buffer,

                {
                    type:
                        "buffer"
                }

            );


        if (
            !workbook.SheetNames ||
            workbook.SheetNames.length === 0
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "File Excel không có sheet."

            });

        }


        const sheetName =
            workbook.SheetNames[0];


        const sheet =
            workbook.Sheets[
                sheetName
            ];


        if (
            !sheet
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Không tìm thấy sheet đầu tiên."

            });

        }


        // =================================================
        // SHEET → JSON
        // =================================================

        const excelRows =
            XLSX.utils.sheet_to_json(

                sheet,

                {

                    raw:
                        true,

                    defval:
                        ""

                }

            );


        if (
            !excelRows.length
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "File Excel không có dữ liệu."

            });

        }


        console.log(
            "========================================"
        );

        console.log(
            "IMPORT PREVIEW"
        );

        console.log(
            "FILE:",
            req.file.originalname
        );

        console.log(
            "SHEET:",
            sheetName
        );

        console.log(
            "ROWS:",
            excelRows.length
        );

        console.log(
            "FIRST ROW:"
        );

        console.dir(
            excelRows[0],
            {
                depth:
                    null
            }
        );

        console.log(
            "========================================"
        );


        // =================================================
        // COMPARE
        // =================================================

        const result =
            await compareRows(

                prisma,

                excelRows

            );


        // =================================================
        // CREATE SESSION
        // =================================================

        const sessionId =
            createImportSession(

                result.rows,

                result.summary

            );


        // =================================================
        // RESPONSE
        // =================================================

        return res.json({

            success:
                true,

            sessionId,

            summary:
                result.summary,

            rows:
                result.rows

        });

    }
    catch (err) {

        console.error(
            "PREVIEW IMPORT ERROR:",
            err
        );


        return res.status(500).json({

            success:
                false,

            message:
                err.message

        });

    }

};


// =====================================================
// CONFIRM IMPORT
// =====================================================
//
// Frontend chỉ gửi:
//
// {
//     sessionId: "..."
// }
//
// Controller lấy rows từ session.
//
// Không nhận rows từ frontend.
// Không cho frontend tự sửa existingId.
//
// =====================================================

exports.confirmImport =
async (
    req,
    res
) => {

    try {

        const {
            sessionId
        } =
            req.body || {};


        if (
            !sessionId
        ) {

            return res.status(400).json({

                success:
                    false,

                message:
                    "Thiếu sessionId."

            });

        }


        // =================================================
        // GET SESSION
        // =================================================

        const session =
            getImportSession(
                sessionId
            );


        if (
            !session
        ) {

            return res.status(404).json({

                success:
                    false,

                message:
                    "Phiên import đã hết hạn hoặc không tồn tại."

            });

        }


        console.log(
            "========================================"
        );

        console.log(
            "IMPORT CONFIRM"
        );

        console.log(
            "SESSION:",
            sessionId
        );

        console.log(
            "ROWS:",
            session.rows.length
        );

        console.log(
            "SUMMARY:",
            session.summary
        );

        console.log(
            "========================================"
        );


        // =================================================
        // IMPORT
        // =================================================

        const result =
            await importRows(

                prisma,

                session.rows

            );


        // =================================================
        // DELETE SESSION
        // =================================================

        deleteImportSession(
            sessionId
        );


        // =================================================
        // WRITE IMPORT HISTORY
        // =================================================
        //
        // History chi tiết CREATE/UPDATE/DELETE
        // đã do từng API riêng xử lý.
        //
        // Import chỉ ghi log tổng quan.
        //
        // =================================================

        console.log(
            "========================================"
        );

        console.log(
            "IMPORT RESULT"
        );

        console.log(
            result
        );

        console.log(
            "========================================"
        );


        // =================================================
        // RESPONSE
        // =================================================

        return res.json({

            success:
                true,

            inserted:
                result.inserted,

            updated:
                result.updated,

            skipped:
                result.skipped,

            errors:
                result.errors || [],

            total:
                result.total

        });

    }
    catch (err) {

        console.error(
            "CONFIRM IMPORT ERROR:",
            err
        );


        return res.status(500).json({

            success:
                false,

            message:
                err.message

        });

    }

};


// =====================================================
// EXPORT DEVICES
// =====================================================

exports.exportDevices =
async (
    req,
    res
) => {

    try {

        const devices =
            await prisma.device.findMany({

                orderBy: {

                    id:
                        "asc"

                }

            });


        const rows =
            devices.map(
                device => ({

                    "Device Key":
                        device.deviceKey ||
                        "",

                    "Tên thiết bị":
                        device.name ||
                        "",

                    "Phân loại":
                        device.category ||
                        "",

                    "Hãng":
                        device.brand ||
                        "",

                    "Model":
                        device.model ||
                        "",

                    "Tuyến":
                        device.line ||
                        "",

                    "Nhà ga":
                        device.station ||
                        "",

                    "Khu vực":
                        device.area ||
                        "",

                    "Mã ID":
                        device.deviceId ||
                        "",

                    "Ký hiệu":
                        device.code ||
                        "",

                    "Trạng thái":
                        calcMaintenance(
                            device
                        ),

                    "Ngày lắp":
                        formatDate(
                            device.installDate
                        ),

                    "Ngày lắp lần đầu":
                        formatDate(
                            device.originalInstallDate
                        ),

                    "Ngày thay thế":
                        formatDate(
                            device.replacementDate
                        ),

                    "Bảo dưỡng gần nhất":
                        formatDate(
                            device.lastMaintenance
                        ),

                    "Tuổi thọ":
                        device.lifespan ||
                        "",

                    "Ngày hết hạn":
                        formatDate(
                            device.expiryDate
                        ),

                    "Ghi chú":
                        device.note ||
                        ""

                })
            );


        const workbook =
            XLSX.utils.book_new();


        const worksheet =
            XLSX.utils.json_to_sheet(
                rows
            );


        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Devices"

        );


        // =================================================
        // AUTO WIDTH
        // =================================================

        const headers =
            Object.keys(
                rows[0] || {}
            );


        worksheet["!cols"] =
            headers.map(
                header => ({

                    wch:
                        Math.min(
                            40,
                            Math.max(
                                12,
                                header.length + 2
                            )
                        )

                })
            );


        const buffer =
            XLSX.write(

                workbook,

                {

                    type:
                        "buffer",

                    bookType:
                        "xlsx"

                }

            );


        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );


        res.setHeader(

            "Content-Disposition",

            'attachment; filename="devices.xlsx"'

        );


        res.send(
            buffer
        );

    }
    catch (err) {

        console.error(
            "EXPORT DEVICES ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// GET DEVICE CATEGORIES
// =====================================================

exports.getCategories =
async (
    req,
    res
) => {

    try {

        const devices =
            await prisma.device.findMany({

                select: {

                    category:
                        true

                }

            });


        const counter =
            {};


        for (
            const device
            of devices
        ) {

            const category =
                device.category?.trim() ||
                "Chưa phân loại";


            counter[category] =
                (
                    counter[category] ||
                    0
                ) + 1;

        }


        const result =
            Object.keys(
                counter
            )

            .sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        "vi"
                    )
            )

            .map(
                name => ({

                    id:
                        name,

                    name,

                    count:
                        counter[name]

                })
            );


        res.json(
            result
        );

    }
    catch (err) {

        console.error(
            "GET CATEGORIES ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// UPDATE ALL DEVICE CATEGORIES
// =====================================================

exports.updateCategories =
async (
    req,
    res
) => {

    try {

        const devices =
            await prisma.device.findMany({

                orderBy: {

                    id:
                        "asc"

                }

            });


        let updated =
            0;


        for (
            const device
            of devices
        ) {

            const result =
                detectCategory({

                    name:
                        device.name,

                    code:
                        device.code,

                    model:
                        device.model,

                    brand:
                        device.brand

                });


            console.log(

                `[${device.id}]`,

                device.name,

                "=>",

                result?.category,

                `(${result?.score || 0} điểm)`,

                result?.brand || ""

            );


            await prisma.device.update({

                where: {

                    id:
                        device.id

                },

                data: {

                    category:
                        result?.category ||
                        null,

                    brand:
                        result?.brand ||
                        device.brand ||
                        null

                }

            });


            updated++;

        }


        res.json({

            success:
                true,

            updated,

            total:
                devices.length

        });

    }
    catch (err) {

        console.error(
            "UPDATE CATEGORIES ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            message:
                err.message

        });

    }

};


// =====================================================
// GET DEVICES BY CATEGORY
// =====================================================

exports.getByCategory =
async (
    req,
    res
) => {

    try {

        const category =
            decodeURIComponent(
                req.params.name
            );


        const where =
            category ===
            "Chưa phân loại"

                ? {

                    OR: [

                        {
                            category:
                                null
                        },

                        {
                            category:
                                ""
                        }

                    ]

                }

                : {

                    category

                };


        const devices =
            await prisma.device.findMany({

                where,

                orderBy: {

                    id:
                        "desc"

                }

            });


        const data =
            devices.map(
                device => ({

                    ...device,

                    status:
                        calcMaintenance(
                            device
                        )

                })
            );


        res.json(
            data
        );

    }
    catch (err) {

        console.error(
            "GET BY CATEGORY ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// GET DEVICE STATISTICS
// =====================================================

exports.getStatistics =
async (
    req,
    res
) => {

    try {

        const devices =
            await prisma.device.findMany();


        const statistics = {

            total:
                devices.length,

            active:
                0,

            maintenance:
                0,

            inactive:
                0,

            expired:
                0,

            expiring:
                0,

            categories:
                {},

            brands:
                {},

            lines:
                {},

            stations:
                {}

        };


        for (
            const device
            of devices
        ) {

            // =========================================
            // STATUS
            // =========================================

            const status =
                calcMaintenance(
                    device
                );


            if (
                status ===
                "Active"
            ) {

                statistics.active++;

            }
            else if (
                status ===
                "Maintenance"
            ) {

                statistics.maintenance++;

            }
            else {

                statistics.inactive++;

            }


            // =========================================
            // CATEGORY
            // =========================================

            const category =
                device.category?.trim() ||
                "Chưa phân loại";


            statistics.categories[
                category
            ] =
                (
                    statistics.categories[
                        category
                    ] ||
                    0
                ) + 1;


            // =========================================
            // BRAND
            // =========================================

            const brand =
                device.brand?.trim() ||
                "Chưa xác định";


            statistics.brands[
                brand
            ] =
                (
                    statistics.brands[
                        brand
                    ] ||
                    0
                ) + 1;


            // =========================================
            // LINE
            // =========================================

            const line =
                device.line?.trim() ||
                "Chưa xác định";


            statistics.lines[
                line
            ] =
                (
                    statistics.lines[
                        line
                    ] ||
                    0
                ) + 1;


            // =========================================
            // STATION
            // =========================================

            const station =
                device.station?.trim() ||
                "Chưa xác định";


            statistics.stations[
                station
            ] =
                (
                    statistics.stations[
                        station
                    ] ||
                    0
                ) + 1;


            // =========================================
            // EXPIRY
            // =========================================

            if (
                device.expiryDate
            ) {

                const expiry =
                    new Date(
                        device.expiryDate
                    );


                const now =
                    new Date();


                if (
                    expiry <
                    now
                ) {

                    statistics.expired++;

                }
                else {

                    const diff =
                        expiry.getTime() -
                        now.getTime();


                    const days =
                        Math.ceil(
                            diff /
                            (
                                1000 *
                                60 *
                                60 *
                                24
                            )
                        );


                    if (
                        days <=
                        90
                    ) {

                        statistics.expiring++;

                    }

                }

            }

        }


        res.json(
            statistics
        );

    }
    catch (err) {

        console.error(
            "GET STATISTICS ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// GET FILTER OPTIONS
// =====================================================

exports.getFilters =
async (
    req,
    res
) => {

    try {

        const devices =
            await prisma.device.findMany({

                select: {

                    brand:
                        true,

                    line:
                        true,

                    station:
                        true,

                    category:
                        true

                }

            });


        const unique =
            values =>
                [
                    ...
                    new Set(

                        values

                            .map(
                                value =>
                                    value?.trim()
                            )

                            .filter(
                                Boolean
                            )

                    )
                ]

                .sort(
                    (a, b) =>
                        a.localeCompare(
                            b,
                            "vi"
                        )
                );


        res.json({

            brands:
                unique(
                    devices.map(
                        d => d.brand
                    )
                ),

            lines:
                unique(
                    devices.map(
                        d => d.line
                    )
                ),

            stations:
                unique(
                    devices.map(
                        d => d.station
                    )
                ),

            categories:
                unique(
                    devices.map(
                        d => d.category
                    )
                )

        });

    }
    catch (err) {

        console.error(
            "GET FILTERS ERROR:",
            err
        );


        res.status(500).json({

            success:
                false,

            error:
                err.message

        });

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    ...exports

};