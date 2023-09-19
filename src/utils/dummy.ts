// 테스트용

import { faker } from '@faker-js/faker';

import type { Board } from '@/types/entities';

type GetBoardsHandler = (count: number) => Board[];

const categories = ['신규', '검토중', '서류 합격', '1차 면접', '2차 면접', '최종합격', '불합격'];
const getCategory = () => categories[Math.floor(Math.random() * categories.length)];

export const getBoards: GetBoardsHandler = (count: number) =>
  Array(count)
    .fill(null)
    .map((_, i) => ({
      idx: i + 1,
      category: getCategory(),
      title: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
    }));

export const boards = getBoards(40);
