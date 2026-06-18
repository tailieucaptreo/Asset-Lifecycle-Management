const { PrismaClient } =
require("@prisma/client");

const prisma =
new PrismaClient();

exports.getAll = async (req, res) => {

  const data =
    await prisma.category.findMany({
      include: {
        _count: {
          select: {
            devices: true
          }
        }
      }
    });

  res.json(data);
};

exports.create = async (req, res) => {

  const { code, name } = req.body;

  const category =
    await prisma.category.create({
      data: {
        code,
        name
      }
    });

  res.json(category);
};
