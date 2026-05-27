const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const XLSX = require("xlsx");

// ================= HELPER =================
const normalize = (v, def = "") =>
  v === undefined || v === null || v === ""
    ? def
    : v.toString().trim();

// ================= DATE =================
const parseDate = (v) => {

  if (!v) return null;

  // Excel serial
  if (typeof v === "number") {
    const d = new Date((v - 25569) * 86400000);
    return isNaN(d.getTime()) ? null : d;
  }

  const d = new Date(v);

  return isNaN(d.getTime()) ? null : d;
};

// ================= STATUS =================
const normalizeStatus = (v) => {

  if (!v) return "Inactive";

  const t = v
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  console.log("STATUS =", t);

  // ACTIVE
  if (
    t === "active" ||
    t.includes("active") ||
    t.includes("dang su dung") ||
    t.includes("su dung")
  ) {
    return "Active";
  }

  // MAINTENANCE
  if (
    t.includes("maintenance") ||
    t.includes("bao tri")
  ) {
    return "Maintenance";
  }

  return "Inactive";
};

// ================= AUTO MAINTENANCE =================

const calcMaintenance = (device) => {

if(
!device.installDate
||
!device.lifespan
){

return "Inactive";

}

const now =
new Date();

const install =
new Date(
device.installDate
);

const totalDays =
Number(
device.lifespan
) * 365;

const usedDays =
(
now - install
)
/86400000;

const percent =
usedDays
/
totalDays;

// HẾT HẠN
if(
percent >= 1
){

return "Expired";

}

// ĐẾN KỲ BẢO TRÌ
if(
percent >= 0.7
){

return "Maintenance";

}

// ĐANG HOẠT ĐỘNG
return "Active";

};

// ================= GET FIELD =================
const getField = (row, keys) => {

  for (let key of Object.keys(row)) {

    const k = key
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    if (keys.some(x => k.includes(x))) {
      return row[key];
    }
  }

  return null;
};

// ================= VALIDATE IMPORT =================

function validateRow(data){

const errors=[];

if(!data.deviceId){

errors.push(
"Thiếu mã ID"
);

}

if(!data.name){

errors.push(
"Thiếu tên thiết bị"
);

}

return errors;

}

// ================= GET =================
exports.getDevices = async (req, res) => {

  try {

      const raw = await prisma.device.findMany({
  
        orderBy:{
        id:"desc"
        }
  
      });
  
      const data = raw.map(d=>({
         ...d,
      
        status:
        calcMaintenance(
        d
        )
      
      })
  );
  
    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= CREATE =================
exports.createDevice = async (req, res) => {

  try {

    const d = req.body;

    const result = await prisma.device.create({
      data: {
        ...d,
        status: normalizeStatus(d.status),
        installDate: parseDate(d.installDate),
        lastMaintenance: parseDate(d.lastMaintenance)
      }
    });

    res.json(result);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPDATE =================
exports.updateDevice = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const d = req.body;

    const updated = await prisma.device.update({
      where: { id },
      data: {
        ...d,
        status: normalizeStatus(d.status),
        installDate: parseDate(d.installDate),
        lastMaintenance: parseDate(d.lastMaintenance)
      }
    });

    res.json(updated);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= DELETE =================
exports.deleteDevice = async (req, res) => {

  try {

    const id = Number(req.params.id);

    await prisma.device.delete({
      where: { id }
    });

    res.json({ ok: true });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= IMPORT =================
exports.importExcel = async (req, res) => {

try {

if (!req.file) {

return res.status(400).json({
error:"Không có file"
});

}

const workbook =
XLSX.read(
req.file.buffer,
{
type:"buffer"
}
);

const sheet =
workbook.Sheets[
workbook.SheetNames[0]
];

const rows =
XLSX.utils.sheet_to_json(
sheet,
{
raw:true,
defval:null
}
);

let inserted = 0;

const failed=[];

for(const row of rows){

const data={

deviceId:
String(
getField(
row,
["ma id"]
)||""
),

name:
String(
getField(
row,
["ten"]
)||""
),

line:
String(
getField(
row,
["tuyen"]
)||""
),

station:
String(
getField(
row,
["ga"]
)||""
),

code:
String(
getField(
row,
[
"ky hieu",
"code"
]
)||""
),

area:
String(
getField(
row,
["khu vuc"]
)||""
),

status:
normalizeStatus(
getField(
row,
["trang thai"]
)
),

installDate:
parseDate(
getField(
row,
["ngay lap"]
)
),

lifespan:
Number(
getField(
row,
["tuoi tho"]
)
)||0

};

const errors=
validateRow(
data
);

if(
errors.length
){

failed.push({

row,

errors

});

continue;

}

try{

await prisma.device.create({

data

});

inserted++;

}

catch(err){

failed.push({

row,

errors:[
err.message
]

});

}

}

return res.json({

ok:true,

message:"Import thành công",

total: rows.length,

success: inserted,

failedCount: failed.length,

failed

});

}

catch(err){

console.log(err);

res.status(500).json({

error:
err.message

});

}

};

// ================= GET ONE =================

exports.getOne =
async (
req,
res
)=>{

try{

const id =
Number(
req.params.id
);

const data =
await prisma.device.findUnique({

where:{
id
}

});

if(!data){

return res
.status(404)
.json({

message:
"Không tìm thấy thiết bị"

});

}

res.json(
data
);

}

catch(err){

console.log(err);

res
.status(500)
.json({

error:
err.message

});

}

};
