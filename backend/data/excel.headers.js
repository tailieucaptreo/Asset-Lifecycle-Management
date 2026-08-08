// =======================================
// Excel Header Mapping
// Chuẩn hóa tên cột Database -> Tiếng Việt
// =======================================

module.exports = {

    // ===================================
    // 01 - THIẾT BỊ
    // ===================================

    Device: {

        id: "STT",

        name: "Tên thiết bị",

        line: "Tuyến",

        station: "Nhà ga",

        category: "Phân loại",

        code: "Ký hiệu",

        area: "Khu vực",

        deviceId: "Mã thiết bị",

        status: "Trạng thái",

        originalInstallDate: "Ngày lắp lần đầu",

        installDate: "Ngày lắp hiện tại",

        lastMaintenance: "Ngày bảo trì",

        replacementDate: "Ngày thay thế",

        lifespan: "Tuổi thọ (năm)",

        expiryDate: "Ngày hết hạn",

        createdAt: "Ngày tạo"

    },


    // ===================================
    // 02 - ĐỘNG CƠ
    // ===================================

    Motor: {

        id: "STT",

        deviceId: "Mã động cơ",

        name: "Tên động cơ",

        type: "Loại động cơ",

        quantity: "Số lượng",

        brand: "Hãng",

        model: "Model",

        serial: "Số Serial",

        power: "Công suất",

        voltage: "Điện áp",

        current: "Dòng điện",

        frequency: "Tần số",

        rpm: "Tốc độ (RPM)",

        efficiency: "Hiệu suất",

        pole: "Số cực",

        bearingCode: "Mã bạc đạn",

        line: "Tuyến",

        station: "Nhà ga",

        location: "Vị trí",

        warehouse: "Kho",

        status: "Trạng thái",

        installDate: "Ngày lắp",

        maintenanceDate: "Ngày bảo trì",

        replacementDate: "Ngày thay thế",

        oldMotor: "Động cơ cũ",

        newMotor: "Động cơ mới",

        maintenanceContent: "Nội dung bảo trì",

        runningHours: "Giờ vận hành",

        image: "Hình ảnh",

        note: "Ghi chú",

        createdAt: "Ngày tạo",

        updatedAt: "Ngày cập nhật"

    },


    // ===================================
    // 03 - BIẾN TẦN
    // ===================================

    Drive: {

        id: "STT",

        name: "Tên biến tần",

        deviceId: "Mã biến tần",

        brand: "Hãng",

        model: "Model",

        serialNumber: "Số Serial",

        firmware: "Firmware",

        ipAddress: "Địa chỉ IP",

        power: "Công suất",

        voltage: "Điện áp",

        current: "Dòng điện",

        line: "Tuyến",

        station: "Nhà ga",

        location: "Vị trí",

        status: "Trạng thái",

        image: "Hình ảnh",

        note: "Ghi chú",

        installDate: "Ngày lắp",

        createdAt: "Ngày tạo",

        updatedAt: "Ngày cập nhật"

    },


    // ===================================
    // 04 - THIẾT BỊ DỰ PHÒNG
    // ===================================

    SpareDevice: {

        id: "STT",

        name: "Tên vật tư",

        deviceId: "Mã thiết bị",

        symbol: "Ký hiệu",

        materialCode: "Mã vật tư",

        initialQuantity: "Số lượng ban đầu",

        quantity: "Số lượng hiện tại",

        importQty: "Số lượng nhập",

        exportQty: "Số lượng xuất",

        unit: "Đơn vị",

        condition: "Tình trạng",

        buyDate: "Ngày mua",

        removedDate: "Ngày xuất",

        warehouse: "Kho",

        cabinet: "Tủ",

        shelf: "Kệ",

        slot: "Ngăn",

        image: "Hình ảnh",

        note: "Ghi chú",

        editedBy: "Người cập nhật",

        createdAt: "Ngày tạo"

    },


    // ===================================
    // 05 - LỖI BIẾN TẦN
    // ===================================

    DriveFault: {

        id: "STT",

        driveId: "Mã biến tần",

        code: "Mã lỗi",

        title: "Tên lỗi",

        description: "Mô tả lỗi",

        solution: "Biện pháp xử lý",

        repairedBy: "Người sửa chữa",

        note: "Ghi chú",

        createdAt: "Ngày ghi nhận"

    },


    // ===================================
    // 06 - LỖI ĐỘNG CƠ
    // ===================================

    MotorFault: {

        id: "STT",

        motorId: "Mã động cơ",

        faultDate: "Ngày xảy ra lỗi",

        faultCode: "Mã lỗi",

        title: "Tên lỗi",

        description: "Mô tả lỗi",

        solution: "Biện pháp xử lý",

        downtime: "Thời gian dừng (phút)",

        status: "Trạng thái xử lý",

        createdAt: "Ngày ghi nhận"

    },


    // ===================================
    // 07 - LỖI ABB
    // ===================================

    AbbFaultRecord: {

        id: "STT",

        typeCode: "Mã loại biến tần",

        serialNumber: "Số Serial",

        line: "Tuyến",

        station: "Nhà ga",

        application: "Ứng dụng",

        firmware: "Firmware",

        currentStatus: "Trạng thái hiện tại",

        replaceReason: "Lý do thay thế",

        operationHours: "Giờ vận hành",

        lastReplaceDate: "Ngày thay thế gần nhất",

        onTimeDay: "Số ngày có điện",

        runningDay: "Số ngày vận hành",

        lastMaintenance: "Ngày bảo trì gần nhất",

        maintenanceWork: "Nội dung bảo trì",

        note: "Ghi chú",

        createdAt: "Ngày ghi nhận"

    },


    // ===================================
    // 08 - LỊCH SỬ THIẾT BỊ
    // ===================================

    DeviceHistory: {

        id: "STT",

        deviceId: "Mã thiết bị",

        action: "Thao tác",

        user: "Người thực hiện",

        code: "Ký hiệu",

        name: "Tên thiết bị",

        note: "Ghi chú",

        changes: "Nội dung thay đổi",

        createdAt: "Thời gian thực hiện"

    },


    // ===================================
    // 09 - LỊCH SỬ ĐỘNG CƠ
    // ===================================

    MotorHistory: {

        id: "STT",

        motorId: "Mã động cơ",

        action: "Thao tác",

        user: "Người thực hiện",

        deviceId: "Mã thiết bị",

        name: "Tên động cơ",

        note: "Ghi chú",

        changes: "Nội dung thay đổi",

        createdAt: "Thời gian thực hiện"

    },


    // ===================================
    // 10 - BẢO TRÌ ĐỘNG CƠ
    // ===================================

    MotorMaintenance: {

        id: "STT",

        motorId: "Mã động cơ",

        maintenanceDate: "Ngày bảo trì",

        type: "Loại bảo trì",

        technician: "Kỹ thuật viên",

        runningHours: "Giờ vận hành",

        cost: "Chi phí",

        result: "Kết quả",

        note: "Ghi chú",

        createdAt: "Ngày ghi nhận"

    },


    // ===================================
    // 11 - LỊCH SỬ KHO
    // ===================================

    SpareHistory: {

        id: "STT",

        action: "Thao tác",

        deviceName: "Tên vật tư",

        quantity: "Số lượng",

        editedBy: "Người thực hiện",

        note: "Ghi chú",

        createdAt: "Thời gian thực hiện"

    }

};