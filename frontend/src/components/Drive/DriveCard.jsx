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

    const offline =
        drives.filter(
            d => d.status === "Offline"
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
            title: "Offline",
            value: offline,
            color: "bg-gray-500",
            icon: Power
        },

    ];

    return (

        <div
            className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-6
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
                                p-5
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
                                        text-sm
                                        text-gray-500
                                    "
                                >

                                    {card.title}

                                </p>

                                <h2
                                    className="
                                        text-3xl
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
                                    w-14
                                    h-14
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
