import { classNames } from "../../utils/classNames.js";

function Card({ children, className = "", as: Component = "section" }) {
  return (
    <Component className={classNames("rounded-3xl border border-[#d9e2d8] bg-white p-6 shadow-stitch", className)}>
      {children}
    </Component>
  );
}

export default Card;
