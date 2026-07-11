const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ExcelJS = require("exceljs");

const XLSX = require("xlsx");

// ======================================================
// GET ALL
// ======================================================

exports.getAll = async (req, res) => {

    try {

        const drives = await prisma.drive.findMany({

            orderBy: {

                id: "desc"

            }

        });

        res.json(drives);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy danh sách biến tần"

        });

    }

};

// ======================================================
// GET ONE
// ======================================================

exports.getOne = async (req, res) => {

    try {

        const drive = await prisma.drive.findUnique({

            where: {

                id: Number(req.params.id)

            }

        });

        if (!drive) {

            return res.status(404).json({

                message: "Không tìm thấy biến tần"

            });

        }

        res.json(drive);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy thông tin biến tần"

        });

    }

};

// ======================================================
// CREATE
// ======================================================

exports.create = async (req, res) => {

    try {

        const drive = await prisma.drive.create({

            data: {

                name: req.body.name,

                brand: req.body.brand,

                model: req.body.model,

                serialnumber: req.body.serial,

                ipAddress:req.body.ipAddress,

                firmware: req.body.firmware,

                power: req.body.power,

                voltage: req.body.voltage,

                current: req.body.current,

                line: req.body.line,

                station: req.body.station,

                location: req.body.location,

                status: req.body.status || "Running",

                installDate: req.body.installDate

                    ? new Date(req.body.installDate)

                    : null,

                image: req.body.image,

                note: req.body.note

            }

        });

        res.json(drive);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Thêm biến tần thất bại"

        });

    }

};

// ======================================================
// UPDATE
// ======================================================

exports.update = async (req, res) => {

    try {

        const drive = await prisma.drive.update({

            where: {

                id: Number(req.params.id)

            },

            data: {

                name: req.body.name,

                brand: req.body.brand,

                model: req.body.model,

                serial: req.body.serial,

                firmware: req.body.firmware,

                power: req.body.power,

                voltage: req.body.voltage,

                current: req.body.current,

                line: req.body.line,

                station: req.body.station,

                location: req.body.location,

                status: req.body.status,

                installDate: req.body.installDate

                    ? new Date(req.body.installDate)

                    : null,

                image: req.body.image,

                note: req.body.note

            }

        });

        res.json(drive);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Cập nhật biến tần thất bại"

        });

    }

};

// ======================================================
// DELETE
// ======================================================

exports.remove = async (req, res) => {

    try {

        await prisma.drive.delete({

            where: {

                id: Number(req.params.id)

            }

        });

        res.json({

            success: true,

            message: "Đã xóa biến tần"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Xóa biến tần thất bại"

        });

    }

};

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

exports.getStatistics = async (req, res) => {

    try {

        const drives = await prisma.drive.findMany();

        const statistics = {

            total: drives.length,

            abb: drives.filter(d => d.brand === "ABB").length,

            vacon: drives.filter(d => d.brand === "VACON").length,

            running: drives.filter(d => d.status === "Running").length,

            fault: drives.filter(d => d.status === "Fault").length,

            maintenance: drives.filter(d => d.status === "Maintenance").length

        };

        res.json(statistics);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi thống kê"

        });

    }

};

// ================= IMAGE =================

exports.uploadImage = async (req, res) => {

    res.json({
        message: "Chưa triển khai upload ảnh"
    });

};

// ================= IMPORT =================

const XLSX = require("xlsx");

exports.previewImport = async (req,res)=>{

    try{

        if(!req.file){

            return res.status(400).json({
                error:"Không có file"
            });

        }

        const workbook = XLSX.read(
            req.file.buffer,
            { type:"buffer" }
        );

        const sheet =
            workbook.Sheets[
                workbook.SheetNames[0]
            ];

        const raw =
            XLSX.utils.sheet_to_json(sheet);

        const rows = raw.map(r=>({

            name:
                r["Thiết bị"] || "",

            deviceId:
                String(r["Mã TB"] || ""),

            brand:
                r["Hãng"] || "",

            model:
                r["Model"] || "",

            power:
                r["Công suất"] || "",

            line:
                r["Tuyến"] || "",

            station:
                r["Nhà ga"] || "",

            ipAddress:
                r["IP"] || "",

            status:
                r["Trạng thái"] || "Running"

        }));

        res.json({

            ok:true,

            rows

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            error:err.message

        });

    }

};

exports.confirmImport = async (req,res)=>{

    try{

        const rows =
            req.body.rows || [];

        for(const row of rows){

            await prisma.drive.create({

                data:{

                    name: row.name,

                    deviceId: row.deviceId,

                    brand: row.brand,

                    model: row.model,

                    power: row.power,

                    line: row.line,

                    station: row.station,

                    ipAddress: row.ipAddress,

                    status: row.status

                }

            });

        }

        res.json({

            ok:true,

            total:rows.length

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            error:err.message

        });

    }

};

// ================= EXPORT =================

exports.exportExcel = async (req, res) => {

    const drives = await prisma.drive.findMany({

        orderBy: {

            name: "asc"

        }

    });

    const workbook = new ExcelJS.Workbook();

    const sheet = workbook.addWorksheet("Drives");

    sheet.columns = [

        { header: "Tên biến tần", key: "name", width: 30 },

        { header: "Mã thiết bị", key: "deviceId", width: 20 },

        { header: "Serial Number", key: "serialNumber", width: 25 },

        { header: "Hãng", key: "brand", width: 15 },

        { header: "Model", key: "model", width: 20 },

        { header: "Tuyến", key: "line", width: 15 },

        { header: "Nhà ga", key: "station", width: 20 },

        { header: "Vị trí", key: "location", width: 20 },

        { header: "IP Address", key: "ipAddress", width: 18 },

        { header: "Firmware", key: "firmware", width: 18 },

        { header: "Công suất", key: "power", width: 15 },

        { header: "Điện áp", key: "voltage", width: 15 },

        { header: "Trạng thái", key: "status", width: 15 },

        { header: "Ngày lắp đặt", key: "installDate", width: 18 },

        { header: "Ghi chú", key: "note", width: 40 }

    ];

    drives.forEach(drive => {

        sheet.addRow({

            ...drive,

            installDate: drive.installDate
                ? new Date(drive.installDate).toLocaleDateString("vi-VN")
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

        'attachment; filename="Drive.xlsx"'

    );

    await workbook.xlsx.write(res);

    res.end();

};

exports.getFilters = async (req, res) => {

    try {

        const drives = await prisma.drive.findMany();

        res.json({

            brands: [
                ...new Set(
                    drives
                        .map(d => d.brand)
                        .filter(Boolean)
                )
            ],

            models: [
                ...new Set(
                    drives
                        .map(d => d.model)
                        .filter(Boolean)
                )
            ],

            lines: [
                ...new Set(
                    drives
                        .map(d => d.line)
                        .filter(Boolean)
                )
            ],

            stations: [
                ...new Set(
                    drives
                        .map(d => d.station)
                        .filter(Boolean)
                )
            ]

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            message: "Lỗi lấy bộ lọc"

        });

    }

};

// ================= FAULT =================

exports.getFaults = async (req, res) => {

    res.json([]);

};

exports.addFault = async (req, res) => {

    res.json({
        message: "Chưa triển khai thêm lỗi"
    });

};

exports.updateFault = async (req, res) => {

    res.json({
        message: "Chưa triển khai cập nhật lỗi"
    });

};

exports.deleteFault = async (req, res) => {

    res.json({
        message: "Chưa triển khai xóa lỗi"
    });

};
