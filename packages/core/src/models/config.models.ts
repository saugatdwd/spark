export type AppConstantsModel = {
  config: {
    API_ENDPOINT: string;
    API_KEY: string;
    API_MODE: "DEV" | "STAGING" | "PROD";
    AUTH_STORAGE_KEY: string;
    THEME_MODE_STORAGE_KEY: string;
    API_FILE_CONVERTER_ENDPOINT: string;
    WEBHOOK_TOKEN: string;
    VITE_APP_AUTH_TOKEN: string;
    UMM_API_ENDPOINT: string;
    ORG_APP_ID: string;
  };
};
