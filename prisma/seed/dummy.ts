import { faker } from '@faker-js/faker';
import type { Category, Platform, Prisma } from '@prisma/client';

const categories: Category[] = [
  'NEW',
  'REVIEW',
  'FIRST_INTERVIEW',
  'SECOND_INTERVIEW',
  'DOCUMENT_PASS',
  'FINAL_PASS',
  'FAILURE',
];
const platforms: Platform[] = ['WANTED', 'SARAMIN', 'ROCKETPUNCH', 'JOBPLANET', 'MINIINTERN'];
const getCategory = (index: number) => categories[Math.floor(index % categories.length)];

/** 2023/09/20 - 각 카테고리 별로 n개씩 더미 보드 데이터 얻기 - by 1-blue */
export const getBoards = (): Prisma.BoardCreateManyInput[] =>
  Array(categories.length * categories.length)
    .fill(null)
    .map((_, index) => ({
      category: getCategory(index),
      name: faker.person.firstName() + ' - ' + index,
      date: faker.date.past(),
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      order: Math.floor(index / categories.length),
    }));

export const tags = ['#연봉협상', '#시니어', '#면접', '#미니인턴', '#오픈놀', '#기업과제'];

/** 2023/09/20 - 더미 태그 등록 - by 1-blue */
export const getTags = (): Prisma.TagCreateManyInput[] => tags.map(tag => ({ tag }));
