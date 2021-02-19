import { IPosition, IPositionVO } from "../types/vo";
import { MockDb } from "./mock/mock-db";

const fakePosts = new MockDb<IPositionVO>([
  { id: 1, title: "Ftse100", price: 40, count: 1000 },
  { id: 2, title: "Emerging markets", price: 20, count: 500 },
  { id: 3, title: "S&P", price: 60, count: 3000 },
  { id: 4, title: "STOXX", price: 45, count: 300 },
  { id: 5, title: "All-World", price: 100, count: 700 }
]);

// Getting data and mapping it (foor request/response)
const mapResponse = ({ id, title }: IPositionVO) =>
  ({ id, title: title.toUpperCase() } as IPosition);

const getPositions = () => fakePosts.gets().then((r) => r.map(mapResponse)); //Promise.reject("Can't get items");
const remPosition = (id: string) => fakePosts.remove(id);
const updatePostion = (upd: Partial<IPosition>) => fakePosts.update(upd);
const getPosition = (id: string) => fakePosts.get(id).then(mapResponse);

export { getPositions, remPosition, updatePostion, getPosition };
