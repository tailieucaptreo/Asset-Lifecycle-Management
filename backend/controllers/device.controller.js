const ExcelJS = require("exceljs");

exports.exportExcel = async (req, res) => {
  const devices = await prisma.device.findMany();

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Devices");

  ws.columns = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Line", key: "line" },
    { header: "Station", key: "station" },
    { header: "Expiry", key: "expiryDate" },
  ];

  devices.forEach(d => ws.addRow(d));

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=devices.xlsx"
  );

  await wb.xlsx.write(res);
  res.end();
};