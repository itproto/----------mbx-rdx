import { useEffect, useReducer } from "react";
import { getPositions } from "./../../services/portfolio-service";

import { IPosition } from "./../../types/vo";
import { PositionItem } from "./list-item/list-item";

const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "setPosts":
      return { ...state, posts: action.payload };
    case "searchTerm":
      return { ...state, searchTerm: action.payload };
    case "setIsLoading":
      return { ...state, isLoading: action.payload };
    case "setError":
      return { ...state, lastError: action.payload };
    case "updPostHandler":
      const upd = action.payload;
      return {
        ...state,
        posts: state.posts.map((p: any) =>
          p.id === upd.id ? { ...p, ...upd } : p
        )
      };
    case "remPostHandler":
      return {
        ...state,
        posts: state.posts.filter((p: any) => p.id !== action.payload)
      };
    case "addPostHandler":
      const title = action.payload;
      const maxId = Math.max(...state.posts.map((p) => p.id)) + 1;
      return [...state.posts, { title, id: maxId, count: 1, price: 100 }];
  }
};

const initialState = {
  posts: [] as IPosition[],
  term: "",
  isLoading: false,
  lastError: undefined
};

const PostsList = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { posts, isLoading, lastError, term } = state;
  const loadPosts = () => {
    dispatch({ type: "setIsLoading", payload: true });
    dispatch({ type: "setPosts", payload: [] });
    getPositions()
      .then((res) => dispatch({ type: "setPosts", payload: res }))
      .catch((err) => dispatch({ type: "setError", payload: err }))
      .then(() => dispatch({ type: "setIsLoading", payload: false }));
  };

  const searchFilter = (post: IPosition) => {
    return term.length < 1 || post.title.match(term);
  };

  const emptyTitles = posts.filter((p: any) => p.title.trim() === "").length;

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <h3>useReducer</h3>
      <input
        type="text"
        onChange={(evt) =>
          dispatch({ type: "searchTerm", payload: evt.target.value })
        }
        placeholder="search.."
      />
      <button onClick={loadPosts}>Reload</button>
      <hr />
      {lastError ? (
        <h1>{lastError}</h1>
      ) : isLoading ? (
        <div>LOADING...</div>
      ) : (
        posts
          .filter(searchFilter)
          .map((p: any) => (
            <PositionItem
              key={p.id}
              updPost={(payload) =>
                dispatch({ type: "updPostHandler", payload })
              }
              remPost={(payload) =>
                dispatch({ type: "remPostHandler", payload })
              }
              post={p}
            />
          ))
      )}
      <hr />
      <PositionItem
        key="new"
        addPost={(payload) => dispatch({ type: "addPostHandler", payload })}
      />
      Empty: {emptyTitles}
    </div>
  );
};

export const Portfolio = () => <PostsList />;
