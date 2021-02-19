export interface IPosition {
  id: number;
  title: string;
}

export interface IPositionVO {
  /* or DTO */
  userId?: number;
  id: number;
  title: string;
  price: number;
  count: number;
}
