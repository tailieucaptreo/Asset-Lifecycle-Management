import {

    X,

    Calendar,

    Cpu,

    FileText,

    Clock

} from "lucide-react";

export default function VaconDetailModal({

    open,

    data,

    onClose

}) {

    if (!open || !data) return null;

    const Item = ({ icon, label, value }) => (

        <div
            className="
                border
                rounded-xl
                p-4
                bg-slate-50
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-2
                    text-gray-500
                    text-sm
                    mb-2
                "
            >

                {icon}

                <span>

                    {label}

                </span>

            </div>

            <div
                className="
                    font-medium
                    whitespace-pre-wrap
                    break-words
                "
            >

                {value || "-"}

            </div>

        </div>

    );

    const Block = ({ title, value }) => (

        <div
            className="
                border
                rounded-xl
                p-5
                bg-white
                shadow-sm
            "
        >

            <h3
                className="
                    font-semibold
                    text-lg
                    mb-3
                "
            >

                {title}

            </h3>

            <pre
                className="
                    whitespace-pre-wrap
                    break-words
                    text-sm
                    text-gray-700
                    font-sans
                "
            >

                {value || "-"}

            </pre>

        </div>

    );

    return (

        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/40
                flex
                items-center
                justify-center
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    w-[1100px]
                    max-w-[96vw]
                    max-h-[92vh]
                    overflow-hidden
                    flex
                    flex-col
                "
            >

                {/* Header */}

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        border-b
                        px-6
                        py-4
                    "
                >

                    <div>

                        <h2
                            className="
                                text-2xl
                                font-bold
                            "
                        >

                            Chi tiết lịch sử lỗi VACON

                        </h2>

                        <p
                            className="
                                text-gray-500
                                mt-1
                            "
                        >

                            {data.deviceName}

                        </p>

                    </div>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                        "

                    >

                        <X size={22} />

                    </button>

                </div>

                {/* Body */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        p-6
                        space-y-6
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-4
                        "
                    >

                        <Item

                            icon={<Calendar size={16}/>}

                            label="Record Date"

                            value={
                                data.recordDate

                                    ? new Date(
                                        data.recordDate
                                      ).toLocaleDateString("vi-VN")

                                    : "-"
                            }

                        />

                        <Item

                            icon={<Cpu size={16}/>}

                            label="Station"

                            value={data.station}

                        />

                        <Item

                            icon={<Cpu size={16}/>}

                            label="Tandem"

                            value={data.tandem}

                        />

                        <Item

                            icon={<Cpu size={16}/>}

                            label="Device Name"

                            value={data.deviceName}

                        />

                        <Item

                            icon={<Cpu size={16}/>}

                            label="Serial Number"

                            value={data.serialNumber}

                        />

                        <Item

                            icon={<Clock size={16}/>}

                            label="Operation Hours"

                            value={data.operationHours}

                        />

                        <Item

                            icon={<Cpu size={16}/>}

                            label="Application"

                            value={data.application}

                        />

                        <Item

                            icon={<Calendar size={16}/>}

                            label="Power Unit Date"

                            value={data.powerUnitDate}

                        />

                    </div>
                                      {/* Fault History */}

                    <Block

                        title="Fault History"

                        value={data.faultHistory}

                    />

                    {/* Description */}

                    <Block

                        title="Description"

                        value={data.description}

                    />

                    {/* Possible Cause */}

                    <Block

                        title="Possible Cause"

                        value={data.possibleCause}

                    />

                    {/* Corrective Actions */}

                    <Block

                        title="Corrective Actions"

                        value={data.correctiveActions}

                    />

                    {/* Note */}

                    <Block

                        title="Note"

                        value={data.note}

                    />

                </div>

                {/* Footer */}

                <div

                    className="
                        border-t
                        px-6
                        py-4
                        flex
                        justify-end
                    "

                >

                    <button

                        onClick={onClose}

                        className="
                            px-6
                            py-2.5
                            rounded-xl
                            bg-blue-600
                            text-white
                            hover:bg-blue-700
                            transition
                        "

                    >

                        Đóng

                    </button>

                </div>

            </div>

        </div>

    );

}
