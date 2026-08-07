const prisma = require("../config/prisma");

const {
    createWorkbook,
    addSheet
} = require("../utils/excel.helper");

// =======================================
// Backup System
// =======================================

async function createBackupWorkbook() {

    const workbook = createWorkbook();

    //--------------------------------------------------
    // Lấy dữ liệu song song
    //--------------------------------------------------

    const [

        devices,

        motors,

        drives,

        spares,

        faults

    ] = await Promise.all([

        prisma.device.findMany({

            orderBy: {

                id: "asc"

            }

        }),

        prisma.motor.findMany({

            orderBy: {

                id: "asc"

            }

        }),

        prisma.drive.findMany({

            orderBy: {

                id: "asc"

            }

        }),

        prisma.spareDevice.findMany({

            orderBy: {

                id: "asc"

            }

        }),

        prisma.driveFault.findMany({

            orderBy: {

                id: "asc"

            }

        })

    ]);

    //--------------------------------------------------
    // Sheet Thiết bị
    //--------------------------------------------------

    addSheet(

        workbook,

        "Thiết bị",

        devices

    );

    //--------------------------------------------------
    // Sheet Động cơ
    //--------------------------------------------------

    addSheet(

        workbook,

        "Động cơ",

        motors

    );

    //--------------------------------------------------
    // Sheet Biến tần
    //--------------------------------------------------

    addSheet(

        workbook,

        "Biến tần",

        drives

    );

    //--------------------------------------------------
    // Sheet Thiết bị dự phòng
    //--------------------------------------------------

    addSheet(

        workbook,

        "Thiết bị dự phòng",

        spares

    );

    //--------------------------------------------------
    // Sheet Lịch sử lỗi
    //--------------------------------------------------

    addSheet(

        workbook,

        "Lịch sử lỗi",

        faults

    );

    return workbook;

}

module.exports = {

    createBackupWorkbook

};
