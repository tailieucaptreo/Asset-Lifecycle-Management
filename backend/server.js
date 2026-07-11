const express = require("express");
const cors = require("cors");

const deviceRoutes =
    require("./routes/device.routes");

const workRoutes =
    require("./routes/work.routes");

const spareRoutes =
    require("./routes/spare.routes");

const authRoutes =
    require("./routes/auth.routes");

const { PrismaClient } =
    require("@prisma/client");

const prisma =
    new PrismaClient();

const app =
    express();

const vaconRoutes =
  require("./routes/vacon.routes");

const driveRoutes =
    require("./routes/drive.routes");

const abbRoutes =
    require("./routes/abb.routes");

// ===== CORS =====

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS"
    ]
  })
);

app.options("*", cors({
  origin: true,
  credentials: true
}));

// ===== BODY =====

app.use(
    express.json()
);


// ===== ROUTES =====

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/devices",
    deviceRoutes
);

app.use(
    "/api/work-orders",
    workRoutes
);

app.use(
    "/api/spare-devices",
    spareRoutes
);

app.use(
    "/api/vacon-records",
    vaconRoutes
);

app.use(
    "/api/drives",
    driveRoutes
);

app.use(
    "/api/abb-faults",
    abbRoutes
);

// ===== TEST =====

app.get(
    "/",
    (req, res) => {

        res.send(
            "API RUNNING..."
        );

    }
);


// ===== FIX DB =====

app.get(
    "/fix-db",

    async (
        req,
        res
    ) => {

        try {

            await prisma.$executeRawUnsafe(`

DROP INDEX IF EXISTS "Device_deviceId_key"

`);

            res.json({

                ok: true,

                message:

                    "Đã xóa unique"

            });

        }

        catch (err) {

            console.log(err);

            res.status(500).json({

                ok: false,

                error:
                    err.message

            });

        }

    }
);


// ===== START =====

const PORT =
    process.env.PORT ||
    5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server chạy ${PORT}`
        );

    }
);
