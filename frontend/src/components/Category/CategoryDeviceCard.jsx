import { useNavigate } from "react-router-dom";
import DeviceStatus from "../Device/DeviceStatus";

export default function CategoryDeviceCard({

    device

}){

    const nav = useNavigate();

    return(

        <div

            onClick={()=>nav(`/devices/${device.id}`)}

            className="
                bg-white
                rounded-2xl
                shadow
                p-5
                cursor-pointer
            "

        >

            <h2 className="font-bold text-lg">

                {device.name}

            </h2>

            <p className="text-gray-500">

                {device.deviceId}

            </p>

            <div className="mt-3">

                <DeviceStatus
                    status={device.status}
                />

            </div>

            <div className="mt-4 text-sm">

                <p>

                    Tuyến: {device.line}

                </p>

                <p>

                    Ga: {device.station}

                </p>

            </div>

        </div>

    );

}
