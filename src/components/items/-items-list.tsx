import { useEffect, useState } from "react";
import { getPositions } from "./../../services/portfolio-service";

import { IPosition } from "./../../types/vo";
import { PositionItem } from "./list-item/list-item";

// Mediator/SmartComponent vs Dumbs
const PostsList = () => {
  const [posts, setPosts] = useState<IPosition[]>([]);
  const [term, searchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setError] = useState(undefined);

  const loadPosts = () => {
    setIsLoading(true);
    setPosts([]);
    getPositions()
      .then(setPosts)
      .catch(setError)
      .then(() => setIsLoading(false));
  };

  const updPostHandler = (upd: Partial<IPosition>) => {
    setPosts(posts.map((p) => (p.id === upd.id ? { ...p, ...upd } : p)));
  };
  const remPostHandler = (id: number) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  const addPostHandler = (title: string) => {
    const maxId = Math.max(...posts.map((p) => p.id)) + 1;
    setPosts([...posts, { title, id: maxId }]);
  };

  const searchFilter = (post: IPosition) => {
    return term.length < 1 || post.title.match(term);
  };

  const emptyTitles = posts.filter((p) => p.title.trim() === "").length;

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <div>
      <h3>Vanilla hooks</h3>
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
        posts
          .filter(searchFilter)
          .map((p) => (
            <PositionItem
              key={p.id}
              updPost={updPostHandler}
              remPost={remPostHandler}
              post={p}
            />
          ))
      )}
      <hr />
      <PositionItem key="new" addPost={addPostHandler} />
      Empty: {emptyTitles}
    </div>
  );
};

export const Portfolio = () => <PostsList />;
