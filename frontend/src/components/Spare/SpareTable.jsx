import { Package } from "lucide-react";
import SpareRow from "./SpareRow";

export default function SpareTable({

    data = [],

    role,

    onEdit,

    onDelete

}) {

    return (

        <div className="overflow-x-auto">

            <table className="w-full text-sm">

                <thead className="bg-slate-100 sticky top-0 z-20">

                    <tr>

                        <th className="px-3 py-3">Ảnh</th>

                        <th className="px-3 py-3 text-left">
                            Tên thiết bị
                        </th>

                        <th className="px-3 py-3">
                            Mã ID
                        </th>

                        <th className="px-3 py-3">
                            Tình trạng
                        </th>

                        <th className="px-3 py-3">
                            Kho
                        </th>

                        <th className="px-3 py-3">
                            Tủ
                        </th>

                        <th className="px-3 py-3">
                            Kệ
                        </th>

                        <th className="px-3 py-3">
                            Khay
                        </th>

                        <th className="px-3 py-3">
                            Ban đầu
                        </th>

                        <th className="px-3 py-3">
                            Nhập
                        </th>

                        <th className="px-3 py-3">
                            Xuất
                        </th>

                        <th className="px-3 py-3">
                            Tồn
                        </th>

                        <th className="px-3 py-3">
                            ĐVT
                        </th>

                        <th className="px-3 py-3">
                            Thao tác
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {data.length > 0 ? (

                        data.map(item => (

                            <SpareRow

                                key={item.id}

                                item={item}

                                role={role}

                                onEdit={onEdit}

                                onDelete={onDelete}

                            />

                        ))

                    ) : (

                        <tr>

                            <td
                                colSpan={14}
                                className="
                                    py-16
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        gap-3
                                        text-gray-400
                                    "
                                >

                                    <Package size={48}/>

                                    <p>

                                        Không có dữ liệu

                                    </p>

                                </div>

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>

    );

}
