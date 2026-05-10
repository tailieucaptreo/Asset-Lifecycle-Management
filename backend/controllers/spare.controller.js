const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ================= GET ALL =================
exports.getAll = async (req, res) => {

  try {

    const data = await prisma.spareDevice.findMany({
      orderBy: {
        id: "desc"
      }
    });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Server error"
    });
  }
};
