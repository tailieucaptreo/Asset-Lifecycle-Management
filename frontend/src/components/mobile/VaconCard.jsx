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

    const shortText = (text, max = 80) => {

        if (!text) return "-";

        return text.length > max

            ? text.substring(0, max) + "..."

            : text;

    };

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

                value={item.station || "-"}

            />

            <MobileInfo

                label="Tandem"

                value={item.tandem || "-"}

            />

            <MobileInfo

                label="Application"

                value={shortText(item.application)}

            />

            <MobileInfo

                label="Operation Hours"

                value={item.operationHours || "-"}

            />

            <MobileInfo

                label="Power Unit Date"

                value={item.powerUnitDate || "-"}

            />

            {

                item.faultHistory &&

                <MobileInfo

                    label="Fault History"

                    value={shortText(item.faultHistory)}

                />

            }

            {

                item.description &&

                <MobileInfo

                    label="Description"

                    value={shortText(item.description)}

                />

            }

            {

                item.possibleCause &&

                <MobileInfo

                    label="Possible Cause"

                    value={shortText(item.possibleCause)}

                />

            }

            {

                item.correctiveActions &&

                <MobileInfo

                    label="Corrective Actions"

                    value={shortText(item.correctiveActions)}

                />

            }

            {

                item.note &&

                <MobileInfo

                    label="Note"

                    value={shortText(item.note)}

                />

            }

        </MobileCard>

    );

}