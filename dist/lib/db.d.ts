import { FilterProps } from './type';
declare class IndexedDBDatabase {
    private prefix;
    private databaseName;
    private objectStoreName;
    private db;
    private Console;
    constructor(databaseName: string, objectStoreName: string, Console: boolean);
    openDatabase(): Promise<void>;
    executeQuery(request: any, successCallback: any, errorCallback: any): void;
    createTransaction(mode: string): any;
    createTable(successCallback?: any, errorCallback?: any): Promise<void>;
    insertData(data: any, successCallback?: any, errorCallback?: any): Promise<void>;
    selectData(condition: FilterProps, successCallback: any, errorCallback: any): Promise<any[]>;
    updateData(condition: any, newData: any, successCallback: any, errorCallback: any): Promise<void>;
    deleteData(key: any, successCallback?: any, errorCallback?: any): Promise<void>;
    deleteMultipleData(keys: any[], successCallback: any, errorCallback: any): void;
}
export = IndexedDBDatabase;
