const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

                serial: req.body.serial,

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

exports.uploadImage = async (req, res) => {};

exports.previewImport = async (req, res) => {};

exports.confirmImport = async (req, res) => {};

exports.exportExcel = async (req, res) => {};

exports.getFaults = async (req, res) => {};

exports.addFault = async (req, res) => {};

exports.updateFault = async (req, res) => {};

exports.deleteFault = async (req, res) => {};
