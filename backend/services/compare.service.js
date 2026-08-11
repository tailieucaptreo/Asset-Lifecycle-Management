const {
  parseDate,
  sameDate
} = require("../utils/date");

const {
  normalize
} = require("../utils/normalize");


// =====================================================
// NORMALIZE HEADER
// =====================================================

const normalizeHeader = (value) => {

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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[_\-\/\\().:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};


// =====================================================
// NORMALIZE KEY
// =====================================================

const normalizeKey = (value) => {

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
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();
};


// =====================================================
// HEADER ALIASES
// =====================================================

const HEADER_ALIASES = {

  deviceId: [
    "ma id",
    "ma thiet bi",
    "ma tb",
    "device id",
    "deviceid",
    "equipment id",
    "asset id"
  ],

  name: [
    "ten thiet bi",
    "ten",
    "device name",
    "device",
    "name",
    "equipment name"
  ],

  category: [
    "phan loai",
    "loai thiet bi",
    "category",
    "type",
    "device type"
  ],

  line: [
    "tuyen",
    "tuyen cap",
    "tuyen cap treo",
    "line",
    "cable line",
    "cable"
  ],

  station: [
    "nha ga",
    "ga",
    "station",
    "station name"
  ],

  code: [
    "ky hieu",
    "ky hieu thiet bi",
    "symbol",
    "code",
    "device code"
  ],

  area: [
    "khu vuc",
    "khu vuc lap dat",
    "vi tri",
    "location",
    "area",
    "position"
  ],

  status: [
    "trang thai",
    "tinh trang",
    "status",
    "device status",
    "state"
  ],

  installDate: [
    "ngay lap",
    "ngay lap dat",
    "ngay lap dat lan dau",
    "ngay cai dat",
    "install date",
    "installation date",
    "installed date"
  ],

  lastMaintenance: [
    "ngay bao tri",
    "ngay bao tri gan nhat",
    "ngay bt",
    "ngay bt gan nhat",
    "last maintenance",
    "last maintenance date",
    "maintenance date"
  ],

  replacementDate: [
    "ngay thay the",
    "ngay thay",
    "replacement date",
    "replace date"
  ],

  expiryDate: [
    "ngay het han",
    "het han",
    "expiry date",
    "expiration date"
  ],

  lifespan: [
    "tuoi tho",
    "tuoi tho thiet bi",
    "thoi gian su dung",
    "lifespan",
    "life",
    "service life"
  ]
};


// =====================================================
// FIND FIELD
// =====================================================

const getField = (
  row,
  field
) => {

  const aliases =
    HEADER_ALIASES[field] || [];

  const rowKeys =
    Object.keys(row);


  // ---------------------------------------------------
  // Exact normalized match
  // ---------------------------------------------------

  for (
    const rowKey of rowKeys
  ) {

    const normalizedRowKey =
      normalizeHeader(rowKey);

    for (
      const alias of aliases
    ) {

      if (
        normalizedRowKey ===
        normalizeHeader(alias)
      ) {

        return row[rowKey];
      }
    }
  }


  // ---------------------------------------------------
  // Partial match
  // ---------------------------------------------------

  for (
    const rowKey of rowKeys
  ) {

    const normalizedRowKey =
      normalizeHeader(rowKey);

    for (
      const alias of aliases
    ) {

      const normalizedAlias =
        normalizeHeader(alias);

      if (
        normalizedRowKey.includes(
          normalizedAlias
        )
      ) {

        return row[rowKey];
      }
    }
  }


  return "";
};


// =====================================================
// STATUS
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
    normalizeHeader(value);


  // Active

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


  // Maintenance

  if (
    text === "maintenance" ||
    text === "bao tri" ||
    text === "dang bao tri" ||
    text === "sua chua"
  ) {

    return "Maintenance";
  }


  // Inactive

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
// DEVICE KEY
// =====================================================

const makeDeviceKey = ({
  line,
  station,
  code,
  area
}) => {

  return [

    normalizeKey(line),

    normalizeKey(station),

    normalizeKey(code),

    normalizeKey(area)

  ].join("|");
};


// =====================================================
// BUILD DEVICE DATA
// =====================================================

const buildDeviceData = (row) => {

  const deviceId =
    normalize(
      getField(
        row,
        "deviceId"
      )
    );


  const name =
    normalize(
      getField(
        row,
        "name"
      )
    );


  const category =
    normalize(
      getField(
        row,
        "category"
      )
    );


  const line =
    normalize(
      getField(
        row,
        "line"
      )
    );


  const station =
    normalize(
      getField(
        row,
        "station"
      )
    );


  const code =
    normalize(
      getField(
        row,
        "code"
      )
    );


  const area =
    normalize(
      getField(
        row,
        "area"
      )
    );


  const status =
    normalizeStatus(
      getField(
        row,
        "status"
      )
    );


  const installDate =
    parseDate(
      getField(
        row,
        "installDate"
      )
    );


  const lastMaintenance =
    parseDate(
      getField(
        row,
        "lastMaintenance"
      )
    );


  const replacementDate =
    parseDate(
      getField(
        row,
        "replacementDate"
      )
    );


  const expiryDate =
    parseDate(
      getField(
        row,
        "expiryDate"
      )
    );


  const lifespanValue =
    getField(
      row,
      "lifespan"
    );


  const lifespan =
    Number(
      lifespanValue || 0
    );


  // =================================================
  // DEVICE KEY
  // =================================================

  const deviceKey =
    makeDeviceKey({

      line,

      station,

      code,

      area

    });


  return {

    deviceId,

    deviceKey,

    name,

    category,

    line,

    station,

    code,

    area,

    status,

    installDate,

    lastMaintenance,

    replacementDate,

    expiryDate,

    lifespan:
      Number.isNaN(lifespan)
        ? 0
        : lifespan

  };
};


// =====================================================
// COMPARE ROWS
// =====================================================

async function compareRows(
  prisma,
  rows
) {

  // ===================================================
  // LOAD EXISTING DEVICES
  // ===================================================

  const devices =
    await prisma.device.findMany({

      select: {

        id: true,

        deviceId: true,

        deviceKey: true,

        name: true,

        category: true,

        line: true,

        station: true,

        code: true,

        area: true,

        status: true,

        installDate: true,

        lastMaintenance: true,

        replacementDate: true,

        expiryDate: true,

        lifespan: true

      }

    });


  // ===================================================
  // MAP DEVICE KEY
  // ===================================================

  const deviceMap =
    new Map();


  devices.forEach(
    (device) => {

      let key =
        device.deviceKey;


      // ------------------------------------------------
      // Nếu dữ liệu cũ chưa có deviceKey
      // ------------------------------------------------

      if (
        !key &&
        device.line &&
        device.station &&
        device.code
      ) {

        key =
          makeDeviceKey({

            line:
              device.line,

            station:
              device.station,

            code:
              device.code,

            area:
              device.area

          });

      }


      if (key) {

        deviceMap.set(
          key,
          device
        );

      }

    }
  );


  let newCount = 0;

  let updateCount = 0;

  let skipCount = 0;


  const result = [];


  // ===================================================
  // PROCESS EXCEL
  // ===================================================

  for (
    let index = 0;
    index < rows.length;
    index++
  ) {

    const row =
      rows[index];


    console.log(
      `\n========== EXCEL ROW ${
        index + 2
      } ==========`
    );


    console.log(
      "COLUMN NAMES:",
      Object.keys(row)
    );


    const data =
      buildDeviceData(row);


    console.log(
      "DEVICE DATA:",
      {

        deviceId:
          data.deviceId,

        name:
          data.name,

        line:
          data.line,

        station:
          data.station,

        code:
          data.code,

        area:
          data.area,

        status:
          data.status,

        deviceKey:
          data.deviceKey

      }
    );


    // =================================================
    // REQUIRED FIELDS
    // =================================================

    if (
      !data.name ||
      !data.line ||
      !data.station ||
      !data.code
    ) {

      skipCount++;


      result.push({

        action: "SKIP",

        reason:
          "Thiếu Tên thiết bị, Tuyến, Nhà ga hoặc Ký hiệu",

        changedFields: [],

        row: data

      });


      continue;
    }


    // =================================================
    // FIND OLD DEVICE
    // =================================================

    const old =
      deviceMap.get(
        data.deviceKey
      );


    // =================================================
    // NEW
    // =================================================

    if (!old) {

      newCount++;


      result.push({

        action: "NEW",

        changedFields: [],

        row: data

      });


      continue;
    }


    // =================================================
    // COMPARE
    // =================================================

    const changedFields = [];


    if (
      normalize(old.deviceId) !==
      normalize(data.deviceId)
    ) {

      changedFields.push(
        "Mã ID"
      );

    }


    if (
      normalize(old.name) !==
      normalize(data.name)
    ) {

      changedFields.push(
        "Tên thiết bị"
      );

    }


    if (
      normalize(old.category) !==
      normalize(data.category)
    ) {

      changedFields.push(
        "Phân loại"
      );

    }


    if (
      normalize(old.line) !==
      normalize(data.line)
    ) {

      changedFields.push(
        "Tuyến"
      );

    }


    if (
      normalize(old.station) !==
      normalize(data.station)
    ) {

      changedFields.push(
        "Nhà ga"
      );

    }


    if (
      normalize(old.code) !==
      normalize(data.code)
    ) {

      changedFields.push(
        "Ký hiệu"
      );

    }


    if (
      normalize(old.area) !==
      normalize(data.area)
    ) {

      changedFields.push(
        "Khu vực"
      );

    }


    if (
      normalize(old.status) !==
      normalize(data.status)
    ) {

      changedFields.push(
        "Trạng thái"
      );

    }


    if (
      !sameDate(
        old.installDate,
        data.installDate
      )
    ) {

      changedFields.push(
        "Ngày lắp"
      );

    }


    if (
      !sameDate(
        old.lastMaintenance,
        data.lastMaintenance
      )
    ) {

      changedFields.push(
        "Ngày bảo trì"
      );

    }


    if (
      !sameDate(
        old.replacementDate,
        data.replacementDate
      )
    ) {

      changedFields.push(
        "Ngày thay thế"
      );

    }


    if (
      !sameDate(
        old.expiryDate,
        data.expiryDate
      )
    ) {

      changedFields.push(
        "Ngày hết hạn"
      );

    }


    if (
      Number(old.lifespan || 0) !==
      Number(data.lifespan || 0)
    ) {

      changedFields.push(
        "Tuổi thọ"
      );

    }


    // =================================================
    // UPDATE
    // =================================================

    if (
      changedFields.length > 0
    ) {

      updateCount++;


      console.log(
        "UPDATE:",
        {

          existingId:
            old.id,

          deviceKey:
            data.deviceKey,

          changedFields

        }
      );


      result.push({

        action: "UPDATE",

        existingId:
          old.id,

        changedFields,

        row: data

      });


      continue;
    }


    // =================================================
    // SKIP
    // =================================================

    skipCount++;


    result.push({

      action: "SKIP",

      existingId:
        old.id,

      changedFields: [],

      row: data

    });

  }


  // ===================================================
  // RESULT
  // ===================================================

  return {

    summary: {

      total:
        rows.length,

      newCount,

      updateCount,

      skipCount

    },

    rows:
      result

  };

}


module.exports = {

  compareRows

};
