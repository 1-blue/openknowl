import type { Theme } from '@src/shared/theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
