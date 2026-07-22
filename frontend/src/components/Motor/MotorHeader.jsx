import { Cog, Activity } from "lucide-react";

export default function MotorHeader() {

    return (

        <div
            className="
                relative
                overflow-hidden
                bg-white
                rounded-3xl
                border
                border-slate-200
                shadow-sm
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
                    bg-blue-50
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
                    bg-blue-50
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
                            bg-blue-50
                            flex
                            items-center
                            justify-center
                        "
                    >

                        <Cog
                            size={34}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h1
                            className="
                                text-3xl
                                md:text-4xl
                                font-bold
                                text-slate-900
                            "
                        >
                            Quản lý động cơ
                        </h1>

                        <p
                            className="
                                mt-2
                                text-slate-500
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
                            gap-3
                            rounded-2xl
                            border
                            border-slate-200
                            bg-slate-50
                            px-5
                            py-3
                        "
                    >

                        <Activity
                            size={20}
                            className="text-blue-600"
                        />

                        <div>

                            <div
                                className="
                                    text-xs
                                    uppercase
                                    tracking-wider
                                    text-slate-500
                                "
                            >
                                Module
                            </div>

                            <div className="font-semibold text-slate-800">
                                Motor Management
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
