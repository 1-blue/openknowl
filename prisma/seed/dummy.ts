import { faker } from '@faker-js/faker';
import type { Prisma } from '@prisma/client';

// 더미 카테고리
const categories = ['신규', '검토', '합격'];
// const categories = ['신규', '검토', '1차면접', '서류합격', '최종합격', '불합격'];

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

// 가짜 성 & 이름
export const firstNames = ['이', '한', '최', '임', '강'];
export const lastNames = [
  '민준',
  '서준',
  '도윤',
  '예준',
  '시우',
  '하준',
  '주원',
  '지호',
  '시연',
  '서윤',
  '지우',
  '서현',
  '하윤',
  '하은',
  '민서',
  '지유',
];

/** 2023/10/06 - 보드들 데이터 얻기 - by 1-blue */
export const getBoards = (): Prisma.BoardCreateManyInput[] => {
  return categories.map((category, order) => ({ category, order }));
};

/** 2023/10/06 - 카드들 데이터 얻기 - by 1-blue */
export const getCards = (): Prisma.CardCreateManyInput[] =>
  Array(categories.length * categories.length)
    .fill(null)
    .map((_, index) => ({
      name:
        firstNames[Math.floor(Math.random() * firstNames.length)] +
        lastNames[Math.floor(Math.random() * lastNames.length)],
      date: faker.date.soon(),
      order: Math.floor(index / categories.length),
      boardIdx: (index % categories.length) + 1,
      platformIdx: Math.floor(Math.random() * platforms.length) + 1,
    }));
