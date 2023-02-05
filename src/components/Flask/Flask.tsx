import React from 'react';
import styles from './styles.module.css';

export interface IFlaskProps {
  flaskIndex: number;
  liquids: IFlask;
  handleClick: (flask: IFlask, flaskIndex: number) => void;
  isProviderFlask: boolean;
}

export type IFlask = Array<string | null>;

const Flask: React.FC<IFlaskProps> = ({
  flaskIndex,
  liquids,
  handleClick,
  isProviderFlask,
}) => {
  return (
    <div
      className={`${styles.flask} ${isProviderFlask && styles.selectedflask}`}
      onClick={() => {
        handleClick(liquids, flaskIndex);
      }}
    >
      {liquids.map((liquidColor: string | null, index: number) => {
        return (
          <div
            key={`${flaskIndex}-${index}`}
            className={`${styles.liquid} ${styles[`${liquidColor}`]}`}
          ></div>
        );
      })}
      <p>{flaskIndex + 1}</p>
    </div>
  );
};

export default Flask;
