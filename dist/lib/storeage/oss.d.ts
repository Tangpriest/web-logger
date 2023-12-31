interface OSSconfig {
    accessKeyId: string;
    accessKeySecret: string;
    SecurityToken: string;
    bucket: string;
    region: string;
}
declare class OSSClient {
    private client;
    private Console;
    private StoragePath;
    private Config;
    constructor({ StroagePath }: {
        StroagePath: string;
    });
    initClient(initSuccess?: () => void): Promise<void>;
    upload(logs: any, path: string): Promise<void>;
    getUploadInfo(): Promise<OSSconfig>;
    getConfig(): OSSconfig;
}
export default OSSClient;
