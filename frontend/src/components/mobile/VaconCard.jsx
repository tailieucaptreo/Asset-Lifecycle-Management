import MobileCard from "./MobileCard";
import MobileInfo from "./MobileInfo";
import MobileActions from "./MobileActions";

export default function VaconCard({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <MobileCard

            title={item.deviceName || "VACON"}

            subtitle={item.serialNumber || "-"}

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

                label="Station"

                value={item.station || "-"}

            />

            <MobileInfo

                label="Tandem"

                value={item.tandem || "-"}

            />

            <MobileInfo

                label="Application"

                value={item.application || "-"}

            />

            <MobileInfo

                label="Lần kiểm tra gần nhất"

                value={
                    item.recordDate
                        ? new Date(item.recordDate).toLocaleDateString("vi-VN")
                        : "-"
                }

            />

            <MobileInfo

                label="Số lần kiểm tra"

                value={item._count?.histories || 0}

            />

        </MobileCard>

    );

}