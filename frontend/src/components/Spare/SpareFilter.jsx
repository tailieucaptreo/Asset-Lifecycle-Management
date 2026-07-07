export default function SpareFilter({

    filter,

    setFilter

}){

    return(

        <select

            value={filter}

            onChange={(e)=>

                setFilter(

                    e.target.value

                )

            }

            className="
                px-4
                py-3
                rounded-xl
                border
                bg-white
            "

        >

            <option value="All">

                Tất cả

            </option>

            <option value="New">

                Thiết bị mới

            </option>

            <option value="Used">

                Đã sử dụng

            </option>

            <option value="Broken">

                Hỏng

            </option>

        </select>

    );

}
