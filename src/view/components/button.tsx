import { FC, ReactNode, forwardRef, Ref } from "react";

export const ShadowedButton: FC<{
  onClick?: () => void;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}> = forwardRef(function InternalShadowedButton({ onClick, children }, ref) {
  return (
    <>
      <div onClick={onClick} ref={ref}>
        {children}
      </div>
      <style jsx>{`
        div {
          margin: 1rem 2rem;
          padding: 0.5rem 2rem;
          background-color: white;
          box-shadow: 1px 1px 5px gray;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }
      `}</style>
    </>
  );
});

export const ShadowedRedButton: FC<{
  onClick?: () => void;
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}> = forwardRef(function InternalShadowedRedButton({ onClick, children }, ref) {
  return (
    <>
      <div onClick={onClick} ref={ref}>
        {children}
      </div>
      <style jsx>{`
        div {
          padding: 0 0.5em;
          box-shadow: 1px 1px 5px gray;
          text-align: center;
          cursor: pointer;
          user-select: none;
          font-weight: bold;
          color: red;
        }
      `}</style>
    </>
  );
});
