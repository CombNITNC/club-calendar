import { FC, useRef } from "react";

export const Modal: FC<{ close: () => void }> = ({ children, close }) => {
  const ref = useRef(null);
  return (
    <>
      <div
        className="back"
        ref={ref}
        onClick={(e) => {
          if (e.target == ref.current) close();
        }}
      >
        <div className="modal-container">{children}</div>
      </div>
      <style jsx>{`
        .back {
          position: fixed;
          display: flex;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          background-color: rgba(0, 0, 0, 0.4);
          z-index: 5000;
        }
        .modal-container {
          width: 100%;
          max-width: 440px;
          margin: auto;
          padding: 1em;
          background-color: white;
          border-radius: 5px;
          z-index: 10;
        }
      `}</style>
    </>
  );
};
