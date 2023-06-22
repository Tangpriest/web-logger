import { filterCondition } from './type';
declare class IndexedDBDatabase {
    private prefix;
    private databaseName;
    private objectStoreName;
    private db;
    constructor(databaseName: string, objectStoreName: string);
    openDatabase(): Promise<void>;
    executeQuery(request: any, successCallback: any, errorCallback: any): void;
    createTransaction(mode: string): any;
    createTable(successCallback?: any, errorCallback?: any): Promise<void>;
    insertData(data: any, successCallback?: any, errorCallback?: any): Promise<void>;
    selectData(condition: filterCondition, successCallback: any, errorCallback: any): Promise<any[]>;
    updateData(condition: any, newData: any, successCallback: any, errorCallback: any): Promise<void>;
    deleteData(condition: any, successCallback: any, errorCallback: any): Promise<void>;
}
export = IndexedDBDatabase;
