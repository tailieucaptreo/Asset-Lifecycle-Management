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
    setModel,

    filters

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

                    {filters.brands.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                {/* Line */}

                <select

                    value={line}

                    onChange={(e) =>
                        setLine(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">
                        Tất cả tuyến
                    </option>

                    {filters.lines.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                {/* Station */}

                <select

                    value={station}

                    onChange={(e) =>
                        setStation(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">
                        Tất cả nhà ga
                    </option>

                    {filters.stations.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

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

                    <option value="Spare">
                        Dự phòng
                    </option>

                </select>

                {/* Model */}

                <select

                    value={model}

                    onChange={(e) =>
                        setModel(e.target.value)
                    }

                    className="
                        border
                        rounded-xl
                        px-3
                        py-2.5
                    "

                >

                    <option value="All">
                        Tất cả model
                    </option>

                    {filters.models.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

            </div>

        </div>

    );

}
