import IndexedDBDatabase from './IndexDB';
import { filterCondition } from './type';
import Utils from './utils';

class LoggerModule {
	private moduleName: string;
	private Logger: any;

	constructor({ moduleName, Logger }: { moduleName: string, Logger: any }) {
		this.moduleName = moduleName;
		this.Logger = Logger;
	}

	info(message: string) {
		console.log(`[Info] [${this.moduleName}] ${message}`);
		this.Logger(this.moduleName, 'Info', message);
	}

	warn(message: string) {
		console.log(`[Warn] [${this.moduleName}] ${message}`);
		this.Logger(this.moduleName, 'Warn', message);
	}
}

class Logger {
	private CollectionName: string;
	private DatabaseName: string;
	private ObjectStoreName: string;
	private UserId: string;
	private ClientId: string;
	private prefix: string;
	private dbClient!: IndexedDBDatabase;
	[key: string]: any; // 添加索引签名，允许任意属性

	constructor(props: {
		CollectionName?: string,
		DatabaseName?: string,
		ObjectStoreName?: string,
		UserId?: string,
		ClientId?: string,
		Modules?: string[],
	}) {
		const {
			CollectionName = 'logs',
			DatabaseName = 'MyDatabase',
			ObjectStoreName = 'logs',
			UserId = 'UNKNOWN',
			ClientId = 'UNKNOWN',
			Modules = []
		} = props;

		this.CollectionName = CollectionName;
		this.DatabaseName = DatabaseName;
		this.ObjectStoreName = ObjectStoreName;
		this.UserId = UserId;
		this.ClientId = ClientId;

		console.log(this.ClientId);

		this.prefix = '[LogSystem] : ';
		console.log(`${this.prefix}Logger initialized.`);
		this.connect();
		this.initModules(Modules);
	}

	connect() {
		this.dbClient = new IndexedDBDatabase(this.DatabaseName, this.ObjectStoreName);
		this.dbClient
			.openDatabase()
			.then(() => {
				console.log(`${this.prefix}Connected to IndexedDB.`);
				this.createTable();
			})
			.catch((error: any) => {
				console.error(`${this.prefix}Error connecting to IndexedDB:`, error);
			});
	}

	initModules(modules: string[]) {
		modules.forEach((module) => {
			this[module] = new LoggerModule({ moduleName : module, Logger : this.logger.bind(this) }) as any;
		});
	}

	createTable() {
		this.dbClient
			.createTable()
			.then(() => {
				console.log(`${this.prefix}Logs table created successfully.`);
			})
			.catch((error: any) => {
				console.error(`${this.prefix}Error creating logs table:`, error);
			});
	}

	logger(module: string, level: string, content: string) {
		const data = {
			userId    : this.UserId,
			clientId  : this.ClientId,
			module    : module,
			level     : level,
			timestamp : Utils.getFormattedDate(),
			message   : content,
			isUpload  : false,
			data      : { key : 'value' }
		};

		this.dbClient
			.insertData(data)
			.then(() => {
				console.log(`${this.prefix}Log inserted successfully.`);
			})
			.catch((error: any) => {
				console.error(`${this.prefix}Error inserting log:`, error);
			});
	}

	getLogs(condition: filterCondition, successCallback: any, errorCallback: any) {
		// const condition = new Date().toISOString(); // 获取当前时间

		this.dbClient.selectData(condition = {
			startTime : Utils.getFormattedDate('1970-01-01 00:00:00.000'),
			endTime   : Utils.getFormattedDate()
		}, successCallback, errorCallback)
			.then((logs) => {
				console.log(`${this.prefix}Logs retrieved successfully:`, logs);
			})
			.catch((error: any) => {
				console.error(`${this.prefix}Error retrieving logs:`, error);
			});
	}
}

declare global {
  interface Window {
    Logger: typeof Logger;
  }
}

window.Logger = Logger;

export default Logger;
