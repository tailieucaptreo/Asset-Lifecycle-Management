import { Cog, Activity } from "lucide-react";

export default function MotorHeader() {

    return (

        <div
            className="
                bg-gradient-to-r
                from-indigo-600
                via-blue-600
                to-cyan-600
                rounded-3xl
                shadow-xl
                overflow-hidden
                relative
            "
        >

            {/* Background Decoration */}

            <div
                className="
                    absolute
                    -right-10
                    -top-10
                    w-40
                    h-40
                    rounded-full
                    bg-white/10
                "
            />

            <div
                className="
                    absolute
                    right-24
                    bottom-[-30px]
                    w-24
                    h-24
                    rounded-full
                    bg-white/10
                "
            />

            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-6
                    px-6
                    py-7
                "
            >

                {/* Left */}

                <div className="flex items-start gap-4">

                    <div
                        className="
                            w-16
                            h-16
                            rounded-2xl
                            bg-white/20
                            backdrop-blur
                            flex
                            items-center
                            justify-center
                            shadow-lg
                        "
                    >

                        <Cog
                            size={34}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1
                            className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                text-white
                            "
                        >
                            Quản lý động cơ
                        </h1>

                        <p
                            className="
                                mt-2
                                text-blue-100
                                max-w-3xl
                                leading-relaxed
                            "
                        >
                            Quản lý danh mục động cơ điện, theo dõi vị trí lắp đặt,
                            tình trạng hoạt động, lịch sử thay thế và bảo trì của
                            toàn bộ hệ thống cáp treo.
                        </p>

                    </div>

                </div>

                {/* Right */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        self-start
                        lg:self-center
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-2xl
                            bg-white/15
                            backdrop-blur
                            px-4
                            py-3
                            text-white
                        "
                    >

                        <Activity size={20} />

                        <div>

                            <div
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wider
                                    text-blue-100
                                "
                            >
                                Module
                            </div>

                            <div className="font-semibold">
                                Motor Management
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
