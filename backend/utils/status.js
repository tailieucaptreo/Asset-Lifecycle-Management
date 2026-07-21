// =======================================
// Status Utils
// =======================================

// Chuẩn hóa trạng thái
function normalizeStatus(value = "") {

    if (!value) {

        return "Inactive";

    }

    const text = value
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    // ===========================
    // ACTIVE
    // ===========================

    if (

        text === "active" ||

        text.includes("active") ||

        text.includes("dang su dung") ||

        text.includes("su dung") ||

        text.includes("running") ||

        text.includes("online")

    ) {

        return "Active";

    }

    // ===========================
    // MAINTENANCE
    // ===========================

    if (

        text.includes("maintenance") ||

        text.includes("bao tri") ||

        text.includes("repair")

    ) {

        return "Maintenance";

    }

    // ===========================
    // EXPIRED
    // ===========================

    if (

        text.includes("expired") ||

        text.includes("het han")

    ) {

        return "Expired";

    }

    return "Inactive";

}

// =======================================
// Tính trạng thái theo tuổi thọ
// =======================================

function calcMaintenance(device) {

    if (

        !device.installDate ||

        !device.lifespan

    ) {

        return "Inactive";

    }

    const now = new Date();

    const install = new Date(

        device.installDate

    );

    const totalDays =

        Number(device.lifespan) * 365;

    const usedDays =

        (now - install) /

        86400000;

    const percent =

        usedDays /

        totalDays;

    // ===========================
    // EXPIRED
    // ===========================

    if (

        percent >= 1

    ) {

        return "Expired";

    }

    // ===========================
    // MAINTENANCE
    // ===========================

    if (

        percent >= 0.7

    ) {

        return "Maintenance";

    }

    return "Active";

}

module.exports = {

    normalizeStatus,

    calcMaintenance

};
