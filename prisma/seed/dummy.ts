import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

// 더미 카테고리
const categories = ['신규', '검토', '1차면접', '2차면접', '서류합격', '최종합격', '불합격'];
export const getCategories = (): Prisma.CategoryCreateManyInput[] => {
  return categories.map(category => ({ category }));
};

// 더미 플랫폼
const platforms = ['미니인턴', '원티드', '사람인', '로켓펀치', '잡코리아'];
export const getPlatforms = (): Prisma.PlatformCreateManyInput[] => {
  return platforms.map(platform => ({ platform }));
};

// 더미 태그
export const tags = ['#연봉협상', '#시니어', '#면접', '#미니인턴', '#오픈놀', '#기업과제'];
export const getTags = (): Prisma.TagCreateManyInput[] => {
  return tags.map(tag => ({ tag }));
};

/** 2023/09/20 - 각 카테고리 별로 n개씩 더미 보드 데이터 얻기 - by 1-blue */
export const getBoards = (): Prisma.BoardCreateManyInput[] =>
  Array(categories.length * categories.length)
    .fill(null)
    .map((_, index) => ({
      name: faker.person.firstName() + ' - ' + index,
      date: faker.date.past(),
      order: Math.floor(index / categories.length),
      categoryIdx: (index % categories.length) + 1,
      platformIdx: Math.floor(Math.random() * platforms.length + 1),
    }));
