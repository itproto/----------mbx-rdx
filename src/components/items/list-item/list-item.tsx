import { observer } from "mobx-react";
import { useRef } from "react";
import { IPosition } from "./../../../types/vo";
type IProps = {
  post?: IPosition;
  remPost?: (id: number) => void;
  updPost?: ({ title, id }: Partial<IPosition>) => void;
  addPost?: (title: string) => void;
};

export const PositionItem = ({ post, addPost, remPost, updPost }: IProps) => {
  const titleRef = useRef<HTMLInputElement>(null);

  const addHandler = () => {
    if (!titleRef.current!.value) {
      return;
    }
    addPost!(titleRef.current!.value);
    titleRef.current!.value = "";
  };
  const addItem = <button onClick={addHandler}>Add</button>;
  const updateItem = (
    <>
      <button onClick={() => remPost!(post!.id)}>x</button>
    </>
  );

  return (
    <div>
      <div>
        <input
          ref={titleRef}
          value={post?.title}
          placeholder="New Position"
          onChange={
            updPost
              ? (event) =>
                  updPost({
                    id: post!.id,
                    title: event.target.value
                  })
              : undefined
          }
        />
        <div style={{ float: "right" }}>{addPost ? addItem : updateItem}</div>
      </div>
      <hr />
    </div>
  );
};

export const MbxPositionItem = observer(PositionItem);
