export default function DeviceFilter({

  filters,

  setFilters

}) {

  return (

    <tr>

      {/* TÊN */}

      <th className="p-2">

        <input

          placeholder="Tên"

          className="
            border
            rounded
            p-2
            w-full
          "

          value={filters.name || ""}

          onChange={(e) =>

            setFilters({

              ...filters,

              name: e.target.value

            })

          }

        />

      </th>

      {/* TUYẾN */}

      <th></th>

      {/* NHÀ GA */}

      <th className="p-2">

        <input

          placeholder="Nhà ga"

          className="
            border
            rounded
            p-2
            w-full
          "

          value={filters.station || ""}

          onChange={(e) =>

            setFilters({

              ...filters,

              station: e.target.value

            })

          }

        />

      </th>

      {/* TRẠNG THÁI */}

      <th className="p-2">

        <select

          className="
            border
            rounded
            p-2
            w-full
          "

          value={filters.status || ""}

          onChange={(e) =>

            setFilters({

              ...filters,

              status: e.target.value

            })

          }

        >

          <option value="">
            Tất cả
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Maintenance">
            Maintenance
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>

      </th>

      {/* CÁC CỘT KHÁC */}

      <th colSpan="6"></th>

    </tr>

  );

}
