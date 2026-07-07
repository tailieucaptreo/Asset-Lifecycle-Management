export default function SpareHeader({

    total

}) {

    return (

        <div className="mb-6">

            <h1 className="text-3xl font-bold">

                🔋 Thiết bị dự phòng

            </h1>

            <p className="text-gray-500 mt-2">

                Quản lý kho thiết bị dự phòng

            </p>

            <div className="mt-3">

                <span
                    className="
                        bg-blue-100
                        text-blue-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-semibold
                    "
                >

                    Tổng: {total} thiết bị

                </span>

            </div>

        </div>

    );

}