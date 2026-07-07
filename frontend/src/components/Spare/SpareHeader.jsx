export default function SpareHeader({

    role

}) {

    return (

        <div>

            <h1
                className="
                    text-4xl
                    font-bold
                    flex
                    items-center
                    gap-3
                "
            >

                🔋 Thiết bị dự phòng

            </h1>

            <div
                className="
                    mt-2
                    flex
                    items-center
                    gap-2
                "
            >

                <span className="text-gray-500">

                    Quyền hiện tại:

                </span>

                <span
                    className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-bold

                        ${
                            role==="admin"

                            ?

                            "bg-green-100 text-green-700"

                            :

                            "bg-blue-100 text-blue-700"

                        }
                    `}
                >

                    {

                        role==="admin"

                        ?

                        "ADMIN"

                        :

                        "USER"

                    }

                </span>

            </div>

        </div>

    );

}
