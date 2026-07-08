import {
    Cpu,
    Activity,
    AlertTriangle,
    Wrench
} from "lucide-react";

export default function DriveHeader({

    total = 0,

    abb = 0,

    vacon = 0,

    fault = 0

}) {

    return (

        <div className="mb-6">

            <h1
                className="
                    text-3xl
                    font-bold
                    text-gray-800
                "
            >

                Quản lý Biến tần

            </h1>

            <p
                className="
                    text-gray-500
                    mt-2
                "
            >

                Quản lý ABB, Vacon và lịch sử vận hành

            </p>

            <div
                className="
                    grid
                    grid-cols-2
                    lg:grid-cols-4
                    gap-4
                    mt-6
                "
            >

                {/* Tổng */}

                <Card

                    title="Tổng"

                    value={total}

                    color="bg-blue-500"

                    icon={<Cpu size={22} />}

                />

                {/* ABB */}

                <Card

                    title="ABB"

                    value={abb}

                    color="bg-green-500"

                    icon={<Activity size={22} />}

                />

                {/* VACON */}

                <Card

                    title="VACON"

                    value={vacon}

                    color="bg-purple-500"

                    icon={<Wrench size={22} />}

                />

                {/* Fault */}

                <Card

                    title="Đang lỗi"

                    value={fault}

                    color="bg-red-500"

                    icon={<AlertTriangle size={22} />}

                />

            </div>

        </div>

    );

}

function Card({

    title,

    value,

    color,

    icon

}) {

    return (

        <div
            className="
                bg-white
                rounded-2xl
                shadow
                p-5
                flex
                items-center
                justify-between
                border
            "
        >

            <div>

                <p
                    className="
                        text-gray-500
                        text-sm
                    "
                >

                    {title}

                </p>

                <h2
                    className="
                        text-3xl
                        font-bold
                        mt-1
                    "
                >

                    {value}

                </h2>

            </div>

            <div
                className={`
                    w-14
                    h-14
                    rounded-2xl
                    text-white
                    flex
                    items-center
                    justify-center
                    ${color}
                `}
            >

                {icon}

            </div>

        </div>

    );

}
