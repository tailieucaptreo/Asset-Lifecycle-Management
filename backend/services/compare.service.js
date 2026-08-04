const { parseDate, sameDate } = require("../utils/date");
const { normalize, get } = require("../utils/normalize");

async function compareRows(prisma, rows) {

    const devices = await prisma.device.findMany({

        select: {

            id: true,
            deviceId: true,
            name: true,
            category: true,
            line: true,
            station: true,
            code: true,
            area: true,
            installDate: true,
            lifespan: true

        }

    });

    const deviceMap = new Map();

    devices.forEach(device => {

        if (device.line && device.code) {

            const key =
                `${normalize(device.line)}_${normalize(device.code)}`;

            deviceMap.set(key, device);

        }

    });

    let newCount = 0;
    let updateCount = 0;
    let skipCount = 0;

    const result = [];

    for (const row of rows) {

        const rawInstallDate = get(
            row,
            "Ngày lắp",
            "Ngày lắp đặt",
            "Install Date"
        );
        
        console.log("RAW INSTALL DATE =", rawInstallDate);
        console.log("PARSED =", parseDate(rawInstallDate));


        const data = {

            deviceId: normalize(
                get(
                    row,
                    "Mã ID",
                    "Device ID",
                    "deviceId",
                    "Mã thiết bị"
                )
            ),

            name: normalize(
                get(
                    row,
                    "Tên thiết bị",
                    "Tên",
                    "Name"
                )
            ),

            category: normalize(
                get(
                    row,
                    "Phân loại",
                    "Category"
                )
            ),

            line: normalize(
                get(
                    row,
                    "Tuyến",
                    "Line"
                )
            ),

            station: normalize(
                get(
                    row,
                    "Nhà ga",
                    "Station"
                )
            ),

            code: normalize(
                get(
                    row,
                    "Ký hiệu",
                    "Code"
                )
            ),

            area: normalize(
                get(
                    row,
                    "Khu vực",
                    "Area"
                )
            ),

            installDate: parseDate(
                get(
                    row,
                    "Ngày lắp",
                    "Ngày lắp đặt",
                    "Install Date"
                )
            ),

            lifespan: Number(
                get(
                    row,
                    "Tuổi thọ",
                    "Lifespan"
                ) || 0
            )

        };

        if (!data.line || !data.code || !data.name) {

            skipCount++;

            result.push({

                action: "SKIP",
                reason: "Thiếu Tuyến hoặc Ký hiệu hoặc Tên thiết bị",
                changedFields: [],
                row: data

            });

            continue;

        }

        const key =
            `${normalize(data.line)}_${normalize(data.code)}`;

        const old =
            deviceMap.get(key);

        if (!old) {

            newCount++;

            result.push({

                action: "NEW",
                changedFields: [],
                row: data

            });

            continue;

        }

        const changedFields = [];

        if (normalize(old.name) !== normalize(data.name))
            changedFields.push("Tên thiết bị");

        if (normalize(old.category) !== normalize(data.category))
            changedFields.push("Phân loại");

        if (normalize(old.line) !== normalize(data.line))
            changedFields.push("Tuyến");

        if (normalize(old.station) !== normalize(data.station))
            changedFields.push("Nhà ga");

        if (normalize(old.code) !== normalize(data.code))
            changedFields.push("Ký hiệu");

        if (normalize(old.area) !== normalize(data.area))
            changedFields.push("Khu vực");

        if (!sameDate(old.installDate, data.installDate))
            changedFields.push("Ngày lắp");

        if (Number(old.lifespan || 0) !== Number(data.lifespan || 0))
            changedFields.push("Tuổi thọ");

        if (changedFields.length) {

            console.log("================================");
            console.log("KEY:", key);
            console.log("Changed:", changedFields);
        
            console.log("OLD =", {
                name: old.name,
                category: old.category,
                line: old.line,
                station: old.station,
                code: old.code,
                area: old.area,
                installDate: old.installDate,
                lifespan: old.lifespan
            });
        
            console.log("NEW =", data);
        
        }

        if (changedFields.length) {

            updateCount++;

            result.push({

                action: "UPDATE",
                changedFields,
                row: data

            });

        } else {

            skipCount++;

            result.push({

                action: "SKIP",
                changedFields: [],
                row: data

            });

        }

    }

    return {

        summary: {

            total: rows.length,
            newCount,
            updateCount,
            skipCount

        },

        rows: result

    };

}

module.exports = {

    compareRows

};
