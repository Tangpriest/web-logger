import { filterCondition } from './type';
class IndexedDBDatabase {
	private prefix: string;
	private databaseName: string;
	private objectStoreName: string;
	private db: any;

	constructor(databaseName: string, objectStoreName: string) {
		this.prefix = '[LogIndexedDBSDK] :';
		this.databaseName = databaseName;
		this.objectStoreName = objectStoreName;
		this.db = null;
	}

	openDatabase() {
		return new Promise<void>((resolve, reject) => {
			const request = window.indexedDB.open(this.databaseName);

			request.onerror = (event) => {
				const error = (event.target as IDBOpenDBRequest).error;

				console.error(`${this.prefix} Failed to open database: ${error}`);
				reject(error);
			};

			request.onsuccess = (event) => {
				this.db = (event.target as IDBOpenDBRequest).result
				console.log(`${this.prefix} Open database ${this.databaseName} successfully.`);
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				if (!db.objectStoreNames.contains(this.objectStoreName)) {

					const OS = db.createObjectStore(this.objectStoreName, { keyPath : 'id', autoIncrement : true });

					OS.createIndex('byId', 'id', { unique : true });
					OS.createIndex('byTimestamp', 'timestamp');
					OS.createIndex('byModule', 'module');
					OS.createIndex('byUserId', 'userId');
					OS.createIndex('byClientId', 'clientId');
				}
			};
		});
	}

	executeQuery(request: any, successCallback: any, errorCallback: any) {
		request.onsuccess = (event: any) => {
			if (successCallback) {
				successCallback(event.target.result);
			}
		};

		request.onerror = (event: any) => {
			console.error(`${this.prefix} Error executing query: ${event.target.error}`);
			if (errorCallback) {
				errorCallback(event.target.error);
			}
		};
	}

	createTransaction(mode: string) {
		const transaction = this.db.transaction(this.objectStoreName, mode);

		return transaction.objectStore(this.objectStoreName);
	}

	createTable(successCallback?: any, errorCallback?: any) {

		return new Promise<void>((resolve, reject) => {
			const request = this.openDatabase();

			request.then(() => {
				resolve();

				if (successCallback) {
					successCallback();
				}
			}).catch((error) => {
				reject(error);

				if (errorCallback) {
					errorCallback(error);
				}
			});
		});
	}

	insertData(data: any, successCallback?: any, errorCallback?: any) {
		return new Promise<void>((resolve, reject) => {
			const objectStore = this.createTransaction('readwrite');
			const request = objectStore.add(data);

			this.executeQuery(request, () => {
				console.log(`${this.prefix} Data inserted successfully.`);
				resolve();

				if (successCallback) {
					successCallback();
				}
			}, (error : any) => {
				reject(error);

				if (errorCallback) {
					errorCallback(error);
				}
			});
		});
	}

	selectData(condition: filterCondition, successCallback: any, errorCallback: any) {
		return new Promise<any[]>((resolve, reject) => {
			const objectStore = this.createTransaction('readonly');
			const results: any[] = [];

			console.log(condition)
			let request

			if (condition && condition.startTime && condition.endTime) {
				request = objectStore.index('byTimestamp').openCursor(IDBKeyRange.bound(condition.startTime, condition.endTime));
			}
			else {
				request = objectStore.openCursor();
			}

			request.onsuccess = (event: any) => {
				const cursor = event.target.result;

				if (cursor) {
					const logEntry = cursor.value;

					if (
						(!condition.module || logEntry.module === condition.module) &&
						(!condition.level || logEntry.level === condition.level) &&
						(!condition.userId || logEntry.userId === condition.userId) &&
						(!condition.clientId || logEntry.clientId === condition.clientId)
					) {
						results.push(logEntry);
					}

					cursor.continue();
				}
				else {
					console.log(`${this.prefix} Selected data:`, results);
					resolve(results);

					if (successCallback) {
						successCallback(results);
					}
				}
			};

			request.onerror = (event: any) => {
				reject(event.target.error);

				if (errorCallback) {
					errorCallback(event.target.error);
				}
			};
		});
	}

	updateData(condition: any, newData: any, successCallback: any, errorCallback: any) {
		return new Promise<void>((resolve, reject) => {
			const objectStore = this.createTransaction('readwrite');
			const request = objectStore.openCursor(IDBKeyRange.only(condition));

			request.onsuccess = (event: any) => {
				const cursor = event.target.result;

				if (cursor) {
					const updateRequest = cursor.update(newData);

					this.executeQuery(updateRequest, () => {
						console.log(`${this.prefix} Data updated successfully.`);
						resolve();

						if (successCallback) {
							successCallback();
						}
					}, (error:any) => {
						reject(error);

						if (errorCallback) {
							errorCallback(error);
						}
					});
				}
				else {
					console.log(`${this.prefix} No data found for update.`);
					resolve();

					if (successCallback) {
						successCallback();
					}
				}
			};

			request.onerror = (event: any) => {
				reject(event.target.error);

				if (errorCallback) {
					errorCallback(event.target.error);
				}
			};
		});
	}

	deleteData(condition: any, successCallback: any, errorCallback: any) {
		return new Promise<void>((resolve, reject) => {
			const objectStore = this.createTransaction('readwrite');
			const request = objectStore.openCursor(IDBKeyRange.only(condition));

			request.onsuccess = (event: any) => {
				const cursor = event.target.result;

				if (cursor) {
					const deleteRequest = cursor.delete();

					this.executeQuery(deleteRequest, () => {
						console.log(`${this.prefix} Data deleted successfully.`);
						resolve();

						if (successCallback) {
							successCallback();
						}
					}, (error:any) => {
						reject(error);

						if (errorCallback) {
							errorCallback(error);
						}
					});
				}
				else {
					console.log(`${this.prefix} No data found for delete.`);
					resolve();

					if (successCallback) {
						successCallback();
					}
				}
			};

			request.onerror = (event: any) => {
				reject(event.target.error);

				if (errorCallback) {
					errorCallback(event.target.error);
				}
			};
		});
	}
}

export = IndexedDBDatabase;
