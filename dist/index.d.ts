import { FilterProps, LoggerProps } from './lib/type';
declare class Logger {
    private DatabaseName;
    private ObjectStoreName;
    private UserId;
    private ClientId;
    private prefix;
    private dbClient;
    private Terminal;
    private StoragePath;
    private UploadIntervalTimes;
    [key: string]: any;
    constructor(props: LoggerProps);
    connect(): void;
    initModules(modules: string[]): void;
    createTable(): void;
    writeLogEntry(module: string, level: string, content: string, timestamp: string, extra?: any): void;
    getFilteredLogEntries(condition: FilterProps, successCallback: any, errorCallback: any): void;
    updateConfig(config: FilterProps): void;
    createInterval(): void;
    getUploadLogs(): void;
    uploadLogs(logs: any, path: string, fileName: string): Promise<void>;
    uploadImmediately(): void;
    formatLog(logs: any): any;
    uploadDone(path: string, fileName: string): Promise<void>;
}
declare global {
    interface Window {
        Logger: typeof Logger;
    }
}
export default Logger;
