const ExcelJS = require("exceljs");
const HEADERS = require("../data/excel.headers");

// =======================================
// Create Workbook
// =======================================

function createWorkbook() {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Asset Lifecycle Management";
    workbook.company = "Sun World";
    workbook.created = new Date();
    workbook.modified = new Date();

    return workbook;

}

// =======================================
// Format Value
// =======================================

// =======================================
// Format Value
// =======================================

function formatValue(value) {

    if (value === null || value === undefined) {

        return "";

    }

    // ===================================
    // Date
    // ===================================

    if (value instanceof Date && !isNaN(value)) {

        return value.toLocaleDateString("vi-VN");

    }

    // ===================================
    // Boolean
    // ===================================

    if (typeof value === "boolean") {

        return value ? "Có" : "Không";

    }

    // ===================================
    // Chuẩn hóa trạng thái
    // ===================================

    const STATUS = {

        Running: "Đang hoạt động",

        Maintenance: "Bảo trì",

        Fault: "Đang lỗi",

        Offline: "Dự phòng",

        Expired: "Quá tuổi thọ",

        Original: "Chưa thay",

        Replaced: "Đã thay thế",

        Active: "Hoạt động",

        Inactive: "Không hoạt động",

        Installed: "Đã lắp đặt",

        Removed: "Đã tháo",

        Resolved: "Đã xử lý",

        Pending: "Chờ xử lý",

        Open: "Đang xử lý",

        Closed: "Đã đóng",

        New: "Mới",

        Used: "Đã sử dụng",

        Broken: "Hỏng",

        Repair: "Đang sửa chữa",

        Available: "Sẵn sàng",

        Unavailable: "Không sẵn sàng"

    };

    // ===================================
    // String
    // ===================================

    if (typeof value === "string") {

        return STATUS[value] || value;

    }

    // ===================================
    // Array
    // ===================================

    if (Array.isArray(value)) {

        return value
            .map(item => formatValue(item))
            .join(", ");

    }

    // ===================================
    // Object / JSON
    // ===================================

    if (typeof value === "object") {

        try {

            const formatted = {};

            for (const [key, item] of Object.entries(value)) {

                formatted[key] = formatValue(item);

            }

            return JSON.stringify(formatted);

        }

        catch {

            return String(value);

        }

    }

    return value;

}

// =======================================
// Add Sheet
//
// rows      = dữ liệu database
// headerMap = mapping tên cột tiếng Việt
// =======================================

function addSheet(

    workbook,
    sheetName,
    rows = [],
    headerMap = null

) {

    const sheet =
        workbook.addWorksheet(sheetName);

    // ===================================
    // Không có dữ liệu
    // ===================================

    if (
        !rows ||
        rows.length === 0
    ) {

        sheet.addRow([
            "Không có dữ liệu"
        ]);

        return sheet;

    }

    // ===================================
    // Header
    // ===================================

    const headers =
        Object.keys(rows[0] || {});

    if (!headers.length) {

        sheet.addRow([
            "Không có dữ liệu"
        ]);

        return sheet;

    }

    // ===================================
    // Tạo Columns
    // ===================================

    sheet.columns = headers.map(key => ({

        header:
            headerMap?.[key] || key,

        key,

        width: 20

    }));

    // ===================================
    // Chuẩn hóa dữ liệu
    // ===================================

    const dataRows = rows.map(row => {

        return headers.map(key => {

            return formatValue(
                row[key]
            );

        });

    });

    // ===================================
    // Add toàn bộ rows một lần
    // Nhanh hơn addRow từng dòng
    // ===================================

    sheet.addRows(dataRows);

    // ===================================
    // Header Style
    // ===================================

    const headerRow =
        sheet.getRow(1);

    headerRow.font = {

        bold: true,

        color: {
            argb: "FFFFFFFF"
        }

    };

    headerRow.fill = {

        type: "pattern",

        pattern: "solid",

        fgColor: {
            argb: "4472C4"
        }

    };

    headerRow.alignment = {

        vertical: "middle",

        horizontal: "center",

        wrapText: true

    };

    // ===================================
    // Header Border
    // Chỉ border header
    // ===================================

    headerRow.eachCell(cell => {

        cell.border = {

            top: {
                style: "thin"
            },

            left: {
                style: "thin"
            },

            bottom: {
                style: "thin"
            },

            right: {
                style: "thin"
            }

        };

    });

    // ===================================
    // Auto Filter
    // ===================================

    sheet.autoFilter = {

        from: {
            row: 1,
            column: 1
        },

        to: {
            row: 1,
            column: headers.length
        }

    };

    // ===================================
    // Freeze Header
    // ===================================

    sheet.views = [

        {

            state: "frozen",

            ySplit: 1

        }

    ];

    // ===================================
    // Auto Width
    // ===================================

    autoWidth(sheet);

    return sheet;

}

// =======================================
// Auto Width
// =======================================

function autoWidth(sheet) {

    sheet.columns.forEach(column => {

        let maxLength = 12;

        column.eachCell(
            { includeEmpty: false },
            cell => {

                let value = cell.value;

                if (
                    value === null ||
                    value === undefined
                ) {

                    return;

                }

                value =
                    String(value);

                maxLength = Math.max(

                    maxLength,

                    value.length + 2

                );

            }
        );

        column.width =
            Math.min(
                Math.max(maxLength, 12),
                40
            );

    });

}

// =======================================
// Export Workbook
// =======================================

async function downloadWorkbook(

    workbook,
    res,
    fileName

) {

    res.setHeader(

        "Content-Type",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

    );

    res.setHeader(

        "Content-Disposition",

        `attachment; filename="${fileName}"`

    );

    await workbook.xlsx.write(res);

    res.end();

}

// =======================================
// Export
// =======================================

module.exports = {

    createWorkbook,

    addSheet,

    autoWidth,

    downloadWorkbook,

    formatValue

};