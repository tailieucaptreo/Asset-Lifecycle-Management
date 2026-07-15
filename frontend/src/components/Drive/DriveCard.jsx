import {
    Cpu,
    CheckCircle,
    Wrench,
    AlertTriangle,
    Power,
    Building2
} from "lucide-react";

export default function DriveCard({

    drives = []

}) {

    const total = drives.length;

    const running =
        drives.filter(
            d => d.status === "Running"
        ).length;

    const maintenance =
        drives.filter(
            d => d.status === "Maintenance"
        ).length;

    const fault =
        drives.filter(
            d => d.status === "Fault"
        ).length;

    const standby =
        drives.filter(
            d => d.status === "Offline" || d.status === "Standby"
        ).length;

    const cards = [

        {
            title: "Đang chạy",
            value: running,
            color: "bg-green-500",
            icon: CheckCircle
        },

        {
            title: "Bảo trì",
            value: maintenance,
            color: "bg-yellow-500",
            icon: Wrench
        },

        {
            title: "Lỗi",
            value: fault,
            color: "bg-red-500",
            icon: AlertTriangle
        },

        {
            title: "Dự phòng",
            value: standby,
            color: "bg-blue-500",
            icon: Power
        },

    ];

    return (

        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-4
                mb-6
            "
        >

            {

                cards.map((card) => {

                    const Icon = card.icon;

                    return (

                        <div

                            key={card.title}

                            className="
                                bg-white
                                rounded-2xl
                                shadow
                                p-6
                                flex
                                items-center
                                justify-between
                                hover:shadow-lg
                                transition
                            "

                        >

                            <div>

                                <p
                                    className="
                                        text-base
                                        text-gray-500
                                    "
                                >

                                    {card.title}

                                </p>

                                <h2
                                    className="
                                        text-2xl
                                        font-bold
                                        mt-2
                                    "
                                >

                                    {card.value}

                                </h2>

                            </div>

                            <div

                                className={`
                                    ${card.color}
                                    w-12
                                    h-12
                                    rounded-2xl
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                `}

                            >

                                <Icon size={28} />

                            </div>

                        </div>

                    );

                })

            }

        </div>

    );

}
