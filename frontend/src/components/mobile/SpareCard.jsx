import MobileCard from "./MobileCard";
import MobileInfo from "./MobileInfo";
import MobileActions from "./MobileActions";

export default function SpareCard({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <MobileCard

            title={item.name}

            subtitle={item.deviceId || item.materialCode}

            actions={

                <MobileActions

                    role={role}

                    item={item}

                    onView={onView}

                    onEdit={onEdit}

                    onDelete={onDelete}

                />

            }

        >

            <MobileInfo

                label="Mã thiết bị"

                value={item.deviceId}

            />

            <MobileInfo

                label="Material Code"

                value={item.materialCode}

            />

            <MobileInfo

                label="Ký hiệu"

                value={item.symbol}

            />

            <MobileInfo

                label="Số lượng"

                value={item.quantity}

            />

            <MobileInfo

                label="Tồn đầu"

                value={item.initialQuantity}

            />

            <MobileInfo

                label="Nhập"

                value={item.importQty}

            />

            <MobileInfo

                label="Xuất"

                value={item.exportQty}

            />

            <MobileInfo

                label="Đơn vị"

                value={item.unit}

            />

            <MobileInfo

                label="Kho"

                value={item.warehouse}

            />

            <MobileInfo

                label="Tủ"

                value={item.cabinet}

            />

            <MobileInfo

                label="Kệ"

                value={item.shelf}

            />

            <MobileInfo

                label="Ngăn"

                value={item.slot}

            />

            <MobileInfo

                label="Tình trạng"

                value={item.condition}

            />

            <MobileInfo

                label="Ngày mua"

                value={
                    item.buyDate

                        ? new Date(
                            item.buyDate
                          ).toLocaleDateString("vi-VN")

                        : "-"
                }

            />

            <MobileInfo

                label="Ngày loại bỏ"

                value={
                    item.removedDate

                        ? new Date(
                            item.removedDate
                          ).toLocaleDateString("vi-VN")

                        : "-"
                }

            />

            {

                item.note &&

                <MobileInfo

                    label="Ghi chú"

                    value={item.note}

                />

            }

        </MobileCard>

    );

}
