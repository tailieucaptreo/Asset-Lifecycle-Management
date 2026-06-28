import { X } from "lucide-react";
import Sidebar from "./Sidebar";

export default function MobileDrawer({

    open,
    setOpen

}) {

    if (!open) return null;

    return (

        <>

            {/* Overlay */}

            <div

                className="
                fixed
                inset-0
                bg-black/40
                z-40
                "

                onClick={() => setOpen(false)}

            />

            {/* Drawer */}

            <div

                className="
                fixed
                top-0
                left-0
                h-full
                w-72
                bg-slate-900
                z-50
                shadow-2xl
                duration-300
                "

            >

                <div className="flex justify-end p-3">

                    <button

                        onClick={() => setOpen(false)}

                        className="text-white"

                    >

                        <X size={28} />

                    </button>

                </div>

                <Sidebar mobile setOpen={setOpen} />

            </div>

        </>

    );

}
