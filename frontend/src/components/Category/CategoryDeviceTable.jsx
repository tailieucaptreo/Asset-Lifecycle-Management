import { useNavigate } from "react-router-dom";
import DeviceStatus from "../Device/DeviceStatus";

export default function CategoryDeviceTable({

    data

}){

    const nav = useNavigate();

    return(

        <div className="bg-white rounded-2xl shadow overflow-hidden">

            <table className="w-full table-fixed">

                <thead className="bg-slate-100">

                    <tr>

                         <th className="p-3 text-left w-40">
                            ID
                         </th>
                    
                         <th className="p-3 text-left">
                            Tên
                         </th>
                    
                         <th className="p-3 text-center w-28">
                            Tuyến
                         </th>
                    
                         <th className="p-3 text-center w-36">
                            Ga
                         </th>
                    
                         <th className="p-3 text-center w-52">
                            Trạng thái
                         </th>

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

                            <td className="p-3 text-left">
                                {device.deviceId}
                            </td>
                            
                            <td className="p-3 text-left">
                                {device.name}
                            </td>
                            
                            <td className="p-3 text-center">
                                {device.line}
                            </td>
                            
                            <td className="p-3 text-center">
                                {device.station}
                            </td>
                            
                            <td className="p-3 text-center">
                                <DeviceStatus status={device.status}/>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}
