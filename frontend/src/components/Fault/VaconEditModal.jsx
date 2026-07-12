import {

    useEffect,
    useState

} from "react";

import {

    X,
    Save

} from "lucide-react";

export default function VaconEditModal({

    open,

    data,

    onClose,

    onSave

}) {

    const [form, setForm] =
        useState({});

    useEffect(() => {

        if (data) {

            setForm({

                ...data,

                recordDate:

                    data.recordDate

                        ? data.recordDate.slice(0,10)

                        : ""

            });

        }

    }, [data]);

    if (!open) return null;

    const change = (e) => {

        const {

            name,

            value

        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value

        }));

    };

    const Input = ({

        label,

        name,

        type="text"

    }) => (

        <div>

            <label
                className="
                    block
                    text-sm
                    font-medium
                    mb-1
                "
            >

                {label}

            </label>

            <input

                type={type}

                name={name}

                value={form[name] || ""}

                onChange={change}

                className="
                    w-full
                    border
                    rounded-xl
                    px-3
                    py-2
                "

            />

        </div>

    );

    return (

        <div
            className="
                fixed
                inset-0
                bg-black/40
                z-50
                flex
                items-center
                justify-center
            "
        >

            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    w-[1050px]
                    max-w-[95vw]
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

                    <h2
                        className="
                            text-2xl
                            font-bold
                        "
                    >

                        Chỉnh sửa lịch sử lỗi VACON

                    </h2>

                    <button

                        onClick={onClose}

                        className="
                            p-2
                            rounded-lg
                            hover:bg-gray-100
                        "

                    >

                        <X size={22}/>

                    </button>

                </div>

                {/* Body */}

                <div
                    className="
                        flex-1
                        overflow-y-auto
                        p-6
                    "
                >

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-5
                        "
                    >

                        <Input

                            label="Record Date"

                            name="recordDate"

                            type="date"

                        />

                        <Input

                            label="Station"

                            name="station"

                        />

                        <Input

                            label="Tandem"

                            name="tandem"

                        />

                        <Input

                            label="Device Name"

                            name="deviceName"

                        />

                        <Input

                            label="Serial Number"

                            name="serialNumber"

                        />

                        <Input

                            label="Application"

                            name="application"

                        />

                        <Input

                            label="Power Unit Date"

                            name="powerUnitDate"

                        />

                        <Input

                            label="Operation Hours"

                            name="operationHours"

                        />

                    </div>

                    <div className="mt-5">

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                mb-2
                            "
                        >

                            Fault History

                        </label>

                        <textarea

                            rows={5}

                            name="faultHistory"

                            value={form.faultHistory || ""}

                            onChange={change}

                            className="
                                w-full
                                border
                                rounded-xl
                                p-3
                            "

                        />

                    </div>
                                      {/* Description */}

                    <div className="mt-5">

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                mb-2
                            "
                        >

                            Description

                        </label>

                        <textarea

                            rows={4}

                            name="description"

                            value={form.description || ""}

                            onChange={change}

                            className="
                                w-full
                                border
                                rounded-xl
                                p-3
                            "

                        />

                    </div>

                    {/* Possible Cause */}

                    <div className="mt-5">

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                mb-2
                            "
                        >

                            Possible Cause

                        </label>

                        <textarea

                            rows={4}

                            name="possibleCause"

                            value={form.possibleCause || ""}

                            onChange={change}

                            className="
                                w-full
                                border
                                rounded-xl
                                p-3
                            "

                        />

                    </div>

                    {/* Corrective Actions */}

                    <div className="mt-5">

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                mb-2
                            "
                        >

                            Corrective Actions

                        </label>

                        <textarea

                            rows={5}

                            name="correctiveActions"

                            value={form.correctiveActions || ""}

                            onChange={change}

                            className="
                                w-full
                                border
                                rounded-xl
                                p-3
                            "

                        />

                    </div>

                    {/* Note */}

                    <div className="mt-5">

                        <label
                            className="
                                block
                                text-sm
                                font-medium
                                mb-2
                            "
                        >

                            Note

                        </label>

                        <textarea

                            rows={4}

                            name="note"

                            value={form.note || ""}

                            onChange={change}

                            className="
                                w-full
                                border
                                rounded-xl
                                p-3
                            "

                        />

                    </div>

                </div>

                {/* Footer */}

                <div
                    className="
                        border-t
                        px-6
                        py-4
                        flex
                        justify-end
                        gap-3
                    "
                >

                    <button

                        onClick={onClose}

                        className="
                            px-5
                            py-2
                            rounded-xl
                            border
                            hover:bg-gray-50
                        "

                    >

                        Hủy

                    </button>

                    <button

                        onClick={() => onSave(form)}

                        className="
                            px-5
                            py-2
                            rounded-xl
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            flex
                            items-center
                            gap-2
                        "

                    >

                        <Save size={18}/>

                        Lưu thay đổi

                    </button>

                </div>

            </div>

        </div>

    );

}
