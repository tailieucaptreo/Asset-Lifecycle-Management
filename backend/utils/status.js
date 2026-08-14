// =====================================================
// STATUS UTILS
// =====================================================

/**
 * Chuẩn hóa text để xử lý trạng thái.
 *
 * Ví dụ:
 * "Đang hoạt động"
 * "đang hoạt động"
 * "DANG HOAT DONG"
 * "Dang hoat dong"
 *
 * => "dang hoat dong"
 */
function normalizeStatusText(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .trim()
        .toLowerCase()

        // Bỏ dấu tiếng Việt
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

        // Đổi đ / Đ
        .replace(/đ/g, "d")

        // Chuẩn hóa khoảng trắng
        .replace(/\s+/g, " ")

        .trim();
}


// =====================================================
// NORMALIZE STATUS
// =====================================================
//
// Các trạng thái chuẩn của hệ thống:
//
// Active
// Maintenance
// Inactive
// Expired
//
// Tuyệt đối không trả về trạng thái tiếng Việt
// từ hàm này.
//
// =====================================================

function normalizeStatus(value) {

    const status =
        normalizeStatusText(value);

    // -------------------------------------------------
    // Không có trạng thái
    // -------------------------------------------------

    if (!status) {
        return "Inactive";
    }


    // -------------------------------------------------
    // ACTIVE
    // -------------------------------------------------

    if (
        status === "active" ||
        status === "running" ||
        status === "run" ||

        status.includes("dang hoat dong") ||
        status.includes("dang su dung") ||
        status.includes("su dung") ||

        status === "hoat dong" ||
        status === "hoat dong binh thuong"
    ) {
        return "Active";
    }


    // -------------------------------------------------
    // MAINTENANCE
    // -------------------------------------------------

    if (
        status === "maintenance" ||
        status === "maintain" ||
        status === "service" ||

        status.includes("dang bao tri") ||
        status.includes("bao tri") ||
        status.includes("bao duong") ||
        status.includes("dang sua chua") ||
        status.includes("sua chua")
    ) {
        return "Maintenance";
    }


    // -------------------------------------------------
    // EXPIRED
    // -------------------------------------------------

    if (
        status === "expired" ||
        status === "expire" ||

        status.includes("het han") ||
        status.includes("qua han") ||
        status.includes("het tuoi tho")
    ) {
        return "Expired";
    }


    // -------------------------------------------------
    // INACTIVE
    // -------------------------------------------------

    if (
        status === "inactive" ||
        status === "disabled" ||
        status === "disable" ||
        status === "offline" ||
        status === "stopped" ||
        status === "stop" ||

        status.includes("khong hoat dong") ||
        status.includes("ngung hoat dong") ||
        status.includes("ngung su dung") ||
        status.includes("khong su dung") ||
        status.includes("da ngung")
    ) {
        return "Inactive";
    }


    // -------------------------------------------------
    // MẶC ĐỊNH
    // -------------------------------------------------
    //
    // Không nhận diện được trạng thái thì không tự
    // coi là Active.
    //
    // -------------------------------------------------

    return "Inactive";
}


// =====================================================
// CALCULATE MAINTENANCE
// =====================================================
//
// Tính trạng thái theo:
// - Ngày lắp
// - Tuổi thọ
//
// Quy tắc hiện tại:
// >= 100%  -> Expired
// >= 70%   -> Maintenance
// < 70%    -> Active
//
// =====================================================

function calcMaintenance(device) {

    if (
        !device ||
        !device.installDate ||
        !device.lifespan
    ) {
        return "Inactive";
    }


    const installDate =
        new Date(
            device.installDate
        );

    const now =
        new Date();


    // -------------------------------------------------
    // Kiểm tra ngày hợp lệ
    // -------------------------------------------------

    if (
        Number.isNaN(
            installDate.getTime()
        )
    ) {
        return "Inactive";
    }


    const lifespan =
        Number(
            device.lifespan
        );


    if (
        !Number.isFinite(lifespan) ||
        lifespan <= 0
    ) {
        return "Inactive";
    }


    // -------------------------------------------------
    // TÍNH SỐ NGÀY
    // -------------------------------------------------

    const totalDays =
        lifespan * 365;


    const usedDays =
        (
            now.getTime() -
            installDate.getTime()
        ) / 86400000;


    // -------------------------------------------------
    // Nếu ngày lắp nằm trong tương lai
    // -------------------------------------------------

    if (usedDays < 0) {
        return "Active";
    }


    const percent =
        usedDays /
        totalDays;


    // -------------------------------------------------
    // HẾT HẠN
    // -------------------------------------------------

    if (
        percent >= 1
    ) {
        return "Expired";
    }


    // -------------------------------------------------
    // ĐẾN KỲ BẢO TRÌ
    // -------------------------------------------------

    if (
        percent >= 0.7
    ) {
        return "Maintenance";
    }


    // -------------------------------------------------
    // ĐANG HOẠT ĐỘNG
    // -------------------------------------------------

    return "Active";
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    normalizeStatus,
    normalizeStatusText,
    calcMaintenance
};