const {
    parseDate,
    calculateExpiryDate
} = require("../utils/date");

const {
    detectCategory
} = require("./category.service");

async function importRows(prisma, rows) {

    let created = 0;
    let updated = 0;
    let skipped = 0;

    const failed = [];

    for (const item of rows) {

        if (item.action === "SKIP") {

            skipped++;
            continue;

        }

        const d = item.row;

        const installDate = parseDate(d.installDate);

        const categoryInfo = detectCategory({

            name: d.name,
        
            code: d.code,
        
            model: d.model
        
        });

        const data = {

            name: d.name,

            category:
                d.category ||
                categoryInfo.category,

            line: d.line,

            station: d.station,

            code: d.code,

            area: d.area,

            deviceId: d.deviceId,

            status: d.status || "Running",

            originalInstallDate: installDate,

            installDate: installDate,

            lastMaintenance:
                parseDate(d.lastMaintenance),

            lifespan:
                Number(d.lifespan || 0),

            expiryDate:

                parseDate(d.expiryDate) ||

                calculateExpiryDate(
                    installDate,

                    d.lifespan
                )

        };

        try {

            if (item.action === "NEW") {

                await prisma.device.create({

                    data

                });

                created++;

            }

            else if (item.action === "UPDATE") {

                await prisma.device.update({

                    where: {

                        line_code: {

                            line: d.line,

                            code: d.code

                        }

                    },

                    data

                });

                updated++;

            }

        }

        catch (err) {

            failed.push({

                deviceId: d.deviceId,

                name: d.name,

                message: err.message

            });

        }

    }

    return {

         inserted: created,

         updated,
    
         skipped,
    
         total: rows.length,
    
         errors: failed

    };

}

module.exports = {

    importRows

};
