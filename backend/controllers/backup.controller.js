const {
    createBackupWorkbook
} = require("../services/backup.service");

const {
    downloadWorkbook
} = require("../utils/excel.helper");

// =======================================
// Backup toàn bộ hệ thống
// =======================================

async function backupSystem(req, res) {

    try {

        const workbook = await createBackupWorkbook();

        const today = new Date()
            .toISOString()
            .slice(0, 10);

        const fileName =
            `AssetLifecycleBackup_${today}.xlsx`;

        await downloadWorkbook(

            workbook,

            res,

            fileName

        );

    }

    catch (error) {

        console.error("Backup Error:", error);

        res.status(500).json({

            success: false,

            message: "Không thể tạo file backup.",

            error: process.env.NODE_ENV === "development"
                ? error.message
                : undefined

        });

    }

}

module.exports = {

    backupSystem

};
