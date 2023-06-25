import { FilterProps, LoggerProps } from './type';
declare class Logger {
    private CollectionName;
    private DatabaseName;
    private ObjectStoreName;
    private UserId;
    private ClientId;
    private prefix;
    private dbClient;
    [key: string]: any;
    constructor(props: LoggerProps);
    connect(): void;
    initModules(modules: string[]): void;
    createTable(): void;
    writeLogEntry(module: string, level: string, content: string, timestamp: string): void;
    getFilteredLogEntries(condition: FilterProps, successCallback: any, errorCallback: any): void;
    updateConfig(config: FilterProps): void;
}
declare global {
    interface Window {
        Logger: typeof Logger;
    }
}
export default Logger;
