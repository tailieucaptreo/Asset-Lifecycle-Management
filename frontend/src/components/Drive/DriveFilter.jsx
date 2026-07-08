export default function DriveFilter({

    brand,
    setBrand,

    line,
    setLine,

    station,
    setStation,

    status,
    setStatus,

    model,
    setModel

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-4
                mb-6
            "
        >

            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-5
                    gap-3
                "
            >

                {/* Brand */}

                <select

                    value={brand}

                    onChange={(e) =>
                        setBrand(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">

                        Tất cả hãng

                    </option>

                    <option value="ABB">

                        ABB

                    </option>

                    <option value="VACON">

                        VACON

                    </option>

                </select>

                {/* Line */}

                <input

                    value={line}

                    onChange={(e) =>
                        setLine(e.target.value)
                    }

                    placeholder="Tuyến"

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                />

                {/* Station */}

                <input

                    value={station}

                    onChange={(e) =>
                        setStation(e.target.value)
                    }

                    placeholder="Nhà ga"

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                />

                {/* Status */}

                <select

                    value={status}

                    onChange={(e) =>
                        setStatus(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">

                        Tất cả trạng thái

                    </option>

                    <option value="Running">

                        Running

                    </option>

                    <option value="Maintenance">

                        Maintenance

                    </option>

                    <option value="Fault">

                        Fault

                    </option>

                    <option value="Offline">

                        Offline

                    </option>

                </select>

                {/* Model */}

                <input

                    value={model}

                    onChange={(e) =>
                        setModel(e.target.value)
                    }

                    placeholder="Model"

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                />

            </div>

        </div>

    );

}
