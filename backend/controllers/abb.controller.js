const { PrismaClient } = require("@prisma/client");
const ExcelJS = require("exceljs");
const XLSX = require("xlsx");

const prisma = new PrismaClient();


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

        const workbook = XLSX.readFile(req.file.path);

        const sheet = workbook.Sheets[
            workbook.SheetNames[0]
        ];

        const rows = XLSX.utils.sheet_to_json(sheet, {

            defval: ""

        });

        const preview = rows.map(r => ({

            typeCode:
                r["Type code"],

            serialNumber:
                r["Serial number"],

            line:
                r["Tuyến cáp"],

            station:
                r["Đặt tại Ga"],

            application:
                r["Ký hiệu / Ứng dụng"],

            firmware:
                r["Firmware"],

            currentStatus:
                r["Tình trạng hiện tại"],

            replaceReason:
                r["Lý do thay thế"],

            operationHours:
                r["Giờ hoạt động của tuyến cáp"],

            lastReplaceDate:
                r["Ngày thay thế gần nhất (mm/dd/yyyy)"],

            onTimeDay:
                r["On-time (Thời gian biến tần được cấp điện) (day)"],

            runningDay:
                r["Thời gian hoạt động của biến tần (day)"],

            lastMaintenance:
                r["Ngày bảo dưỡng gần nhất (mm/dd/yyyy)"],

            maintenanceWork:
                r["Nội dung công việc bảo dưỡng"],

            note:
                r["Ghi chú"]

        }));

        res.json({

            rows: preview

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Đọc Excel thất bại"

        });

    }

};

// ======================================================
// CONFIRM IMPORT
// ======================================================

exports.confirmImport = async (req, res) => {

    try {

        const rows = req.body.rows;

        await prisma.abbFaultRecord.createMany({

            data: rows,

            skipDuplicates: true

        });

        res.json({

            success: true

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Import thất bại"

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

    records.forEach(r=>{

        sheet.addRow(r);

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
