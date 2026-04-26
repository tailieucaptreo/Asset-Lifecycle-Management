const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET
exports.getAll = async (req, res) => {
  const data = await prisma.workOrder.findMany({
    include: { device: true },
    orderBy: { id: "desc" }
  });
  res.json(data);
};

// CREATE
exports.create = async (req, res) => {
  const { title, deviceId } = req.body;

  const data = await prisma.workOrder.create({
    data: {
      title,
      deviceId: Number(deviceId),
      status: "Pending"
    }
  });

  res.json(data);
};

// UPDATE STATUS
exports.update = async (req, res) => {
  const id = Number(req.params.id);

  const data = await prisma.workOrder.update({
    where: { id },
    data: req.body
  });

  res.json(data);
};

// DELETE
exports.remove = async (req, res) => {
  const id = Number(req.params.id);

  await prisma.workOrder.delete({
    where: { id }
  });

  res.json({ message: "Deleted" });
};
