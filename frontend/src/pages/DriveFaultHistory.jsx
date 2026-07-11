import { useState } from "react";

export default function DriveFaultHistory() {

    const [tab, setTab] = useState("VACON");

    return (

        <div className="max-w-[1600px] mx-auto px-8 py-6">

            <h1 className="text-3xl font-bold mb-6">
                Lịch sử lỗi biến tần
            </h1>

            <div className="flex gap-3 mb-6">

                <button
                    onClick={() => setTab("VACON")}
                    className={`px-6 py-2 rounded-xl ${
                        tab === "VACON"
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                    }`}
                >
                    VACON
                </button>

                <button
                    onClick={() => setTab("ABB")}
                    className={`px-6 py-2 rounded-xl ${
                        tab === "ABB"
                            ? "bg-blue-600 text-white"
                            : "bg-white border"
                    }`}
                >
                    ABB
                </button>

            </div>

            {tab === "VACON" ? (

                <div>
                    {/* Sau này render VaconTable */}
                    <p>Danh sách lịch sử lỗi VACON</p>
                </div>

            ) : (

                <div>
                    {/* Sau này render AbbTable */}
                    <p>Danh sách lịch sử lỗi ABB</p>
                </div>

            )}

        </div>

    );

}
