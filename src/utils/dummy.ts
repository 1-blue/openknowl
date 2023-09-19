// 테스트용

import { faker } from '@faker-js/faker';

import type { Board, Category } from '@/types/entities';

type GetBoardsHandler = (count: number) => Board[];

const categories: Category[] = [
  'new',
  'review',
  // 'documentPass',
  // 'firstInterview',
  // 'secondInterview',
  // 'finalPass',
  // 'failure',
];
const getCategory = () => categories[Math.floor(Math.random() * categories.length)];

export const getBoards: GetBoardsHandler = (count: number) =>
  Array(count)
    .fill(null)
    .map((_, i) => ({
      idx: i + 1,
      category: getCategory(),
      title: faker.lorem.word() + ' - ' + i,
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),

      order: i,
    }));

export const boards = getBoards(10);
