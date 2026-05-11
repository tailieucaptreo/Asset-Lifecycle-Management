const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ================= GET ALL =================
exports.getAll = async (req, res) => {

  try {

    const data =
      await prisma.spareDevice.findMany({
        orderBy: {
          id: "desc"
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= GET ONE =================
exports.getOne = async (req, res) => {

  try {

    const data =
      await prisma.spareDevice.findUnique({
        where: {
          id: Number(req.params.id)
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= CREATE =================
exports.create = async (req, res) => {

  try {

    const data =
      await prisma.spareDevice.create({
        data: {
          ...req.body,

          quantity:
            Number(req.body.quantity) || 1
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPDATE =================
exports.update = async (req, res) => {

  try {

    const data =
      await prisma.spareDevice.update({

        where: {
          id: Number(req.params.id)
        },

        data: {
          ...req.body,

          quantity:
            Number(req.body.quantity) || 1
        }
      });

    res.json(data);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= DELETE =================
exports.remove = async (req, res) => {

  try {

    await prisma.spareDevice.delete({
      where: {
        id: Number(req.params.id)
      }
    });

    res.json({
      ok: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};

// ================= UPLOAD IMAGE =================
exports.uploadImage = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        error: "No file"
      });
    }

    res.json({
      image: `/uploads/${req.file.filename}`
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: err.message
    });
  }
};
