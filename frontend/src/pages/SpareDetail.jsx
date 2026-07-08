import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API from "../config";

import {
    ArrowLeft,
    Package,
    Pencil,
    Trash2
} from "lucide-react";

import SpareStatus from "../components/Spare/SpareStatus";

export default function SpareDetail() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [item, setItem] = useState(null);

    useEffect(() => {

        loadData();

    }, [id]);

    const loadData = async () => {

        try {

            const token = localStorage.getItem("token");

            const res = await axios.get(

                `${API}/api/spare-devices/${id}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }

            );

            setItem(res.data);

        }

        catch (err) {

            console.log(err);

        }

    };

    if (!item) {

        return (

            <div className="p-10 text-center">

                Đang tải...

            </div>

        );

    }

    return (

        <div className="bg-gray-100 min-h-screen py-8">
            
            <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-xl p-8">

            <button

                onClick={() => navigate(-1)}

                className="flex items-center gap-2 mb-6"

            >

                <ArrowLeft size={18}/>

                Quay lại

            </button>

            <div className="bg-white rounded-3xl shadow p-6">

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Ảnh */}

                    <div
                        className="
                            border
                            rounded-3xl
                            aspect-square
                            max-h-[420px]
                            flex
                            items-center
                            justify-center
                            bg-gray-50
                        "
                    >

                        {

                            item.image

                            ?

                            <img
                                src={item.image}
                                alt=""
                                className="max-h-full object-contain"
                            />

                            :

                            <Package
                                size={80}
                                className="text-gray-300"
                            />

                        }

                    </div>

                    {/* Thông tin */}

                    <div className="lg:col-span-2">

                        <h1 className="text-4xl font-bold">

                            {item.name}

                        </h1>

                        <p className="text-gray-500 mt-2">

                            ID: {item.deviceId}

                        </p>

                        <div className="mt-4">

                            <SpareStatus
                                status={item.condition}
                            />

                        </div>

                        {/* Thông tin chung */}

                        <div className="mt-8">

                            <h2 className="text-xl font-bold mb-4">

                                Thông tin chung

                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">

                                <Info
                                    label="Tên thiết bị"
                                    value={item.name}
                                />

                                <Info
                                    label="Ký hiệu"
                                    value={item.symbol}
                                />

                                <Info
                                    label="Mã ID"
                                    value={item.deviceId}
                                />

                                <Info
                                    label="ĐVT"
                                    value={item.unit}
                                />

                            </div>

                        </div>

                        {/* Kho */}

                        <div className="mt-8">

                            <h2 className="text-xl font-bold mb-4">

                                Thông tin kho

                            </h2>

                            <div className="grid md:grid-cols-2 gap-4">

                                <Info label="Kho" value={item.warehouse}/>

                                <Info label="Tủ" value={item.cabinet}/>

                                <Info label="Kệ" value={item.shelf}/>

                                <Info label="Khay" value={item.slot}/>

                            </div>

                        </div>

                        {/* Tồn kho */}

                        <div className="mt-8">

                            <h2 className="text-xl font-bold mb-4">

                                Thông tin tồn kho

                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                <Card
                                    title="Ban đầu"
                                    value={item.initialQuantity}
                                />

                                <Card
                                    title="Nhập"
                                    value={item.importQty}
                                />

                                <Card
                                    title="Xuất"
                                    value={item.exportQty}
                                />

                                <Card
                                    title="Tồn"
                                    value={item.quantity}
                                />

                            </div>

                        </div>

                        {/* Ghi chú */}

                        <div className="mt-8">

                            <h2 className="text-xl font-bold mb-3">

                                Ghi chú

                            </h2>

                            <div className="border rounded-xl p-4 min-h-24">

                                {item.note || "Không có"}

                            </div>

                        </div>

                        {/* Footer */}

                        <div className="flex gap-3 mt-8">

                            <button
                                className="bg-blue-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                            >
                                <Pencil size={18}/>
                                Sửa
                            </button>

                            <button
                                className="bg-red-600 text-white px-5 py-3 rounded-xl flex items-center gap-2"
                            >
                                <Trash2 size={18}/>
                                Xóa
                            </button>

                            <button
                                onClick={() => navigate(-1)}
                                className="bg-gray-200 px-5 py-3 rounded-xl"
                            >
                                Quay lại
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

function Info({ label, value }) {

    return (

        <div className="border rounded-xl p-4">

            <div className="text-gray-500 text-sm">

                {label}

            </div>

            <div className="font-semibold mt-1">

                {value || "-"}

            </div>

        </div>

    );

}

function Card({ title, value }) {

    return (

        <div className="border rounded-2xl p-5 text-center">

            <div className="text-gray-500">

                {title}

            </div>

            <div className="text-3xl font-bold text-blue-600 mt-2">

                {value}

            </div>

        </div>

    );

}
