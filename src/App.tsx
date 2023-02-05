import { useEffect, useState } from 'react';
import './App.css';
import Flask, { IFlask } from './components/Flask/Flask';

function App() {
  const [providerFlask, setProviderFlask] = useState<null | IFlask>(null);
  const [providerFlaskIndex, setProviderFlaskIndex] = useState<null | number>(
    null,
  );
  const [receiverFlask, setReceiverFlask] = useState<null | IFlask>(null);
  const [receiverFlaskIndex, setReceiverFlaskIndex] = useState<null | number>(
    null,
  );
  const [flasks, setFlasks] = useState([
    [null, 'green', 'blue', 'red'],
    ['red', 'red', 'blue', 'blue'],
    [null, 'green', 'green', 'red'],
    [null, 'blue', 'blue', 'red'],
    ['red', 'red', 'blue', 'blue'],
    [null, null, null, 'red'],
    [null, 'blue', 'blue', 'red'],
    ['red', 'red', 'blue', 'blue'],
    [null, null, 'red', 'green'],
  ]);
  const [firstRender, setFirstRender] = useState(true);
  useEffect(() => {
    gameFinished();
  }, [flasks]);

  useEffect(() => {
    !firstRender && receiverFlask && transpose();
    firstRender && setFirstRender(false);
  }, [receiverFlask]);

  function handleClick(flask: IFlask, flaskIndex: number) {
    if (providerFlask) {
      setReceiverFlask(flask);
      setReceiverFlaskIndex(flaskIndex);
    } else {
      setProviderFlask(flask);
      setProviderFlaskIndex(flaskIndex);
    }
  }

  function getLastColor(liquids: IFlask | null): string | null {
    let color: string | null = null;
    if (!liquids?.every(el => el === null)) {
      liquids?.forEach(currentColor => {
        if (currentColor && !color) color = currentColor;
      });

      return color;
    }
    return null;
  }

  function transpose() {
    if (providerFlaskIndex === receiverFlaskIndex) {
    } else if (
      getLastColor(providerFlask) === getLastColor(receiverFlask) ||
      getLastColor(receiverFlask) === null
    ) {
      let newFlask1 = providerFlask as IFlask;
      let newFlask2 = receiverFlask as IFlask;
      let tempLastColor: string | null = getLastColor(receiverFlask);

      while (
        newFlask2.some(el => el === null) &&
        newFlask1.some(el => el === tempLastColor)
      ) {
        const { element, index: elementIndex } = firstValidElement(newFlask1);
        if (elementIndex !== null) newFlask1[elementIndex] = null;
        const nextSpace = firstEmptySpace(newFlask2);
        newFlask2[nextSpace] = element;
        tempLastColor = element;
      }

      setFlasks(
        flasks.map((flask, index) => {
          if (index === receiverFlaskIndex) return newFlask2;
          if (index === providerFlaskIndex) return newFlask1;
          return flask;
        }),
      );
    }

    setProviderFlask(null);
    setProviderFlaskIndex(null);
    setReceiverFlask(null);
    setReceiverFlaskIndex(null);
  }

  function firstValidElement(array: IFlask): {
    element: string | null;
    index: number | null;
  } {
    for (let index = 0; index < array.length; index++) {
      if (array[index]) {
        return {
          element: array[index],
          index,
        };
      }
    }

    return {
      element: null,
      index: null,
    };
  }

  function firstEmptySpace(array: Array<string | null>) {
    if (array[3] === null) {
      return 3;
    }
    for (let i = 0; i < array.length - 1; i++) {
      if (!array[i] && array[i + 1]) {
        return i;
      }
    }
    return -1;
  }

  function gameFinished(): boolean {
    flasks.forEach(flask => {});
    return true;
  }

  return (
    <div className="App">
      <h1>Flask Game</h1>
      <h3>
        Selected Flask: {providerFlaskIndex !== null && providerFlaskIndex + 1}
      </h3>
      <div className="flasks">
        {flasks.map((_, index: number) => (
          <Flask
            isProviderFlask={index === providerFlaskIndex}
            flaskIndex={index}
            liquids={flasks[index]}
            handleClick={handleClick}
            key={index}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
