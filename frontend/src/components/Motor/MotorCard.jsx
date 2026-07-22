import {
    Cpu,
    Factory,
    Settings,
    CheckCircle2,
    Wrench,
    Cog,
    Droplets,
    Fan,
    Shield,
    MoveVertical
} from "lucide-react";

const cardConfig = {

    total: {
        title: "Tổng động cơ",
        icon: Cpu,
        color: "from-blue-500 to-blue-700"
    },

    abb: {
        title: "ABB",
        icon: Factory,
        color: "from-red-500 to-red-700"
    },

    siemens: {
        title: "Siemens",
        icon: Factory,
        color: "from-cyan-500 to-cyan-700"
    },

    otherBrand: {
        title: "Khác",
        icon: Factory,
        color: "from-slate-500 to-slate-700"
    },

    replaced: {
        title: "Đã thay",
        icon: CheckCircle2,
        color: "from-green-500 to-green-700"
    },

    original: {
        title: "Chưa thay",
        icon: Settings,
        color: "from-orange-500 to-orange-700"
    },

    running: {
        title: "Đang hoạt động",
        icon: CheckCircle2,
        color: "from-emerald-500 to-emerald-700"
    },

    maintenance: {
        title: "Bảo trì",
        icon: Wrench,
        color: "from-yellow-500 to-yellow-700"
    },

    mainMotor: {
        title: "Động cơ chính",
        icon: Cog,
        color: "from-indigo-500 to-indigo-700"
    },

    oilPump: {
        title: "Động cơ bơm dầu",
        icon: Droplets,
        color: "from-sky-500 to-sky-700"
    },

    cooling: {
        title: "Động cơ làm mát",
        icon: Fan,
        color: "from-teal-500 to-teal-700"
    },

    brake: {
        title: "Động cơ phanh",
        icon: Shield,
        color: "from-rose-500 to-rose-700"
    },

    lifting: {
        title: "Động cơ nâng hạ",
        icon: MoveVertical,
        color: "from-purple-500 to-purple-700"
    },

    otherMotor: {
        title: "Động cơ khác",
        icon: Cog,
        color: "from-gray-500 to-gray-700"
    }

};

function Card({

    item,

    active,

    onClick

}) {

    const cfg =
        cardConfig[item.key];

    if (!cfg) return null;

    const Icon =
        cfg.icon;

    return (

        <button

            onClick={() => onClick(item.key)}

            className={`
                relative
                overflow-hidden
                rounded-2xl
                p-4
                text-left
                transition-all
                duration-300
                shadow-md
                hover:shadow-xl
                hover:-translate-y-1
                bg-gradient-to-br
                ${cfg.color}
                text-white
                ${active
                    ? "ring-4 ring-blue-300 scale-[1.02]"
                    : ""
                }
            `}
        >

            <div
                className="
                    absolute
                    -right-4
                    -top-4
                    w-20
                    h-20
                    rounded-full
                    bg-white/10
                "
            />

            <div
                className="
                    flex
                    justify-between
                    items-start
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            opacity-90
                        "
                    >
                        {cfg.title}
                    </p>

                    <h2
                        className="
                            mt-3
                            text-3xl
                            font-bold
                        "
                    >
                        {item.value}
                    </h2>

                    <p
                        className="
                            text-xs
                            opacity-80
                            mt-1
                        "
                    >
                        thiết bị
                    </p>

                </div>

                <div
                    className="
                        w-12
                        h-12
                        rounded-xl
                        bg-white/20
                        flex
                        items-center
                        justify-center
                    "
                >

                    <Icon size={26} />

                </div>

            </div>

        </button>

    );

}

export default function MotorCard({

    statistics,

    active,

    onSelect

}) {

    const rows = [

        [
            {
                key: "total",
                value: statistics.total
            },
            {
                key: "abb",
                value: statistics.abb
            },
            {
                key: "siemens",
                value: statistics.siemens
            },
            {
                key: "otherBrand",
                value: statistics.otherBrand
            }
        ],

        [
            {
                key: "replaced",
                value: statistics.replaced
            },
            {
                key: "original",
                value: statistics.original
            },
            {
                key: "running",
                value: statistics.running
            },
            {
                key: "maintenance",
                value: statistics.maintenance
            }
        ],

        [
            {
                key: "mainMotor",
                value: statistics.mainMotor
            },
            {
                key: "oilPump",
                value: statistics.oilPump
            },
            {
                key: "cooling",
                value: statistics.cooling
            },
            {
                key: "brake",
                value: statistics.brake
            },
            {
                key: "lifting",
                value: statistics.lifting
            },
            {
                key: "otherMotor",
                value: statistics.otherMotor
            }
        ]

    ];

    return (

        <div className="space-y-5">

            {rows.map((row, index) => (

                <div

                    key={index}

                    className={`
                        grid
                        gap-5

                        ${row.length === 4
                            ? "grid-cols-2 lg:grid-cols-4"
                            : "grid-cols-2 md:grid-cols-3 xl:grid-cols-6"
                        }
                    `}
                >

                    {row.map(item => (

                        <Card

                            key={item.key}

                            item={item}

                            active={
                                active === item.key
                            }

                            onClick={onSelect}

                        />

                    ))}

                </div>

            ))}

        </div>

    );

}
