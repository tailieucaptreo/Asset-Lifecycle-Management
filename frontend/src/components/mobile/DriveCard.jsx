import MobileCard from "./MobileCard";
import MobileInfo from "./MobileInfo";
import MobileStatus from "./MobileStatus";
import MobileActions from "./MobileActions";

export default function DriveCard({

    item,

    role,

    onView,

    onEdit,

    onDelete

}) {

    return (

        <MobileCard

            title={item.model}

            subtitle={item.brand}

            status={

                <MobileStatus

                    status={item.status}

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

                label="Mã thiết bị"

                value={item.deviceId}

            />

            <MobileInfo

                label="Tuyến"

                value={item.line}

            />

            <MobileInfo

                label="Nhà ga"

                value={item.station}

            />

            <MobileInfo

                label="Vị trí"

                value={item.location}

            />

            <MobileInfo

                label="Serial Number"

                value={item.serialNumber}

            />

            <MobileInfo

                label="Firmware"

                value={item.firmware}

            />

            <MobileInfo

                label="IP Address"

                value={item.ipAddress}

            />

            <MobileInfo

                label="Power"

                value={item.power}

            />

            <MobileInfo

                label="Voltage"

                value={item.voltage}

            />

            <MobileInfo

                label="Current"

                value={item.current}

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
