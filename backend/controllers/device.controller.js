const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* =====================================================
   HISTORY
===================================================== */

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

        console.error("DeviceHistory:", err.message);

    }

}

const XLSX = require("xlsx");
const crypto = require("crypto");

// ================= IMPORT SESSION =================

const importSessions = new Map();

function createImportSession(rows, summary) {

    const sessionId = crypto.randomUUID();

    importSessions.set(sessionId, {

        rows,

        summary,

        createdAt: Date.now()

    });

    return sessionId;

}

function getImportSession(sessionId) {

    return importSessions.get(sessionId);

}

function deleteImportSession(sessionId) {

    importSessions.delete(sessionId);

}

// ================= AUTO CLEAN SESSION =================

setInterval(() => {

    const now = Date.now();

    for (const [id, session] of importSessions.entries()) {

        if (now - session.createdAt > 30 * 60 * 1000) {

            importSessions.delete(id);

        }

    }

}, 5 * 60 * 1000);

// ================= DATE =================

const {

    parseDate,

    formatDate,

    calculateExpiryDate

} = require("../utils/date");

// ================= STATUS =================

const {

    calcMaintenance

} = require("../utils/status");

// ================= CATEGORY =================

const {

    detectCategory

} = require("../services/category.service");

// ================= IMPORT SERVICES =================

const {

    compareRows

} = require("../services/compare.service");

const {

    importRows

} = require("../services/import.service");

/* =====================================================
   GET HISTORY
===================================================== */

exports.getHistory = async (req, res) => {

    try {

        const histories = await prisma.deviceHistory.findMany({

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(histories);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Không thể lấy lịch sử thiết bị."

        });

    }

};

// =====================================================
// GET ALL DEVICES
// =====================================================

exports.getDevices = async (req, res) => {

    try {

        const devices = await prisma.device.findMany({

            orderBy: {

                id: "desc"

            }

        });

        const data = devices.map(device => ({

            ...device,
        
            status: calcMaintenance(device)
        
        }));
        
        res.json(data);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};

// =====================================================
// GET ONE DEVICE
// =====================================================

exports.getOne = async (req, res) => {
    try {
        console.log("URL:", req.originalUrl);
        console.log("Params:", req.params);

        const rawId = req.params.id;

        if (!rawId) {
            return res.status(400).json({
                message: "Thiếu id."
            });
        }

        const id = Number(rawId);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                message: "ID không hợp lệ."
            });
        }

        const device = await prisma.device.findUnique({
            where: { id }
        });

        if (!device) {
            return res.status(404).json({
                message: "Không tìm thấy thiết bị."
            });
        }

        return res.json({
            ...device,
            status: calcMaintenance(device)
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
};

// =====================================================
// CREATE DEVICE
// =====================================================

exports.createDevice = async (req, res) => {

    try {

        const d = req.body;

        const categoryInfo = detectCategory({

            name: d.name,

            code: d.code,

            model: d.model,

        });

        const installDate = parseDate(d.installDate);

        const device = await prisma.device.create({
         
             data: {
         
                 ...d,
         
                 category: categoryInfo.category,
         
                 originalInstallDate: installDate,
         
                 installDate: installDate,
         
                 lastMaintenance: parseDate(d.lastMaintenance),
         
                 replacementDate: parseDate(d.replacementDate),
         
                 expiryDate: parseDate(d.expiryDate)
         
             }
         
        });

        await writeHistory({

            deviceId: device.id,
        
            action: "CREATE",
        
            user: req.user?.username || "System",
        
            code: device.deviceId,
        
            name: device.name,
        
            note: "Thêm mới thiết bị"
        
        });

        res.json(device);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};

// =====================================================
// UPDATE DEVICE
// =====================================================
function normalizeCompare(value) {

    if (value === null || value === undefined)

        return "";

    return String(value);

}

exports.updateDevice = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const d = req.body;

        const categoryInfo = detectCategory({

            name: d.name,

            code: d.code,

            model: d.model,

        });

        const oldDevice = await prisma.device.findUnique({

            where: {
        
                id
        
            }
        
        });

        const data = {

             ...d,
         
             category: categoryInfo.category,
         
             installDate: parseDate(d.installDate),
         
             lastMaintenance: parseDate(d.lastMaintenance),
         
             replacementDate: parseDate(d.replacementDate),
         
             expiryDate: parseDate(d.expiryDate)
         
        };

        if (

             d.replacementDate &&
         
             (!oldDevice.replacementDate ||
         
              String(oldDevice.replacementDate).slice(0,10)
         
              !==
         
              String(d.replacementDate).slice(0,10))
         
         ) {
         
             data.installDate = parseDate(
         
                 d.replacementDate
         
             );
         
         }

        const updated = await prisma.device.update({

             where: {
         
                 id
         
             },
         
             data
         
        });

        const changes = {};

        Object.keys(d).forEach(key => {
        
            if (
        
                normalizeCompare(oldDevice[key]) !==

                normalizeCompare(updated[key])
        
            ) {
        
                changes[key] = {
        
                    old: oldDevice[key],
        
                    new: updated[key]
        
                };
        
            }
        
        });

        await writeHistory({

            deviceId: updated.id,
        
            action: "UPDATE",
        
            user: req.user?.username || "System",
        
            code: updated.deviceId,
        
            name: updated.name,
        
            note: "Cập nhật thiết bị",
        
            changes
        
        });

        res.json(updated);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};

// =====================================================
// DELETE DEVICE
// =====================================================

exports.deleteDevice = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const device = await prisma.device.findUnique({

            where: {

                id

            }

        });

       if (!device) {

             return res.status(404).json({
         
                 message: "Không tìm thấy thiết bị."
         
             });
         
         }

       await prisma.device.delete({

          where: {
      
              id
      
          }
      
      });

        await writeHistory({

            action: "DELETE",
        
            user: req.user?.username || "System",
        
            code: device.deviceId,
        
            name: device.name,
        
            note: "Xóa thiết bị"
        
        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};

// =====================================================
// PREVIEW IMPORT
// =====================================================

exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Chưa chọn file Excel."

            });

        }

        const workbook = XLSX.read(

            req.file.buffer,

            {

                type: "buffer"

            }

        );

        const sheet =

            workbook.Sheets[

                workbook.SheetNames[0]

            ];

        const excelRows =

            XLSX.utils.sheet_to_json(

                sheet,

                {

                    raw: true,

                    defval: ""

                }

            );

        console.log("========== FIRST ROW ==========");
        console.dir(excelRows[0], { depth: null });
         
        console.log("Ngày lắp đặt:", excelRows[0]["Ngày lắp đặt"]);
        console.log("Ngày lắp:", excelRows[0]["Ngày lắp"]);
        console.log("Ngày lắp lần đầu:", excelRows[0]["Ngày lắp lần đầu"]);
        const result = await compareRows(

            prisma,

            excelRows

        );

        const sessionId = createImportSession(

            result.rows,

            result.summary

        );

        res.json({

            success: true,

            sessionId,

            summary: result.summary,

            rows: result.rows

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================================
// CONFIRM IMPORT
// =====================================================

exports.confirmImport = async (req, res) => {

    try {

        const { sessionId } = req.body;

        if (!sessionId) {

            return res.status(400).json({

                success: false,

                message: "Thiếu sessionId."

            });

        }

        const session =

            getImportSession(sessionId);

        if (!session) {

            return res.status(404).json({

                success: false,

                message: "Phiên import đã hết hạn hoặc không tồn tại."

            });

        }

        console.dir(session.data.rows[0], { depth: null });
         
        const result = await importRows(
         
             prisma,
         
             session.rows
         
        );

        deleteImportSession(sessionId);

        res.json({

            success: true,

            inserted: result.inserted,

            updated: result.updated,

            skipped: result.skipped,

            errors: result.errors || [],

            total: result.total

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================================
// EXPORT DEVICES
// =====================================================

exports.exportDevices = async (req, res) => {

    try {

        const devices = await prisma.device.findMany({

            orderBy: {

                id: "asc"

            }

        });

        const rows = devices.map(device => {

            const categoryInfo = detectCategory({

                name: device.name,

                code: device.code,

                model: device.model,

            });

            return {

                "Tên thiết bị": device.name,

                "Phân loại":

                    device.category || "",

                "Hãng":

                    device.brand || "",

                "Model":

                    device.model || "",

                "Tuyến":

                    device.line || "",

                "Nhà ga":

                    device.station || "",

                "Khu vực":

                    device.area || "",

                "Mã ID":

                    device.deviceId || "",

                "Ký hiệu":

                    device.code || "",

                "Trạng thái":

                    calcMaintenance(device),

                "Ngày lắp":

                    formatDate(device.installDate),

                "Bảo dưỡng gần nhất":

                    formatDate(device.lastMaintenance),

                "Tuổi thọ":

                    device.lifespan || "",

                "Ngày hết hạn":

                    formatDate(device.expiryDate),

                "Ghi chú":

                    device.note || ""

            };

        });

        const workbook = XLSX.utils.book_new();

        const worksheet = XLSX.utils.json_to_sheet(rows);

        XLSX.utils.book_append_sheet(

            workbook,

            worksheet,

            "Devices"

        );

        const buffer = XLSX.write(

            workbook,

            {

                type: "buffer",

                bookType: "xlsx"

            }

        );

        res.setHeader(

            "Content-Type",

            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

        );

        res.setHeader(

            "Content-Disposition",

            "attachment; filename=devices.xlsx"

        );

        res.send(buffer);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};

// =====================================================
// GET DEVICE CATEGORIES
// =====================================================

exports.getCategories = async (req, res) => {

    try {

        const devices = await prisma.device.findMany({

            select: {

                category: true

            }

        });

        const counter = {};

        for (const device of devices) {

            const category =

                device.category?.trim()

                || "Chưa phân loại";

            counter[category] =

                (counter[category] || 0) + 1;

        }

        const result = Object.keys(counter)

            .sort()

            .map(name => ({

                id: name,

                name,

                count: counter[name]

            }));

        res.json(result);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};

// =====================================================
// UPDATE ALL DEVICE CATEGORIES
// =====================================================

exports.updateCategories = async (req, res) => {

    try {

        const devices = await prisma.device.findMany({

            orderBy: {

                id: "asc"

            }

        });

        let updated = 0;

        for (const device of devices) {

            const result = detectCategory({

                name: device.name,

                code: device.code,

                model: device.model,

                brand: device.brand

            });

            console.log(

                `[${device.id}]`,

                device.name,

                "=>",

                result.category,

                `(${result.score} điểm)`,

                result.brand

            );

            await prisma.device.update({

                where: {

                    id: device.id

                },

                data: {

                    category: result.category,

                    brand: result.brand

                }

            });

            updated++;

        }

        res.json({

            success: true,

            updated,

            total: devices.length

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================================
// GET DEVICES BY CATEGORY
// =====================================================

exports.getByCategory = async (req, res) => {

    try {

        const category = decodeURIComponent(

            req.params.name

        );

        let where = {};

        if (

            category === "Chưa phân loại"

        ) {

            where = {

                OR: [

                    {

                        category: null

                    },

                    {

                        category: ""

                    }

                ]

            };

        }

        else {

            where = {

                category

            };

        }

        const devices = await prisma.device.findMany({

            where,

            orderBy: [

                {

                    line: "asc"

                },

                {

                    station: "asc"

                },

                {

                    name: "asc"

                }

            ]

        });

        const result = devices.map(device => ({

            ...device,

            status: calcMaintenance(device)

        }));

        res.json(result);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

};
