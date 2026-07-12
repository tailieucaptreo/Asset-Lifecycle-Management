export default function MobileCard({

    title,

    subtitle,

    status,

    statusColor = "bg-gray-100 text-gray-700",

    children,

    actions

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                border
                border-slate-200
                overflow-hidden
            "
        >

            {/* Header */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    px-4
                    py-4
                    border-b
                "
            >

                <div>

                    {

                        title &&

                        <h3
                            className="
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >

                            {title}

                        </h3>

                    }

                    {

                        subtitle &&

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >

                            {subtitle}

                        </p>

                    }

                </div>

                {

                    status &&

                    <span
                        className={`
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-semibold
                            whitespace-nowrap
                            ${statusColor}
                        `}
                    >

                        {status}

                    </span>

                }

            </div>

            {/* Body */}

            <div
                className="
                    p-4
                    space-y-3
                "
            >

                {children}

            </div>

            {/* Footer */}

            {

                actions &&

                <div
                    className="
                        border-t
                        px-4
                        py-3
                        flex
                        justify-end
                    "
                >

                    {actions}

                </div>

            }

        </div>

    );

}
