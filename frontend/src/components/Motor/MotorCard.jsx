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
    },

    abb: {
        title: "ABB",
        icon: Factory,
    },

    siemens: {
        title: "Siemens",
        icon: Factory,
    },

    otherBrand: {
        title: "Khác",
        icon: Factory,
    },

    replaced: {
        title: "Đã thay",
        icon: CheckCircle2,
    },

    original: {
        title: "Chưa thay",
        icon: Settings,
    },

    running: {
        title: "Đang hoạt động",
        icon: CheckCircle2,
    },

    maintenance: {
        title: "Bảo trì",
        icon: Wrench,
    },

    mainMotor: {
        title: "Động cơ chính",
        icon: Cog,
    },

    oilPump: {
        title: "Động cơ bơm dầu",
        icon: Droplets,
    },

    cooling: {
        title: "Động cơ làm mát",
        icon: Fan,
    },

    brake: {
        title: "Động cơ phanh",
        icon: Shield,
    },

    lifting: {
        title: "Động cơ nâng hạ",
        icon: MoveVertical,
    },

    otherMotor: {
        title: "Động cơ khác",
        icon: Cog,
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
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition-all
                duration-200
                hover:shadow-lg
                hover:-translate-y-1
                ${active
                    ? "ring-2 ring-blue-500 border-blue-500"
                    : ""
                }
            `}
        >

            <div className="flex justify-between items-center">

                <div>
            
                    <p className="text-sm text-slate-500">
                        {cfg.title}
                    </p>
            
                    <h2 className="mt-2 text-4xl font-bold text-slate-900">
                        {item.value}
                    </h2>
            
                </div>
            
                <div
                    className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-blue-50
                        flex
                        items-center
                        justify-center
                    "
                >
                    <Icon
                        size={28}
                        className="text-blue-600"
                    />
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
