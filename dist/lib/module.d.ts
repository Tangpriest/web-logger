declare class LoggerModule {
    private moduleName;
    private Logger;
    private Console;
    private prefix;
    constructor({ moduleName, Logger, Console }: {
        moduleName: string;
        Logger: any;
        Console: boolean;
    });
    info(message: string, extra?: any): void;
    warn(message: string, extra?: any): void;
    error(message: string, extra?: any): void;
    debug(message: string, extra?: any): void;
}
export default LoggerModule;
