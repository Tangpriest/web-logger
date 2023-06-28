import axios from 'axios';
import IndexedDBDatabase from './lib/db';
import LoggerModule from './lib/module';
import OSS from './lib/storeage/oss';
import { FilterProps, LoggerProps } from './lib/type';
import Utils from './lib/utils';

class Logger {
	private DatabaseName: string;
	private ObjectStoreName: string;
	private UserId: string;
	private ClientId: string;
	private prefix: string;
	private dbClient!: IndexedDBDatabase;
	private Terminal : string;
	private StoragePath : string;
	private UploadIntervalTimes : number;
	[key: string]: any; 
	
	constructor(props: LoggerProps) {
		const {
			DatabaseName = 'WEB_LOGS',
			UserId = 'UNKNOWN',
			ClientId = 'UNKNOWN',
			Modules = [],
			Mode = 'development',
			Terminal = 'web',
			StoragePath,
			UploadIntervalTimes = 1000 * 60 * 30
		} = props;

		this.props = props;

		this.DatabaseName = DatabaseName;
		this.ObjectStoreName = 'logs';
		this.UserId = UserId;
		this.ClientId = ClientId;
		this.Terminal = Terminal;
		
		this.Mode = Mode;
		this.Console = this.Mode === 'development'
		this.prefix = '[LogSystem] : ';

		this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Logger initialized.`);
		this.initModules(Modules);
		
		this.connect();

		this.StoragePath = StoragePath;
		this.UploadIntervalTimes = UploadIntervalTimes;

		if (this.StoragePath) {
			this.OSSClient = new OSS({ StroagePath : this.StoragePath });
			this.createInterval();
		}
	
		if (!this.Console) {
			console.log('Logger Mode is production, no logs will be printed to console.')
		}
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
				if (this.StoragePath) {
					this.OSSClient.initClient(() => {
						this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}OSS client initialized.`);
						if (this.props.InitSuccess) {
							this.props.InitSuccess()
						}
					})
				}
			})
			.catch((error: any) => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error creating logs table:`, error);
			});
	}

	writeLogEntry(module: string, level: string, content: string, timestamp : string, extra?:any) {

		const data = {
			userId    : this.UserId,
			clientId  : this.ClientId,
			module    : module,
			level     : level,
			timestamp : timestamp,
			message   : content,
			isUpload  : false,
			data      : extra || {}
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

		if (!condition.startTime) {
			condition.startTime = '1970-01-01 00:00:00.000'
		}
		if (!condition.endTime) {
			condition.endTime = Utils.getFormattedDate()
		}

		this.dbClient.selectData(condition, successCallback, errorCallback)
	}

	updateConfig(config : FilterProps) {
		this.UserId = config.userId || this.UserId;
		this.ClientId = config.clientId || this.ClientId;
	}

	createInterval() {
		if (!this.StoragePath) {
			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}StoragePath is not set, no logs will be uploaded.`);
		}

		this.UploadInterval = setInterval(() => { this.getUploadLogs() }, this.UploadIntervalTimes)
	}

	getUploadLogs() {

		const currentTime = Utils.getFormattedDate()
		const condition = {
			startTime : '1970-01-01 00:00:00.000',
			endTime   : currentTime
		}

		this.getFilteredLogEntries(condition, (logs : any) => {
			if (logs.length > 0) {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Logs:`, logs.length);
				const fileName = `${this.UserId}-${this.Terminal}-${Utils.getYYYYMMDDHHMMSS()}.log`
				const path = `${this.UserId}/${Utils.getYYYYMMDD()}/${fileName}`

				this.uploadLogs(logs, path, fileName)
			}
		}, (error : any) => {
			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error fetching logs:`, error);
		})
	}

	async uploadLogs(logs : any, path : string, fileName : string) {
		try {
			const content = this.formatLog(logs)

			await this.OSSClient.upload(content, path)

			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}${path} uploaded successfully.`);
			const deleteKeys = logs.map((log : any) => log.id)	

			await this.dbClient.deleteMultipleData(deleteKeys, () => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}${logs.length} Logs deleted successfully from db.`);
			}, (error: any) => {
				this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error deleting logs from db:`, error);
			});

			this.uploadDone(path, fileName)
		}
		catch (error) {
			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Error uploading logs:`, error);
		}
	}

	uploadImmediately() {

		if (this.StoragePath) {
			this.getUploadLogs()
		}
		else {
			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}StoragePath is not set, no logs will be uploaded.`);
		}
	}

	formatLog(logs : any) {

		const UserInfo = (info:any) => JSON.stringify({ UserId : info.userId, ClientId : info.clientId })
		const loggerContent = logs.map((log : any) => {
			return `${log.timestamp} - [${log.module}] -  [${log.level}] - ${log.message} - userInfo : ${UserInfo(log)} extra : ${JSON.stringify(log.data)} \n`
		})

		return loggerContent
	}

	async uploadDone(path : string, fileName : string) {
		const OssConfig = this.OSSClient.getConfig()
		const data = {
			filename    : fileName,
			path        : path,
			storageType : 'oss',
			bucket      : OssConfig.bucket,
			username    : this.UserId,
			displayname : this.ClientId,
			terminal    : this.Terminal
		}

		const uploadDoneUrl = `${this.StoragePath}/app/v1/logger/upload/done`

		const response = await axios.post(uploadDoneUrl, data)

		if (response.data.code === 0) {
			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Upload done successfully.`);
		}
		else {
			this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Upload done failed.`);
		}
	}
}

declare global {
  interface Window {
    Logger: typeof Logger;
  }
}

window.Logger = Logger;

export default Logger;
