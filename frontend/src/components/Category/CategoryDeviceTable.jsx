import { useNavigate } from "react-router-dom";
import DeviceStatus from "../Device/DeviceStatus";

export default function CategoryDeviceTable({

    data

}){

    const nav = useNavigate();

    return(

        <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-slate-100">

                    <tr>

                        <th className="p-3 text-left">ID</th>

                        <th className="p-3 text-left">Tên</th>

                        <th className="p-3">Tuyến</th>

                        <th className="p-3">Ga</th>

                        <th className="p-3">Trạng thái</th>

                    </tr>

                </thead>

                <tbody>

                    {data.map(device=>(

                        <tr

                            key={device.id}

                            onClick={()=>nav(`/devices/${device.id}`)}

                            className="
                                border-t
                                hover:bg-slate-50
                                cursor-pointer
                            "

                        >

                            <td className="p-3">

                                {device.deviceId}

                            </td>

                            <td className="p-3">

                                {device.name}

                            </td>

                            <td className="p-3">

                                {device.line}

                            </td>

                            <td className="p-3">

                                {device.station}

                            </td>

                            <td className="p-3">

                                <DeviceStatus
                                    status={device.status}
                                />

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
