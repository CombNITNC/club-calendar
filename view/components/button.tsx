import { FC, ReactNode } from 'react';

export const ShadowedButton: FC<{
  onClick?: () => void;
  children?: ReactNode;
}> = ({ onClick, children }) => (
  <>
    <div onClick={onClick}>{children}</div>
    <style jsx>{`
      div {
        padding: 0 0.5em;
        box-shadow: 1px 1px 5px gray;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
    `}</style>
  </>
);
