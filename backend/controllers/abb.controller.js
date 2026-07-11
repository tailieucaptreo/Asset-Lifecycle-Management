const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");

const prisma = new PrismaClient();

function parseNumber(value) {

    if (value === "" || value === null || value === undefined) {

        return null;

    }

    const n = Number(String(value).replace(",", "."));

    return isNaN(n) ? null : n;

}

function parseDate(value) {

    if (!value) return null;

    if (value instanceof Date) return value;

    // Excel Serial Date
    if (typeof value === "number") {

        const utcDays = Math.floor(value - 25569);

        const utcValue = utcDays * 86400;

        return new Date(utcValue * 1000);

    }

    const text = String(value).trim();

    if (text.includes("/")) {

        const arr = text.split("/");

        if (arr.length === 3) {

            let d, m, y;

            if (Number(arr[0]) > 12) {

                d = Number(arr[0]);

                m = Number(arr[1]);

                y = Number(arr[2]);

            }

            else {

                m = Number(arr[0]);

                d = Number(arr[1]);

                y = Number(arr[2]);

            }

            return new Date(y, m - 1, d);

        }

    }

    const date = new Date(text);

    return isNaN(date.getTime())

        ? null

        : date;

}

// ======================================================
// GET ALL
// ======================================================

exports.getAll = async (req, res) => {

    try {

        const data = await prisma.abbFaultRecord.findMany({

            orderBy: {

                createdAt: "desc"

            }

        });

        res.json(data);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy lịch sử lỗi ABB"

        });

    }

};


// ======================================================
// GET ONE
// ======================================================

exports.getOne = async (req, res) => {

    try {

        const item = await prisma.abbFaultRecord.findUnique({

            where: {

                id: Number(req.params.id)

            }

        });

        if (!item) {

            return res.status(404).json({

                message: "Không tìm thấy dữ liệu"

            });

        }

        res.json(item);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy dữ liệu"

        });

    }

};


// ======================================================
// CREATE
// ======================================================

exports.create = async (req, res) => {

    try {

        const item = await prisma.abbFaultRecord.create({

            data: req.body

        });

        res.json(item);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Không thể thêm dữ liệu"

        });

    }

};


// ======================================================
// UPDATE
// ======================================================

exports.update = async (req, res) => {

    try {

        const item = await prisma.abbFaultRecord.update({

            where: {

                id: Number(req.params.id)

            },

            data: req.body

        });

        res.json(item);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Không thể cập nhật"

        });

    }

};


// ======================================================
// DELETE
// ======================================================

exports.remove = async (req, res) => {

    try {

        await prisma.abbFaultRecord.delete({

            where: {

                id: Number(req.params.id)

            }

        });

        res.json({

            success: true

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Không thể xóa"

        });

    }

};


// ======================================================
// PREVIEW IMPORT
// ======================================================

exports.previewImport = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                message: "Chưa chọn file"

            });

        }

        const workbook = XLSX.read(

            req.file.buffer,

            {

                type: "buffer"

            }

        );

        const sheet = workbook.Sheets[

            workbook.SheetNames[0]

        ];

        const rows = XLSX.utils.sheet_to_json(

            sheet,

            {

                defval: ""

            }

        );

        const preview = rows.map(row => ({

            typeCode:

                row["Type code"]

                    ? String(row["Type code"]).trim()

                    : "",

            serialNumber:

                row["Serial number"]

                    ? String(row["Serial number"]).trim()

                    : "",

            line:

                row["Tuyến cáp"]

                    ? String(row["Tuyến cáp"]).trim()

                    : "",

            station:

                row["Đặt tại Ga"]

                    ? String(row["Đặt tại Ga"]).trim()

                    : "",

            application:

                row["Ký hiệu / Ứng dụng"]

                    ? String(row["Ký hiệu / Ứng dụng"]).trim()

                    : "",

            firmware:

                row["Firmware"]

                    ? String(row["Firmware"]).trim()

                    : "",

            currentStatus:

                row["Tình trạng hiện tại"]

                    ? String(row["Tình trạng hiện tại"]).trim()

                    : "",

            replaceReason:

                row["Lý do thay thế"]

                    ? String(row["Lý do thay thế"]).trim()

                    : "",

            operationHours:

                parseNumber(

                    row["Giờ hoạt động của tuyến cáp"]

                ),

            lastReplaceDate:

                parseDate(

                    row["Ngày thay thế gần nhất (mm/dd/yyyy)"]

                ),

            onTimeDay:

                parseNumber(

                    row["On-time (Thời gian biến tần được cấp điện) (day)"]

                ),

            runningDay:

                parseNumber(

                    row["Thời gian hoạt động của biến tần (day)"]

                ),

            lastMaintenance:

                parseDate(

                    row["Ngày bảo dưỡng gần nhất (mm/dd/yyyy)"]

                ),

            maintenanceWork:

                row["Nội dung công việc bảo dưỡng"]

                    ? String(row["Nội dung công việc bảo dưỡng"])

                    : "",

            note:

                row["Ghi chú"]

                    ? String(row["Ghi chú"])

                    : ""

        }));

        res.json({

            rows: preview

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ======================================================
// CONFIRM IMPORT
// ======================================================

exports.confirmImport = async (req, res) => {

    try {

        const rows = req.body.rows || [];

        const data = rows.map(r => ({

            typeCode:

                r.typeCode || null,

            serialNumber:

                r.serialNumber || null,

            line:

                r.line || null,

            station:

                r.station || null,

            application:

                r.application || null,

            firmware:

                r.firmware || null,

            currentStatus:

                r.currentStatus || null,

            replaceReason:

                r.replaceReason || null,

            operationHours:

                parseNumber(

                    r.operationHours

                ),

            lastReplaceDate:

                parseDate(

                    r.lastReplaceDate

                ),

            onTimeDay:

                parseNumber(

                    r.onTimeDay

                ),

            runningDay:

                parseNumber(

                    r.runningDay

                ),

            lastMaintenance:

                parseDate(

                    r.lastMaintenance

                ),

            maintenanceWork:

                r.maintenanceWork || null,

            note:

                r.note || null

        }));

        await prisma.abbFaultRecord.createMany({

            data,

            skipDuplicates: true

        });

        res.json({

            success: true,

            count: data.length

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: err.message

        });

    }

};

// ======================================================
// EXPORT EXCEL
// ======================================================

exports.exportExcel = async (req, res) => {

    const records = await prisma.abbFaultRecord.findMany({

        orderBy: {

            id: "asc"

        }

    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("ABB");

    sheet.columns = [

        { header:"Type Code", key:"typeCode", width:25 },

        { header:"Serial Number", key:"serialNumber", width:22 },

        { header:"Tuyến", key:"line", width:15 },

        { header:"Nhà ga", key:"station", width:15 },

        { header:"Ứng dụng", key:"application", width:25 },

        { header:"Firmware", key:"firmware", width:18 },

        { header:"Tình trạng", key:"currentStatus", width:20 },

        { header:"Lý do thay", key:"replaceReason", width:25 },

        { header:"Giờ hoạt động", key:"operationHours", width:20 },

        { header:"Ngày thay", key:"lastReplaceDate", width:18 },

        { header:"On-time", key:"onTimeDay", width:15 },

        { header:"Running Day", key:"runningDay", width:15 },

        { header:"Ngày bảo dưỡng", key:"lastMaintenance", width:18 },

        { header:"Công việc bảo dưỡng", key:"maintenanceWork", width:40 },

        { header:"Ghi chú", key:"note", width:30 }

    ];

    records.forEach(r => {

        sheet.addRow({
    
            ...r,
    
            lastReplaceDate:
    
                r.lastReplaceDate
    
                    ? new Date(r.lastReplaceDate).toLocaleDateString("vi-VN")
    
                    : "",
    
            lastMaintenance:
    
                r.lastMaintenance
    
                    ? new Date(r.lastMaintenance).toLocaleDateString("vi-VN")
    
                    : ""
    
        });
    
    });

    sheet.getRow(1).font={

        bold:true

    };

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        'attachment; filename="ABB_Fault.xlsx"'

    );

    await workbook.xlsx.write(res);

    res.end();

};
