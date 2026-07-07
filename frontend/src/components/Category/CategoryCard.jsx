import { ChevronRight } from "lucide-react";

export default function CategoryCard({

    title,

    total,

    icon,

    color,

    onClick

}){

    return(

        <div

            onClick={onClick}

            className="
                cursor-pointer
                bg-white
                rounded-3xl
                shadow
                p-6
                hover:shadow-xl
                hover:-translate-y-1
                transition
            "

        >

            <div className="flex justify-between">

                <div>

                    <div
                        className={`
                            w-14
                            h-14
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            text-white
                            ${color}
                        `}
                    >

                        {icon}

                    </div>

                    <h2 className="mt-5 text-xl font-bold">

                        {title}

                    </h2>

                    <p className="text-gray-500 mt-2">

                        {total} thiết bị

                    </p>

                </div>

                <ChevronRight/>

            </div>

        </div>

    );

}