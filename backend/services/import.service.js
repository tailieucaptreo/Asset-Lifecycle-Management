const {
  parseDate,
  calculateExpiryDate
} = require("../utils/date");

const {
  detectCategory
} = require("./category.service");


// =====================================================
// NORMALIZE STATUS
// =====================================================

const normalizeStatus = (value) => {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return "Inactive";
  }


  const text =
    String(value)
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d");


  if (
    text === "active" ||
    text === "hoat dong" ||
    text === "dang hoat dong" ||
    text === "dang su dung" ||
    text === "su dung" ||
    text === "running"
  ) {

    return "Active";
  }


  if (
    text === "maintenance" ||
    text === "bao tri" ||
    text === "dang bao tri" ||
    text === "sua chua"
  ) {

    return "Maintenance";
  }


  if (
    text === "inactive" ||
    text === "khong hoat dong" ||
    text === "ngung hoat dong" ||
    text === "ngung su dung" ||
    text === "offline"
  ) {

    return "Inactive";
  }


  return "Inactive";
};


// =====================================================
// IMPORT ROWS
// =====================================================

async function importRows(
  prisma,
  rows
) {

  let created = 0;

  let updated = 0;

  let skipped = 0;


  const failed = [];


  // ===================================================
  // PROCESS EACH ROW
  // ===================================================

  for (
    let index = 0;
    index < rows.length;
    index++
  ) {

    const item =
      rows[index];


    // =================================================
    // SKIP
    // =================================================

    if (
      item.action === "SKIP"
    ) {

      skipped++;

      continue;
    }


    const d =
      item.row || {};


    try {

      // =================================================
      // DATES
      // =================================================

      const installDate =
        parseDate(
          d.installDate
        );


      const lastMaintenance =
        parseDate(
          d.lastMaintenance
        );


      const replacementDate =
        parseDate(
          d.replacementDate
        );


      const importedExpiryDate =
        parseDate(
          d.expiryDate
        );


      // =================================================
      // CATEGORY
      // =================================================

      let categoryInfo = null;


      try {

        categoryInfo =
          detectCategory({

            name:
              d.name,

            code:
              d.code,

            model:
              d.model || ""

          });

      }
      catch (
        categoryError
      ) {

        console.log(
          "CATEGORY DETECT ERROR:",
          categoryError.message
        );

      }


      // =================================================
      // LIFESPAN
      // =================================================

      const lifespan =
        Number(
          d.lifespan || 0
        );


      // =================================================
      // DEVICE KEY
      // =================================================

      const deviceKey =
        d.deviceKey ||
        [
          d.line,
          d.station,
          d.code,
          d.area
        ]
          .map(
            value => {

              if (
                value === undefined ||
                value === null
              ) {

                return "";
              }

              return String(value)
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(
                  /[\u0300-\u036f]/g,
                  ""
                )
                .replace(
                  /đ/g,
                  "d"
                )
                .replace(
                  /\s+/g,
                  " "
                )
                .trim();

            }
          )
          .join("|");


      // =================================================
      // DATA
      // =================================================

      const data = {

        // -----------------------------------------------
        // Mã ID
        // -----------------------------------------------

        deviceId:
          d.deviceId ||
          null,


        // -----------------------------------------------
        // Device Key
        // -----------------------------------------------

        deviceKey,


        // -----------------------------------------------
        // Thông tin
        // -----------------------------------------------

        name:
          d.name || "",


        category:
          d.category ||
          categoryInfo?.category ||
          null,


        line:
          d.line || "",


        station:
          d.station || "",


        code:
          d.code || null,


        area:
          d.area || null,


        // -----------------------------------------------
        // Status
        // -----------------------------------------------

        status:
          normalizeStatus(
            d.status
          ),


        // -----------------------------------------------
        // Dates
        // -----------------------------------------------

        originalInstallDate:
          installDate,


        installDate,


        lastMaintenance,


        replacementDate,


        // -----------------------------------------------
        // Lifespan
        // -----------------------------------------------

        lifespan:


          Number.isNaN(
            lifespan
          )

            ? null

            : lifespan,


        // -----------------------------------------------
        // Expiry
        // -----------------------------------------------

        expiryDate:
          importedExpiryDate ||
          calculateExpiryDate(
            installDate,
            lifespan
          )

      };


      // =================================================
      // NEW
      // =================================================

      if (
        item.action === "NEW"
      ) {

        await prisma.device.create({

          data

        });


        created++;


        console.log(
          `✅ NEW ROW ${
            index + 2
          }`,
          {
            deviceId:
              data.deviceId,

            deviceKey:
              data.deviceKey,

            name:
              data.name
          }
        );


        continue;
      }


      // =================================================
      // UPDATE
      // =================================================

      if (
        item.action === "UPDATE"
      ) {

        // -----------------------------------------------
        // Ưu tiên existingId từ compare
        // -----------------------------------------------

        if (
          item.existingId
        ) {

          await prisma.device.update({

            where: {

              id:
                Number(
                  item.existingId
                )

            },

            data

          });


          updated++;


          console.log(
            `🔄 UPDATE ROW ${
              index + 2
            }`,
            {
              id:
                item.existingId,

              deviceId:
                data.deviceId,

              deviceKey:
                data.deviceKey
            }
          );


          continue;
        }


        // -----------------------------------------------
        // Fallback tìm deviceKey
        // -----------------------------------------------

        const existing =
          await prisma.device.findFirst({

            where: {

              deviceKey:
                data.deviceKey

            }

          });


        if (
          !existing
        ) {

          throw new Error(
            `Không tìm thấy thiết bị để UPDATE. deviceKey=${data.deviceKey}`
          );

        }


        await prisma.device.update({

          where: {

            id:
              existing.id

          },

          data

        });


        updated++;


        continue;
      }


      // =================================================
      // ACTION KHÔNG HỢP LỆ
      // =================================================

      throw new Error(
        `Action không hợp lệ: ${item.action}`
      );

    }
    catch (err) {

      console.error(
        `❌ IMPORT ERROR ROW ${
          index + 2
        }:`,
        err.message
      );


      failed.push({

        row:
          index + 2,

        deviceId:
          d.deviceId || null,

        deviceKey:
          d.deviceKey || null,

        name:
          d.name || null,

        message:
          err.message

      });

    }

  }


  // ===================================================
  // RETURN
  // ===================================================

  return {

    inserted:
      created,

    updated,

    skipped,

    total:
      rows.length,

    errors:
      failed

  };

}


module.exports = {

  importRows

};
