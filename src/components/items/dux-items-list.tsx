import { useCallback, useEffect } from "react";
import { getPositions } from "./../../services/portfolio-service";

import { IPosition } from "./../../types/vo";
import { PositionItem } from "./list-item/list-item";
import {
  createSlice,
  configureStore,
  PayloadAction,
  bindActionCreators
} from "@reduxjs/toolkit";
import { Provider, useDispatch, connect } from "react-redux";
import logger from "redux-logger";

const initialState = {
  posts: [] as IPosition[],
  term: "",
  isLoading: false,
  lastError: undefined
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPosition[]>) => {
      const posts = action.payload;
      state.posts = posts;
    },
    searchTerm: (state, action: PayloadAction<string>) => {
      state.term = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.lastError = action.payload;
    },

    updPostHandler: (state, action: PayloadAction<Partial<IPosition>>) => {
      const upd = action.payload;
      state.posts = state.posts.map((p) =>
        p.id === upd.id ? { ...p, ...upd } : p
      );
    },

    remPostHandler: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.posts = state.posts.filter((p) => p.id !== id);
    },

    addPostHandler: (state, action: PayloadAction<string>) => {
      const title = action.payload;
      const maxId = Math.max(...state.posts.map((p) => p.id)) + 1;
      state.posts = [...state.posts, { title, id: maxId }];
    }
  }
});

const appStore = configureStore({
  reducer: appSlice.reducer,
  middleware: [logger]
});

type IAppState = typeof initialState;

function mapDispatchToProps(dispatch: any) {
  return {
    dispatch,
    ...bindActionCreators(appSlice.actions, dispatch)
  };
}

const mapStateToProps = (state: IAppState, ownProps: any) => ({
  filteredPosts: state.posts.filter(
    (p) => state.term.length < 1 || p.title.match(state.term)
  ),
  emptyTitles: state.posts.filter((p) => p.title.trim() === "").length,
  ...state
});

const PostsList = (props: any) => {
  const dispatch = useDispatch();
  const {
    setPosts,
    searchTerm,
    setError,
    setIsLoading,
    filteredPosts,
    lastError,
    isLoading,
    addPostHandler,
    remPostHandler,
    updPostHandler,
    emptyTitles
  } = props;

  const loadPosts = useCallback(() => {
    dispatch(setIsLoading(true));
    setPosts([]);
    getPositions()
      .then((posts) => setPosts(posts))
      .catch(setError)
      .then(() => setIsLoading(false));
  }, [dispatch, setIsLoading, setError, setPosts]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <div>
      <h3>Redux</h3>
      <input
        type="text"
        onChange={(evt) => searchTerm(evt.target.value)}
        placeholder="search.."
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
      <hr />
      <PositionItem key={"newKey"} addPost={addPostHandler} />
      Empty: {emptyTitles}
    </div>
  );
};

const PostsListConnected = connect(
  mapStateToProps,
  mapDispatchToProps
)(PostsList);

export const Portfolio = () => (
  <Provider store={appStore}>
    <PostsListConnected />
  </Provider>
);
