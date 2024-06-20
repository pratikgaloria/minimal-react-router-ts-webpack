import React from "react";
import ReactDOM from "react-dom";
import styles from "./portal.module.scss";

export function WithPortal(props: React.PropsWithChildren) {
  const overlay = document.createElement("div");
  overlay.classList.add(styles.overlay);

  const wrapper = document.createElement("div");
  wrapper.appendChild(overlay);

  React.useEffect(() => {
    document.body.appendChild(wrapper);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.removeChild(wrapper);
      document.body.style.overflow = 'unset';
    };
  });

  return ReactDOM.createPortal(props.children, wrapper);
}
