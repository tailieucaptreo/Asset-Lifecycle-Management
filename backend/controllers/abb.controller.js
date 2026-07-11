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

                recordDate: "desc"

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

                message: "Không có file"

            });

        }

        const workbook = XLSX.read(

            req.file.buffer,

            {

                type: "buffer"

            }

        );

        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const rows = XLSX.utils.sheet_to_json(sheet);

        res.json({

            rows

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

        const rows = req.body.rows || [];

        for (const row of rows) {

            await prisma.abbFaultRecord.create({

                data: row

            });

        }

        res.json({

            success: true,

            total: rows.length

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

    const data = await prisma.abbFaultRecord.findMany({

        orderBy: {

            recordDate: "desc"

        }

    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("ABB Fault");

    sheet.columns = [

        { header: "Ngày", key: "recordDate", width: 18 },

        { header: "Tuyến", key: "line", width: 15 },

        { header: "Nhà ga", key: "station", width: 18 },

        { header: "Thiết bị", key: "deviceName", width: 30 },

        { header: "Serial", key: "serialNumber", width: 25 },

        { header: "Model", key: "model", width: 20 },

        { header: "Fault Code", key: "faultCode", width: 18 },

        { header: "Fault Name", key: "faultName", width: 30 },

        { header: "Description", key: "description", width: 45 },

        { header: "Cause", key: "cause", width: 45 },

        { header: "Solution", key: "solution", width: 45 },

        { header: "Repair By", key: "repairedBy", width: 20 },

        { header: "Note", key: "note", width: 30 }

    ];

    data.forEach(item => {

        sheet.addRow({

            ...item,

            recordDate: item.recordDate

                ? new Date(item.recordDate).toLocaleDateString("vi-VN")

                : ""

        });

    });

    sheet.getRow(1).font = {

        bold: true

    };

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        'attachment; filename="ABB_Fault_History.xlsx"'

    );

    await workbook.xlsx.write(res);

    res.end();

};
