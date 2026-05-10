const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ================= GET ALL =================
exports.getAll = async (req, res) => {

  const data = await prisma.spareDevice.findMany({
    orderBy: {
      id: "desc"
    }
  });

  res.json(data);
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {

  const id = Number(req.params.id);

  const data = await prisma.spareDevice.findUnique({
    where: { id }
  });

  res.json(data);
};

// ================= CREATE =================
exports.create = async (req, res) => {

  const d = req.body;

  const data = await prisma.spareDevice.create({
    data: {
      ...d,
      quantity: Number(d.quantity || 1)
    }
  });

  res.json(data);
};

// ================= UPDATE =================
exports.update = async (req, res) => {

  const id = Number(req.params.id);

  const data = await prisma.spareDevice.update({
    where: { id },
    data: req.body
  });

  res.json(data);
};

// ================= DELETE =================
exports.remove = async (req, res) => {

  const id = Number(req.params.id);

  await prisma.spareDevice.delete({
    where: { id }
  });

  res.json({
    ok: true
  });
};
