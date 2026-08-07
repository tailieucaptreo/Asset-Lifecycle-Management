const ExcelJS = require("exceljs");

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
// Add Sheet
// rows = Array<Object>
// =======================================

function addSheet(workbook, sheetName, rows = []) {

    const sheet = workbook.addWorksheet(sheetName);

    // Không có dữ liệu
    if (!rows || rows.length === 0) {

        sheet.addRow(["Không có dữ liệu"]);

        return sheet;

    }

    //------------------------------------
    // Header
    //------------------------------------

    const headers = Object.keys(rows[0] || {});

    if (!headers.length) {
    
        sheet.addRow(["Không có dữ liệu"]);
    
        return sheet;
    
    }

    sheet.columns = headers.map(key => ({

        header: key,
        key,
        width: 20

    }));

    //------------------------------------
    // Data
    //------------------------------------

    rows.forEach(row => {

        const data = {};
    
        headers.forEach(key => {
    
            const value = row[key];
    
            if (value instanceof Date) {
    
                data[key] = value.toLocaleString("vi-VN");
    
            }
    
            else if (
    
                value === null ||
    
                value === undefined
    
            ) {
    
                data[key] = "";
    
            }
    
            else if (
    
                typeof value === "object"
    
            ) {
    
                data[key] = JSON.stringify(value);
    
            }
    
            else {
    
                data[key] = value;
    
            }
    
        });
    
        sheet.addRow(data);
    
    });

    //------------------------------------
    // Header Style
    //------------------------------------

    const header = sheet.getRow(1);

    header.font = {

        bold: true,
        color: { argb: "FFFFFFFF" }

    };

    header.fill = {

        type: "pattern",

        pattern: "solid",

        fgColor: { argb: "4472C4" }

    };

    header.alignment = {

        vertical: "middle",

        horizontal: "center"

    };

    //------------------------------------
    // Border
    //------------------------------------

    sheet.eachRow(row => {

        row.eachCell(cell => {

            cell.border = {

                top: { style: "thin" },

                left: { style: "thin" },

                bottom: { style: "thin" },

                right: { style: "thin" }

            };

        });

    });

    //------------------------------------
    // Auto Filter
    //------------------------------------

    const headerRow = sheet.getRow(1);

    if (headerRow.cellCount > 0) {
    
        sheet.autoFilter = {
    
            from: {
                row: 1,
                column: 1
            },
    
            to: {
                row: 1,
                column: headerRow.cellCount
            }
    
        };
    
    }

    //------------------------------------
    // Freeze Header
    //------------------------------------

    sheet.views = [

        {

            state: "frozen",

            ySplit: 1

        }

    ];

    //------------------------------------
    // Auto Width
    //------------------------------------

    autoWidth(sheet);

    return sheet;

}

// =======================================
// Auto Width
// =======================================

function autoWidth(sheet) {

    sheet.columns.forEach(column => {

        let maxLength = 15;

        column.eachCell({ includeEmpty: true }, cell => {

            const value = cell.value
                ? cell.value.toString()
                : "";

            maxLength = Math.max(

                maxLength,

                value.length + 2

            );

        });

        column.width = Math.min(maxLength, 50);

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

module.exports = {

    createWorkbook,

    addSheet,

    autoWidth,

    downloadWorkbook

};
