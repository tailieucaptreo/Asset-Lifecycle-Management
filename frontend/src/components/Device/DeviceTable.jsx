import { useNavigate } from "react-router-dom";

import DeviceRow from "./DeviceRow";
import DeviceHeader from "./DeviceHeader";
import DeviceCard from "./DeviceCard";

export default function DeviceTable({

    data = [],

    loading = false,

    onEdit,

    onDelete,

    selectedStation = "",

    selectedStatus = "",

    searchKeyword = ""

}) {

    const nav =
        useNavigate();

    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow
                    p-10
                    text-center
                    text-slate-500
                "
            >

                Đang tải dữ liệu...

            </div>

        );

    }

    // =========================
    // EMPTY
    // =========================

    if (!data.length) {

        return (

            <div
                className="
                    bg-white
                    rounded-xl
                    shadow
                    p-10
                    text-center
                    text-slate-500
                "
            >

                Không có thiết bị.

            </div>

        );

    }

    return (

        <>

            {/* ================= MOBILE ================= */}

            <div className="lg:hidden space-y-4">

                {

                    data.map(device => (

                        <DeviceCard

                            key={device.id}

                            device={device}

                            role={
                                localStorage.getItem(
                                    "role"
                                )
                            }

                            onView={() => {

                                const params = new URLSearchParams();

                                if (selectedStation) {
                                    params.set("station", selectedStation);
                                }

                                if (selectedStatus) {
                                    params.set("status", selectedStatus);
                                }

                                if (searchKeyword) {
                                    params.set("search", searchKeyword);
                                }

                                const query = params.toString();

                                nav(
                                    `/devices/${device.id}${query ? `?${query}` : ""}`
                                );

                            }}

                            onEdit={() =>

                                onEdit?.(

                                    device

                                )

                            }

                            onDelete={() =>

                                onDelete?.(

                                    device

                                )

                            }

                        />

                    ))

                }

            </div>
            {/* ================= DESKTOP ================= */}

            <div
                className="
                    hidden
                    lg:block
                    bg-white
                    rounded-xl
                    shadow
                    overflow-hidden
                "
            >

                <div className="overflow-x-auto">

                    <table
                        className="
                            min-w-full
                            text-sm
                            border
                            border-slate-200
                        "
                    >

                        <thead
                            className="
                                sticky
                                top-0
                                z-20
                                bg-slate-100
                            "
                        >

                            <DeviceHeader />

                        </thead>

                        <tbody className="divide-y">

                            {

                                data.map(device => (

                                    <DeviceRow

                                        key={device.id}

                                        device={device}

                                        role={
                                            localStorage.getItem(
                                                "role"
                                            )
                                        }

                                        onView={() => {

                                            const params = new URLSearchParams();

                                            if (selectedStation) {
                                                params.set("station", selectedStation);
                                            }

                                            if (selectedStatus) {
                                                params.set("status", selectedStatus);
                                            }

                                            if (searchKeyword) {
                                                params.set("search", searchKeyword);
                                            }

                                            const query = params.toString();

                                            nav(
                                                `/devices/${device.id}${query ? `?${query}` : ""}`
                                            );

                                        }}

                                        onEdit={() =>

                                            onEdit?.(

                                                device

                                            )

                                        }

                                        onDelete={() =>

                                            onDelete?.(

                                                device

                                            )

                                        }

                                    />

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </>

    );

}