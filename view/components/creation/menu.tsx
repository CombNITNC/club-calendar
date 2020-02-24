import { FC } from 'react';
import { ShadowedButton } from '../button';

export const Menu: FC<{
  items: string[];
  onClick: (index: number) => void;
}> = ({ items, onClick }) => (
  <>
    <div className="menu-box">
      {items.map((e, i) => (
        <div key={i} className="menu-item">
          <ShadowedButton key={i} onClick={() => onClick(i)}>
            {e}
          </ShadowedButton>
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
      }
      .menu-item {
        margin: 12px 0 0 0;
        height: 2em;
        font-size: 16pt;
        background-color: white;
      }
    `}</style>
  </>
);
