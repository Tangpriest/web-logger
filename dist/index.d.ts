import { filterCondition } from './type';
declare class Logger {
    private CollectionName;
    private DatabaseName;
    private ObjectStoreName;
    private UserId;
    private ClientId;
    private prefix;
    private dbClient;
    [key: string]: any;
    constructor(props: {
        CollectionName?: string;
        DatabaseName?: string;
        ObjectStoreName?: string;
        UserId?: string;
        ClientId?: string;
        Modules?: string[];
    });
    connect(): void;
    initModules(modules: string[]): void;
    createTable(): void;
    logger(module: string, level: string, content: string): void;
    getLogs(condition: filterCondition, successCallback: any, errorCallback: any): void;
}
declare global {
    interface Window {
        Logger: typeof Logger;
    }
}
export default Logger;
