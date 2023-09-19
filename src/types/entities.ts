export type Category =
  | 'new'
  | 'review'
  | 'documentPass'
  | 'firstInterview'
  | 'secondInterview'
  | 'finalPass'
  | 'failure';

export interface Board {
  idx: number;
  category: Category;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;

  order: number;
}
