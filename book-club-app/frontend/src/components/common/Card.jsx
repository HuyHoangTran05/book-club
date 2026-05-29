import { classNames } from "../../utils/classNames.js";

function Card({ children, className = "", as: Component = "section" }) {
  return (
    <Component className={classNames("rounded-lg border border-white/80 bg-white/90 p-5 shadow-stitch backdrop-blur", className)}>
      {children}
    </Component>
  );
}

export default Card;
