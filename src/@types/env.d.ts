declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';

    readonly NEXT_PUBLIC_END_POINT: string;
  }
}
