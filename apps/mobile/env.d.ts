declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_ENVIRONMENT: 'local' | 'dev' | 'staging' | 'prod',
      EXPO_PUBLIC_API_BASE_URL: string,
      EXPO_PUBLIC_SERVER_IDENTIFIER: string
    }
  }
}

export {};