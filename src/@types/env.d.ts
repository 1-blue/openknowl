declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';

    readonly NEXT_PUBLIC_END_POINT: string;

    readonly AWS_S3_BUCKET: string;
    readonly AWS_S3_REGION: string;
    readonly AWS_S3_ACCESS_KEY: string;
    readonly AWS_S3_ACCESS_SECRET_KEY: string;
  }
}
