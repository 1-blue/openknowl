import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

// 더미 카테고리
const categories = ['신규', '검토', '합격'];
// const categories = ['신규', '검토', '1차면접', '서류합격', '최종합격', '불합격'];
export const getCategories = (): Prisma.CategoryCreateManyInput[] => {
  return categories.map((category, index) => ({ category, boardIdx: index + 1 }));
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

/** 2023/10/06 - 보드들 데이터 얻기 - by 1-blue */
export const getBoards = (): Prisma.BoardCreateManyInput[] => {
  return categories.map((category, order) => ({ order }));
};

/** 2023/10/06 - 카드들 데이터 얻기 - by 1-blue */
export const getCards = (): Prisma.CardCreateManyInput[] =>
  Array(categories.length * categories.length)
    .fill(null)
    .map((_, index) => ({
      name: faker.person.firstName() + ' - ' + index,
      date: faker.date.future(),
      order: Math.floor(index / categories.length),
      boardIdx: (index % categories.length) + 1,
      platformIdx: platforms[Math.floor(Math.random() * platforms.length)],
    }));
