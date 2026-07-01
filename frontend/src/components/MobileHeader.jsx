import { Menu } from "lucide-react";

export default function MobileHeader({

    setOpen

}) {

    return (

        <div

            className="
            md:hidden
            sticky
            top-0
            bg-white
            shadow
            z-30
            px-4
            py-3
            flex
            items-center
            gap-4
            "

        >

            <button

                onClick={() => setOpen(true)}

            >

                <Menu size={28} />

            </button>

            <h1

                className="
                font-bold
                text-xl
                "

            >

                Asset Manager

            </h1>

        </div>

    );

}
