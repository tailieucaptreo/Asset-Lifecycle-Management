import MobileCard from "./MobileCard";
import MobileInfo from "./MobileInfo";
import MobileStatus from "./MobileStatus";
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

            subtitle={item.serialNumber}

            status={

                <MobileStatus

                    status={item.status || "Running"}

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

                label="Record Date"

                value={
                    item.recordDate
                        ? new Date(item.recordDate)
                              .toLocaleDateString("vi-VN")
                        : "-"
                }

            />

            <MobileInfo

                label="Station"

                value={item.station}

            />

            <MobileInfo

                label="Tandem"

                value={item.tandem}

            />

            <MobileInfo

                label="Application"

                value={item.application}

            />

            <MobileInfo

                label="Operation Hours"

                value={item.operationHours}

            />

            <MobileInfo

                label="Power Unit Date"

                value={item.powerUnitDate}

            />

            {

                item.faultHistory &&

                <MobileInfo

                    label="Fault History"

                    value={item.faultHistory}

                />

            }

            {

                item.description &&

                <MobileInfo

                    label="Description"

                    value={item.description}

                />

            }

            {

                item.possibleCause &&

                <MobileInfo

                    label="Possible Cause"

                    value={item.possibleCause}

                />

            }

            {

                item.correctiveActions &&

                <MobileInfo

                    label="Corrective Actions"

                    value={item.correctiveActions}

                />

            }

            {

                item.note &&

                <MobileInfo

                    label="Note"

                    value={item.note}

                />

            }

        </MobileCard>

    );

}
