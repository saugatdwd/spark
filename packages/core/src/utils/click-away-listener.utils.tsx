import React, { useEffect, useRef } from "react";

interface ClickAwayListenerProps {
  onClickAway: (event: MouseEvent) => void;
  children: React.ReactNode;
  className?: string;
  onPositionChange?: () => void;
}

export const ClickAwayListener: React.FC<ClickAwayListenerProps> = ({ onClickAway, children, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAway(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClickAway]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
};
