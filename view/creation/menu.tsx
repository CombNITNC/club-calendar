import { FC } from 'react';

export const Menu: FC<{
  items: string[];
  onClick: (index: number) => void;
}> = ({ items, onClick }) => (
  <>
    <div className="menu-box">
      {items.map((e, i) => (
        <div key={i} className="menu-item" onClick={() => onClick(i)}>
          {e}
        </div>
      ))}
    </div>
    <style jsx>{`
      .menu-box {
        position: fixed;
        display: flex;
        flex-flow: column nowrap;
        bottom: 1em;
        right: 1em;
        box-shadow: 1px 1px 2px lightgray;
        cursor: pointer;
      }
      .menu-item {
        padding: 0.5em;
        height: 2em;
        font-size: 16pt;
        border-radius: 2px;
        border: 1px solid gray;
        background-color: white;
      }
    `}</style>
  </>
);
