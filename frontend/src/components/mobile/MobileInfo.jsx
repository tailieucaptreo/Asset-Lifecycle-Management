export default function MobileInfo({

    label,

    value,

    className = ""

}) {

    return (

        <div
            className={`
                flex
                justify-between
                items-start
                gap-4
                py-2
                border-b
                border-slate-100
                ${className}
            `}
        >

            <span
                className="
                    text-sm
                    text-slate-500
                    font-medium
                    shrink-0
                "
            >

                {label}

            </span>

            <span
                className="
                    text-sm
                    text-slate-800
                    font-semibold
                    text-right
                    break-all
                "
            >

                {

                    value !== undefined &&
                    value !== null &&
                    value !== ""

                        ? value

                        : "-"

                }

            </span>

        </div>

    );

}
