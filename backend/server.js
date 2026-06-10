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

app.use(
  "/api/vacon",
  vaconRoutes
);

// ===== CORS =====

app.use(

    cors({

        origin: [

            "http://localhost:5173",

            "https://asset-lifecycle-management.vercel.app"

        ],

        methods: [

            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"

        ],

        credentials: true

    })

);

app.options(
    "*",
    cors()
);


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
