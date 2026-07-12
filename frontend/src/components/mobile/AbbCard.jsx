import MobileCard from "./MobileCard";
import MobileInfo from "./MobileInfo";
import MobileStatus from "./MobileStatus";
import MobileActions from "./MobileActions";

export default function AbbCard({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <MobileCard

            title={item.typeCode || "ABB"}

            subtitle={item.serialNumber}

            status={

                <MobileStatus

                    status={item.currentStatus}

                />

            }

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

                label="Tuyến"

                value={item.line}

            />

            <MobileInfo

                label="Nhà ga"

                value={item.station}

            />

            <MobileInfo

                label="Ứng dụng"

                value={item.application}

            />

            <MobileInfo

                label="Firmware"

                value={item.firmware}

            />

            <MobileInfo

                label="Giờ hoạt động"

                value={item.operationHours}

            />

            <MobileInfo

                label="On-time"

                value={item.onTimeDay}

            />

            <MobileInfo

                label="Running Day"

                value={item.runningDay}

            />

            <MobileInfo

                label="Ngày thay"

                value={
                    item.lastReplaceDate
                        ? new Date(item.lastReplaceDate)
                              .toLocaleDateString("vi-VN")
                        : "-"
                }

            />

            <MobileInfo

                label="Ngày bảo dưỡng"

                value={
                    item.lastMaintenance
                        ? new Date(item.lastMaintenance)
                              .toLocaleDateString("vi-VN")
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
