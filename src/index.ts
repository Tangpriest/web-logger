import IndexedDBDatabase from './IndexDB';
import { FilterProps, LoggerProps } from './type';
import Utils from './utils';

class LoggerModule {
	private moduleName: string;
	private Logger: any;
	private Console: boolean;
	private prefix: string;

	constructor({ moduleName, Logger, Console }: { moduleName: string, Logger: any, Console:boolean }) {
		this.moduleName = moduleName;
		this.Logger = Logger;
		this.Console = Console;
		this.prefix = '[LogModule] : ';
	}

	info(message: string) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`${ timestamp } - ${ this.prefix }[Info] [${ this.moduleName }] ${ message}`);
		this.Logger(this.moduleName, 'Info', message, timestamp);
	}

	warn(message: string) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`%c${ timestamp } - ${ this.prefix }[Warn] [${ this.moduleName }] ${ message}`, 'color: orange');
		this.Logger(this.moduleName, 'Warn', message, timestamp);
	}

	error(message: string) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`%c${ timestamp } - ${ this.prefix }[Error] [${ this.moduleName }] ${ message}`, 'color: red');
		this.Logger(this.moduleName, 'Error', message, timestamp);
	}

	debug(message: string) {
		const timestamp = Utils.getFormattedDate();

		this.Console && console.log(`%c${ timestamp } - ${ this.prefix }[Debug] [${ this.moduleName }] ${ message}`, 'color: blue');
		this.Logger(this.moduleName, 'Debug', message, timestamp);
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
	[key: string]: any; 
	
	constructor(props: LoggerProps) {
		const {
			CollectionName = 'logs',
			DatabaseName = 'WEB_LOGS',
			ObjectStoreName = 'logs',
			UserId = 'UNKNOWN',
			ClientId = 'UNKNOWN',
			Modules = [],
			Mode = 'development'
		} = props;

		this.CollectionName = CollectionName;
		this.DatabaseName = DatabaseName;
		this.ObjectStoreName = ObjectStoreName;
		this.UserId = UserId;
		this.ClientId = ClientId;
		this.Mode = Mode;
		this.Console = this.Mode === 'development'
		this.prefix = '[LogSystem] : ';
		this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Logger initialized.`);
		if (!this.Console) {
			console.log('Logger Mode is production, no logs will be printed to console.')
		}
		this.connect();
		this.initModules(Modules);
	}

	connect() {
		this.dbClient = new IndexedDBDatabase(this.DatabaseName, this.ObjectStoreName, this.Console);
		this.dbClient
			.openDatabase()
			.then(() => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Connected to IndexedDB.`);
				this.createTable();
			})
			.catch((error: any) => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error connecting to IndexedDB:`, error);
			});
	}

	initModules(modules: string[]) {
		modules.forEach((module) => {
			this[module] = new LoggerModule({ moduleName : module, Logger : this.writeLogEntry.bind(this), Console : this.Console }) as any;
		});
	}

	createTable() {
		this.dbClient
			.createTable()
			.then(() => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Logs table created successfully.`);
			})
			.catch((error: any) => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error creating logs table:`, error);
			});
	}

	writeLogEntry(module: string, level: string, content: string, timestamp : string) {

		const data = {
			userId    : this.UserId,
			clientId  : this.ClientId,
			module    : module,
			level     : level,
			timestamp : timestamp,
			message   : content,
			isUpload  : false,
			data      : { key : 'value' }
		};

		this.dbClient
			.insertData(data)
			.then(() => {
				// this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Log inserted successfully.`);
			})
			.catch((error: any) => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error inserting log:`, error);
			});
	}

	getFilteredLogEntries(condition: FilterProps, successCallback: any, errorCallback: any) {

		this.dbClient.selectData(condition = {
			startTime : Utils.getFormattedDate('1970-01-01 00:00:00.000'),
			endTime   : Utils.getFormattedDate()
		}, successCallback, errorCallback)
	}

	updateConfig(config : FilterProps) {
		this.UserId = config.userId || this.UserId;
		this.ClientId = config.clientId || this.ClientId;
	}
}

declare global {
  interface Window {
    Logger: typeof Logger;
  }
}

window.Logger = Logger;

export default Logger;
