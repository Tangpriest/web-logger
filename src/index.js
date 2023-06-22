const IndexedDBDatabase = require('./IndexDB');
const Utils = require('./utils');

class LoggerModule {
	constructor({ moduleName, Logger }) {
		this.moduleName = moduleName
		this.Logger = Logger
	}
	info(message) {
		console.log(`[Info] [${this.moduleName}] ${message}`)
		this.Logger(this.moduleName, 'Info', message)
	}

	warn(message) {
		console.log(`[Warn] [${this.moduleName}] ${message}`)
		this.Logger(this.moduleName, 'Warn', message)
	}
}

class Logger {
	constructor(props) {
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

		console.log(this.ClientId)

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
			.catch((error) => {
				console.error(`${this.prefix}Error connecting to IndexedDB:`, error);
			});
	}

	initModules(modules) {
		modules.forEach((module) => {
			this[module] = new LoggerModule({ moduleName : module, Logger : this.logger.bind(this) });
		});
	}

	createTable() {
		this.dbClient
			.createTable()
			.then(() => {
				console.log(`${this.prefix}Logs table created successfully.`);
			})
			.catch((error) => {
				console.error(`${this.prefix}Error creating logs table:`, error);
			});
	}

	logger(module, level, content) {
		const data = {
			userId    : this.UserId,
			clientId  : this.ClientId,
			module    : module, 
			level     : level,
			timestamp : Utils.getFormattedDate(),
			message   : content,
			isUpload  : false,
			data      : { key : 'value' }
		}

		this.dbClient
			.insertData(data)
			.then(() => {
				console.log(`${this.prefix}Log inserted successfully.`);
			})
			.catch((error) => {
				console.error(`${this.prefix}Error inserting log:`, error);
			});
	}

	getLogs(test, successCallback, errorCallback) {
		// const condition = new Date().toISOString(); // 获取当前时间

		this.dbClient.selectData({
			userId : 'Huangliang'
		}, successCallback, errorCallback)
			.then((logs) => {
				console.log('Retrieved logs:', logs);
			})
			.catch((error) => {
				console.error('Error getting logs:', error);
			});
	}
}

window.Logger = Logger;

module.exports = Logger;
