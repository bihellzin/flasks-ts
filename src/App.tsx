import { useEffect, useState } from 'react';
import './App.css';
import Flask, { IFlask } from './components/Flask/Flask';

function App() {
  const initialGameSetup = [
    [null, 'green', 'blue', 'red'],
    ['red', 'red', 'blue', 'blue'],
    [null, 'green', 'green', 'red'],
    [null, 'blue', 'blue', 'red'],
    ['red', 'red', 'blue', 'blue'],
    [null, null, null, 'red'],
    [null, 'blue', 'blue', 'red'],
    ['red', 'red', 'blue', 'blue'],
    [null, 'blue', 'red', 'green'],
  ];
  const [providerFlask, setProviderFlask] = useState<null | IFlask>(null);
  const [providerFlaskIndex, setProviderFlaskIndex] = useState<null | number>(
    null,
  );
  const [receiverFlask, setReceiverFlask] = useState<null | IFlask>(null);
  const [receiverFlaskIndex, setReceiverFlaskIndex] = useState<null | number>(
    null,
  );
  const [gameFinished, setGameFinished] = useState(false);
  const [flasks, setFlasks] = useState(initialGameSetup);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    gameHasFinished() && setGameFinished(true);
  }, [flasks]);

  useEffect(() => {
    !firstRender && receiverFlask && transpose();
    firstRender && setFirstRender(false);
  }, [receiverFlask]);

  function restartGame() {
    setFlasks(initialGameSetup);
    setGameFinished(false);
  }

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
    if (
      providerFlaskIndex !== receiverFlaskIndex &&
      (getLastColor(providerFlask) === getLastColor(receiverFlask) ||
        getLastColor(receiverFlask) === null)
    ) {
      let newFlask1 = providerFlask as IFlask;
      let newFlask2 = receiverFlask as IFlask;
      let tempLastColor: string | null = getLastColor(receiverFlask);

      while (
        (newFlask2.some(el => el === null) &&
          newFlask1.some(el => el === tempLastColor)) ||
        tempLastColor === null
      ) {
        const { element, index: elementIndex } = firstValidElement(newFlask1);
        if (elementIndex !== null) newFlask1[elementIndex] = null;
        const nextSpace = firstEmptySpace(newFlask2) as number;
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
  }

  function gameHasFinished(): boolean {
    for (const flask of flasks) {
      const finished = flask.every(el => el === flask.at(-1));
      if (!finished) return false;
    }

    return true;
  }

  return (
    <div className="App">
      <h1>Flask Game</h1>
      {!gameFinished && (
        <>
          <h3>
            Selected Flask:{' '}
            {providerFlaskIndex !== null && providerFlaskIndex + 1}
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
        </>
      )}
      {gameFinished && (
        <>
          <button onClick={restartGame}>Restart</button>
        </>
      )}
      <a
        className="attribution"
        href="https://www.flaticon.com/free-icons/chemistry"
        title="chemistry icons"
      >
        Chemistry icons created by Freepik - Flaticon
      </a>
    </div>
  );
}

export default App;
