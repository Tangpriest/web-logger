class IndexedDBDatabase {
	constructor(databaseName, objectStoreName) {
		this.prefix = '[LogIndexedDBSDK] :';
		this.databaseName = databaseName;
		this.objectStoreName = objectStoreName;
		this.db = null;
	}

	openDatabase() {
		return new Promise((resolve, reject) => {
			const request = window.indexedDB.open(this.databaseName);

			request.onerror = (event) => {
				console.error(`${this.prefix} Failed to open database: ${event.target.error}`);
				reject(event.target.error);
			};

			request.onsuccess = (event) => {
				this.db = event.target.result;
				console.log(`${this.prefix} Open database ${this.databaseName} successfully.`);
				resolve();
			};

			request.onupgradeneeded = (event) => {
				const db = event.target.result;

				if (!db.objectStoreNames.contains(this.objectStoreName)) {

					const OS = db.createObjectStore(this.objectStoreName, { keyPath : 'id', autoIncrement : true })

					OS.createIndex('byId', 'id', { unique : true })
					OS.createIndex('byTimestamp', 'timestamp')
					OS.createIndex('byModule', 'module')
					OS.createIndex('byUserId', 'userId')
					OS.createIndex('byClientId', 'clientId')
				}
			};
		});
	}

	executeQuery(request, successCallback, errorCallback) {
		request.onsuccess = (event) => {
			if (successCallback) {
				successCallback(event.target.result);
			}
		};

		request.onerror = (event) => {
			console.error(`${this.prefix} Error executing query: ${event.target.error}`);
			if (errorCallback) {
				errorCallback(event.target.error);
			}
		};
	}

	createTransaction(mode) {
		const transaction = this.db.transaction(this.objectStoreName, mode);
		
		return transaction.objectStore(this.objectStoreName);
	}

	createTable(successCallback, errorCallback) {

		return new Promise((resolve, reject) => {
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

	insertData(data, successCallback, errorCallback) {
		return new Promise((resolve, reject) => {
			const objectStore = this.createTransaction('readwrite');
			const request = objectStore.add(data);

			this.executeQuery(request, () => {
				console.log(`${this.prefix} Data inserted successfully.`);
				resolve();

				if (successCallback) {
					successCallback();
				}
			}, (error) => {
				reject(error);

				if (errorCallback) {
					errorCallback(error);
				}
			});
		});
	}

	selectData(condition, successCallback, errorCallback) {
		return new Promise((resolve, reject) => {
			const objectStore = this.createTransaction('readonly');
			const results = [];
    
			const request = objectStore.openCursor();
  
			request.onsuccess = (event) => {
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
  
			request.onerror = (event) => {
				reject(event.target.error);
  
				if (errorCallback) {
					errorCallback(event.target.error);
				}
			};
		});
	}
  
	updateData(condition, newData, successCallback, errorCallback) {
		return new Promise((resolve, reject) => {
			const objectStore = this.createTransaction('readwrite');
			const request = objectStore.openCursor(IDBKeyRange.only(condition));

			request.onsuccess = (event) => {
				const cursor = event.target.result;

				if (cursor) {
					const updateRequest = cursor.update(newData);

					this.executeQuery(updateRequest, () => {
						console.log(`${this.prefix} Data updated successfully.`);
						resolve();

						if (successCallback) {
							successCallback();
						}
					}, (error) => {
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

			request.onerror = (event) => {
				reject(event.target.error);

				if (errorCallback) {
					errorCallback(event.target.error);
				}
			};
		});
	}

	deleteData(condition, successCallback, errorCallback) {
		return new Promise((resolve, reject) => {
			const objectStore = this.createTransaction('readwrite');
			const request = objectStore.openCursor(IDBKeyRange.only(condition));

			request.onsuccess = (event) => {
				const cursor = event.target.result;

				if (cursor) {
					const deleteRequest = cursor.delete();

					this.executeQuery(deleteRequest, () => {
						console.log(`${this.prefix} Data deleted successfully.`);
						resolve();

						if (successCallback) {
							successCallback();
						}
					}, (error) => {
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

			request.onerror = (event) => {
				reject(event.target.error);

				if (errorCallback) {
					errorCallback(event.target.error);
				}
			};
		});
	}
}

module.exports = IndexedDBDatabase;
