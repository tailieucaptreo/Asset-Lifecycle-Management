const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const HEADERS = require("../data/excel.headers");

const {
    createWorkbook,
    addSheet
} = require("../utils/excel.helper");

// =======================================
// Danh sách Sheet Backup
// =======================================

const SHEETS = [

    {
        title: "01_Thiết bị",
        model: prisma.device
    },

    {
        title: "02_Động cơ",
        model: prisma.motor
    },

    {
        title: "03_Biến tần",
        model: prisma.drive
    },

    {
        title: "04_Thiết bị dự phòng",
        model: prisma.spareDevice
    },

    {
        title: "05_Lỗi Biến tần",
        model: prisma.driveFault
    },

    {
        title: "06_Lỗi Động cơ",
        model: prisma.motorFault
    },

    {
        title: "07_Lỗi ABB",
        model: prisma.abbFaultRecord
    },

    {
        title: "08_Lịch sử Thiết bị",
        model: prisma.deviceHistory
    },

    {
        title: "09_Lịch sử Động cơ",
        model: prisma.motorHistory
    },

    {
        title: "10_Bảo trì Động cơ",
        model: prisma.motorMaintenance
    },

    {
        title: "11_Lịch sử Kho",
        model: prisma.spareHistory
    },

    {
        title: "12_VACON History",
        model: prisma.vaconHistory
    }

];

// =======================================
// Build Backup Workbook
// =======================================
// =======================================
// Build Backup Workbook
// =======================================

async function createBackupWorkbook() {

    const workbook = createWorkbook();

    // ===================================
    // Lấy dữ liệu tất cả bảng song song
    // ===================================

    const results = await Promise.all(

        SHEETS.map(async (sheet) => {

            try {

                const rows =
                    await sheet.model.findMany({

                        orderBy: {
                            id: "asc"
                        }

                    });

                return {

                    title: sheet.title,

                    rows

                };

            }

            catch (err) {

                console.error(

                    `Backup Sheet "${sheet.title}" Error:`,

                    err.message

                );

                return {

                    title: sheet.title,

                    rows: []

                };

            }

        })

    );

    // ===================================
    // Tạo các Sheet Excel
    // ===================================

    for (const result of results) {

        const key = {

            "01_Thiết bị": "Device",

            "02_Động cơ": "Motor",

            "03_Biến tần": "Drive",

            "04_Thiết bị dự phòng": "SpareDevice"

        }[result.title];

        addSheet(

            workbook,

            result.title,

            result.rows,

            HEADERS[key]

        );

    }

    return workbook;

}

module.exports = {

    createBackupWorkbook

};
