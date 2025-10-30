export interface AppConfig {
    port: number;
    apiVersion: string;
    environment: 'development' | 'production';
}

export const defaultConfig: AppConfig = {
    port: 3000,
    apiVersion: 'v1',
    environment: 'development'
};
