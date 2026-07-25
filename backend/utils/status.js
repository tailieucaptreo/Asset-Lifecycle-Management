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

    if (!device || !device.installDate) {
        return "Inactive";
    }

    const now = new Date();

    // =======================================
    // Ưu tiên dùng expiryDate
    // =======================================

    if (device.expiryDate) {

        const install = new Date(device.installDate);
        const expiry = new Date(device.expiryDate);

        if (isNaN(install) || isNaN(expiry)) {
            return "Inactive";
        }

        // Đã hết hạn
        if (now >= expiry) {
            return "Expired";
        }

        // % tuổi thọ đã sử dụng
        const total = expiry.getTime() - install.getTime();
        const used = now.getTime() - install.getTime();

        if (total > 0) {

            const percent = used / total;

            if (percent >= 0.7) {
                return "Maintenance";
            }

        }

        return "Active";
    }

    // =======================================
    // Fallback nếu chưa có expiryDate
    // =======================================

    if (!device.lifespan) {
        return "Inactive";
    }

    const install = new Date(device.installDate);

    if (isNaN(install)) {
        return "Inactive";
    }

    const totalDays = Number(device.lifespan) * 365;
    const usedDays = (now.getTime() - install.getTime()) / 86400000;

    const percent = usedDays / totalDays;

    if (percent >= 1) {
        return "Expired";
    }

    if (percent >= 0.7) {
        return "Maintenance";
    }

    return "Active";
}
module.exports = {

    normalizeStatus,

    calcMaintenance

};
