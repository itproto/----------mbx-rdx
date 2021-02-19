# MobX

## Pre-history

- Global state/ServiceLocator/Cairngorn
- Rails MVC=> Silverlight MVVM/MVP 15years
  http://www.digigene.com/wp-content/uploads/2018/05/compare-MVVMMVPMVC.jpeg
- Flex `[Bindable]` AS3 annotation (Robotlegs/Parsley)
- WPF/Silverlight MVVM
- knockout (ko.) vs Backbone (view/model/collections)

```js
ko.applyBindings(new AppViewModel());
```

- Angular 2/ 2way-binding with decorators
  https://angular.io/guide/two-way-binding
- DI - how to construct blocks vs how to structure question
- Modern Store ~~ MVC Controller (FLUX )

## FLOW:

FLUX: Action->Dispatcher->Store->View=>Action
https://facebook.github.io/flux/img/overview/flux-simple-f8-diagram-explained-1300w.png
Action(EventHandle) => State[Observable] => Deriviation[ComputedValues|Reaction(view)]
https://mobx.js.org/assets/getting-started-assets/overview.png
Action => [middlewares|DISPATCHER] => [reducer=>STORE=>state] => view
https://hackernoon.com/hn-images/0*cntBtPADjE2ykLSP.png

### Actors

- DomainStores (posts/comments/users)
- UIStores (loading/error/selectedValue
- DomainObjects

```js
class RootStore {
  constructor() {
    this.userStore = new UserStore(this);
    this.todoStore = new TodoStore(this);
  }
}

class TodoStore {
  todos = [];
  rootStore;
  constructor(rootStore) {
    makeAutoObservable(this, { rootStore: false });
    this.rootStore = rootStore;
  }
}

// Domain object Todo/MODEL
export class Todo{
  constructor(store, id = uuid.v4()) {
    makeAutoObservable(this,)...)
    this.saveHandler = reaction(()=>this.adJson(), this.store.api.post)
  }

  dispose(){this.saveHandler()}

  get asJson/fromJsion() {}}
```

## 1. OBSERVABLE

**Decoratoors drop - due to standardized JavaScript limitations in how class fields are constructed**

1. makeObservable

```js
constructor(value) {
  makeObservable(this, {
  value: observable,
  double: computed,
  increment: action,
  fetch: flow
```

2. `makeAutObservable`(default_annotations)
3. `observable` for proxy

- slower, use when object structure is not known
- object cloned as proxy (later props will be picked)
- Great for arrays, ,maps
- `clear/replace/remove`

```js
const tags = observable(["high prio", "medium prio", "low prio"]);
```

Annotations:

- observable
  - deep/ref/shallow/struct (?)
    - struct - checks for structural-equality

## 2. Computed

> derived from observable

- should be pure (no state update)
- lazily updated (if not used - not called)

## 3. Action

> command

- like reducer, central place to update state
- use strict and modify in actions

## 4. Reaction

> like computing values that produce side-effects

- rarely should be used
- we use to link models with JSON.stringify({})
- dispose reactions
  DON@T OVERUSE
- if no direct relationship beween cause and effecy
  - for example dump state to localStorage
- DON'T calculate derived values, use @COMPUTED
- SHOULD be independent from other reactions

## Trobleshoot

- view shoud be wrapped in `observer`
- property `isObservableProp`
- track life-cycle `trace/spy/mobx-logger`
- mobx-dev-tools

## Tips

- De-reference late

```js
// person.name change will trigger only ddep comonent rerender
<DisplayName person={person} />
```

## Setup

## REDUX

- single shallow **immutable** store (source of truth) vs complex graph
- **pure** data - impure is harder to test/track

## Resources

Action => Observable => Derriviation[ComputedValues => Reaction]

- https://codesandbox.io/s/concepts-principles-il8lt?file=/src/index.js:279-293
- https://hackernoon.com/the-fundamental-principles-behind-mobx-7a725f71f3e8
