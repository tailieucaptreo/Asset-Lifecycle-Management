export default function MobileStatus({

    status

}) {

    const getStatusStyle = (status) => {

        switch ((status || "").toLowerCase()) {

            case "running":

            case "đang chạy":

                return {
                    text: "Đang chạy",
                    className: "bg-green-100 text-green-700"
                };

            case "maintenance":

            case "bảo trì":

                return {
                    text: "Bảo trì",
                    className: "bg-yellow-100 text-yellow-700"
                };

            case "fault":

            case "lỗi":

                return {
                    text: "Lỗi",
                    className: "bg-red-100 text-red-700"
                };

            case "offline":
                
            case "spare":

            case "off":

                return {
                    text: "Dự phòng",
                    className: "bg-gray-200 text-gray-700"
                };

            default:

                return {
                    text: status || "-",
                    className: "bg-slate-100 text-slate-700"
                };

        }

    };

    const style = getStatusStyle(status);

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
                whitespace-nowrap
                ${style.className}
            `}
        >

            <span
                className="
                    w-2
                    h-2
                    rounded-full
                    bg-current
                    mr-2
                "
            />

            {style.text}

        </span>

    );

}
