import { useNavigate } from "react-router-dom";

export default function Card({
  title,
  value,
  color,
  icon,
  to
}) {

  const nav = useNavigate();

  return (

    <div

      onClick={() => to && nav(to)}

      className={`
        ${color}

        text-white

        rounded-2xl

        shadow-md

        hover:shadow-xl
        hover:-translate-y-1

        transition-all
        duration-300

        cursor-pointer

        p-5

        min-h-[130px]

        flex
        items-center
        justify-between
      `}

    >

      {/* LEFT */}

      <div className="flex-1">

        <p
          className="
          text-sm
          md:text-base
          font-medium
          opacity-90
          "
        >
          {title}
        </p>

        <h2
          className="
          mt-2

          text-3xl
          md:text-4xl

          font-bold
          "
        >
          {value}
        </h2>

      </div>

      {/* RIGHT */}

      <div

        className="
        ml-4

        text-4xl
        md:text-5xl

        opacity-80
        "

      >

        {icon}

      </div>

    </div>

  );

}
