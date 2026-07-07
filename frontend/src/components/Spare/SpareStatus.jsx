export default function SpareStatus({ status }) {

    const styles = {

        "Thiết bị mới":
            "bg-green-100 text-green-700",

        "Đã sử dụng":
            "bg-yellow-100 text-yellow-700",

        "Hỏng":
            "bg-red-100 text-red-700",

        "Thanh lý":
            "bg-gray-200 text-gray-700"

    };

    return (

        <span
            className={`
                inline-flex
                items-center
                justify-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                whitespace-nowrap
                ${styles[status] || "bg-slate-100 text-slate-700"}
            `}
        >

            {status || "Không rõ"}

        </span>

    );

}
