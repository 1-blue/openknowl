import { faker } from '@faker-js/faker';
import type { Category, Prisma } from '@prisma/client';

const categories: Category[] = [
  'NEW',
  'REVIEW',
  'FIRST_INTERVIEW',
  'SECOND_INTERVIEW',
  'DOCUMENT_PASS',
  'FINAL_PASS',
  'FAILURE',
];
const getCategory = (index: number) => categories[Math.floor(index % categories.length)];

/** 2023/09/20 - 각 카테고리 별로 5개씩 더미 보드 데이터 얻기 - by 1-blue */
export const getBoards = (): Prisma.BoardCreateManyInput[] =>
  Array(categories.length * categories.length)
    .fill(null)
    .map((_, index) => ({
      category: getCategory(index),
      title: faker.lorem.word() + ' - ' + index,
      description: faker.lorem.paragraph(),
      order: Math.floor(index / categories.length),
    }));
