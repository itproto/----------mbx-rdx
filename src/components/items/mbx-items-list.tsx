import { useEffect } from "react";
import { getPositions } from "./../../services/portfolio-service";
import { IPosition } from "./../../types/vo";
import { MbxPositionItem as PositionItem } from "./list-item/list-item";

import { observable, makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
// import { configure } from "mobx";
import { /*trace,*/ spy, isObservableProp } from "mobx";
// import { counterStore, Counter } from "../counter/counter";
// import MobxDevTools from "mobx-react-devtools";
// import { enableLogging } from "mobx-logger";

// enableLogging();

/*
configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true
});*/

spy((event) => {
  if (event.type === "action") {
    // console.log(`type:${event.name}; loading: ${event.arguments}`);
  }
});

// Action=>Observable=>derived=>Reaction

class UiStore {
  isLoading = false;
  lastError?: string = undefined;
  term = "";
  dontObserve = "initialVal";
  constructor() {
    makeAutoObservable(this, {
      dontObserve: false
    });
  }
  // App
  setIsLoading = (val: boolean) => {
    this.isLoading = val;
  };
  setError = (err: any) => {
    this.lastError = String(err);
  };
  searchTerm = (term: string) => {
    this.term = term;
  };
}

class PostsStore {
  posts: IPosition[] = [];

  constructor(readonly uiStore: UiStore) {
    makeAutoObservable(this, {
      posts: observable.deep
    });
  }

  // === ACTIONS
  loadPosts = () => {
    this.uiStore.setIsLoading(true);
    this.posts = [];
    getPositions()
      .then(this.setPosts)
      .catch(this.uiStore.setError)
      .then(() => this.uiStore.setIsLoading(false));
  };

  setPosts = (posts: IPosition[]) => {
    this.posts = posts;
  };
  updPostHandler = (upd: Partial<IPosition>) => {
    this.setPosts(
      this.posts.map((p) => (p.id === upd.id ? { ...p, ...upd } : p))
    );
  };
  remPostHandler = (id: number) => {
    this.setPosts(this.posts.filter((p) => p.id !== id));
  };

  addPostHandler = (title: string) => {
    const maxId = Math.max(...this.posts.map((p) => p.id)) + 1;
    this.setPosts([...this.posts, { title, id: maxId }]);
  };
}

class AppStore {
  readonly uiStore;
  readonly postStore;
  constructor(_uiStore?: UiStore, _postStore?: PostsStore) {
    this.uiStore = _uiStore || new UiStore();
    this.postStore = _postStore || new PostsStore(this.uiStore);
    makeAutoObservable(this, {
      emptyTitles: false
    });
  }

  get posts() {
    return this.postStore.posts;
  }

  get emptyTitles() {
    return this.posts.filter((p) => p.title.trim() === "").length;
  }

  get filteredPosts() {
    return this.postStore.posts.filter(this.searchFilter);
  }

  private searchFilter = (post: IPosition) => {
    const { term } = this.uiStore;
    return term.length < 1 || post.title.match(term);
  };
}

// Q? How to inject?
const appStore = new AppStore(undefined, undefined);

const PostsListCmp = (props: { store: AppStore }) => {
  const { postStore, uiStore, emptyTitles, filteredPosts } = props.store;

  const {
    addPostHandler,
    remPostHandler,
    updPostHandler,
    loadPosts
  } = postStore;

  const { term, searchTerm, isLoading, lastError } = uiStore;

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  // trace(true);
  const checkObservable = () => {
    alert(isObservableProp(appStore, "emptyTitles"));
  };
  return (
    <div>
      <h3>Mobx</h3>
      <input
        type="text"
        onChange={(evt) => searchTerm(evt.target.value)}
        placeholder="search.."
        value={term}
      />
      <button onClick={loadPosts}>Reload</button>
      <hr />
      {lastError ? (
        <h1>{lastError}</h1>
      ) : isLoading ? (
        <div>LOADING...</div>
      ) : (
        filteredPosts.map((p) => (
          <PositionItem
            key={p.id}
            updPost={updPostHandler}
            remPost={remPostHandler}
            post={p}
          />
        ))
      )}
      <PositionItem key={"new-key"} addPost={addPostHandler} />
      Empty: {emptyTitles} <br />
      <button onClick={checkObservable}>isObservable</button> <hr />
    </div>
  );
};

export const PostListObserved = observer(PostsListCmp);
export const Portfolio = () => <PostListObserved store={appStore} />;
