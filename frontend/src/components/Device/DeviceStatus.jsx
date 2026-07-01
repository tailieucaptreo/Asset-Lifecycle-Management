export default function DeviceStatus({ status }) {

    let color = "bg-gray-500";

    if (status === "Active")
        color = "bg-green-500";

    if (status === "Maintenance")
        color = "bg-yellow-500";

    if (status === "Expired")
        color = "bg-red-500";

    return (

        <span
            className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                text-white
                ${color}
            `}
        >
            {status}
        </span>

    );

}