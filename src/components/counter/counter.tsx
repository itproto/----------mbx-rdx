import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";

const createCounterStore = (initialCounter = 10, step = 1) => {
  return makeAutoObservable({
    counter: initialCounter,
    step,
    increment() {
      this.counter += this.step;
    },
    decrement() {
      this.counter -= this.step;
    }
  });
};

export const counterStore = createCounterStore();

export const Counter = observer(({ store }: any) => (
  <div>
    <button onClick={() => store.increment()}>+</button>
    <span>Counter:{store.counter}</span>
    <button onClick={() => store.decrement()}>-</button>
  </div>
));
