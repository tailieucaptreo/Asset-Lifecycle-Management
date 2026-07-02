import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";
import DeviceTable from "../components/Device/DeviceTable";

export default function ExpiredDevices() {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchExpired =
      async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(

            `${API}/api/devices`,

            {
              headers:{
                Authorization:
                  `Bearer ${token}`
              }
            }

          );

        const now =
          new Date();

        const expired =
          res.data.filter((d)=>{

            if(
              !d.installDate ||
              !d.lifespan
            ){
              return false;
            }

            const exp =
              new Date(
                d.installDate
              );

            exp.setFullYear(
              exp.getFullYear()
              +
              Number(
                d.lifespan
              )
            );

            return (
              exp < now
            );

          });

        setData(
          expired
        );

      }

      catch(err){

        console.log(
          "LOAD EXPIRED ERROR",
          err
        );

        setData([]);

      }

      finally{

        setLoading(false);

      }

    };

    fetchExpired();

  }, []);

  return (

    <div className="p-6">

      <h1
        className="
          text-2xl
          font-bold
          text-red-500
          mb-5
        "
      >
        ⛔ Thiết bị hết hạn
      </h1>

      {

      loading

      ?

      <div
        className="
          bg-white
          rounded-xl
          p-8
          text-center
        "
      >
        Đang tải...
      </div>

      :

      <Table
        data={data}
        setData={setData}
      />

      }

    </div>

  );

}
