/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/IndexDB.ts":
/*!************************!*\
  !*** ./src/IndexDB.ts ***!
  \************************/
/***/ ((module) => {


var IndexedDBDatabase = /** @class */ (function () {
    function IndexedDBDatabase(databaseName, objectStoreName) {
        this.prefix = '[LogIndexedDBSDK] :';
        this.databaseName = databaseName;
        this.objectStoreName = objectStoreName;
        this.db = null;
    }
    IndexedDBDatabase.prototype.openDatabase = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = window.indexedDB.open(_this.databaseName);
            request.onerror = function (event) {
                var error = event.target.error;
                console.error("".concat(_this.prefix, " Failed to open database: ").concat(error));
                reject(error);
            };
            request.onsuccess = function (event) {
                _this.db = event.target.result;
                console.log("".concat(_this.prefix, " Open database ").concat(_this.databaseName, " successfully."));
                resolve();
            };
            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains(_this.objectStoreName)) {
                    var OS = db.createObjectStore(_this.objectStoreName, { keyPath: 'id', autoIncrement: true });
                    OS.createIndex('byId', 'id', { unique: true });
                    OS.createIndex('byTimestamp', 'timestamp');
                    OS.createIndex('byModule', 'module');
                    OS.createIndex('byUserId', 'userId');
                    OS.createIndex('byClientId', 'clientId');
                }
            };
        });
    };
    IndexedDBDatabase.prototype.executeQuery = function (request, successCallback, errorCallback) {
        var _this = this;
        request.onsuccess = function (event) {
            if (successCallback) {
                successCallback(event.target.result);
            }
        };
        request.onerror = function (event) {
            console.error("".concat(_this.prefix, " Error executing query: ").concat(event.target.error));
            if (errorCallback) {
                errorCallback(event.target.error);
            }
        };
    };
    IndexedDBDatabase.prototype.createTransaction = function (mode) {
        var transaction = this.db.transaction(this.objectStoreName, mode);
        return transaction.objectStore(this.objectStoreName);
    };
    IndexedDBDatabase.prototype.createTable = function (successCallback, errorCallback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = _this.openDatabase();
            request.then(function () {
                resolve();
                if (successCallback) {
                    successCallback();
                }
            }).catch(function (error) {
                reject(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
        });
    };
    IndexedDBDatabase.prototype.insertData = function (data, successCallback, errorCallback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var objectStore = _this.createTransaction('readwrite');
            var request = objectStore.add(data);
            _this.executeQuery(request, function () {
                console.log("".concat(_this.prefix, " Data inserted successfully."));
                resolve();
                if (successCallback) {
                    successCallback();
                }
            }, function (error) {
                reject(error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
        });
    };
    IndexedDBDatabase.prototype.selectData = function (condition, successCallback, errorCallback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var objectStore = _this.createTransaction('readonly');
            var results = [];
            var request = objectStore.openCursor();
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var logEntry = cursor.value;
                    if ((!condition.module || logEntry.module === condition.module) &&
                        (!condition.level || logEntry.level === condition.level) &&
                        (!condition.userId || logEntry.userId === condition.userId) &&
                        (!condition.clientId || logEntry.clientId === condition.clientId)) {
                        results.push(logEntry);
                    }
                    cursor.continue();
                }
                else {
                    console.log("".concat(_this.prefix, " Selected data:"), results);
                    resolve(results);
                    if (successCallback) {
                        successCallback(results);
                    }
                }
            };
            request.onerror = function (event) {
                reject(event.target.error);
                if (errorCallback) {
                    errorCallback(event.target.error);
                }
            };
        });
    };
    IndexedDBDatabase.prototype.updateData = function (condition, newData, successCallback, errorCallback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var objectStore = _this.createTransaction('readwrite');
            var request = objectStore.openCursor(IDBKeyRange.only(condition));
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var updateRequest = cursor.update(newData);
                    _this.executeQuery(updateRequest, function () {
                        console.log("".concat(_this.prefix, " Data updated successfully."));
                        resolve();
                        if (successCallback) {
                            successCallback();
                        }
                    }, function (error) {
                        reject(error);
                        if (errorCallback) {
                            errorCallback(error);
                        }
                    });
                }
                else {
                    console.log("".concat(_this.prefix, " No data found for update."));
                    resolve();
                    if (successCallback) {
                        successCallback();
                    }
                }
            };
            request.onerror = function (event) {
                reject(event.target.error);
                if (errorCallback) {
                    errorCallback(event.target.error);
                }
            };
        });
    };
    IndexedDBDatabase.prototype.deleteData = function (condition, successCallback, errorCallback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var objectStore = _this.createTransaction('readwrite');
            var request = objectStore.openCursor(IDBKeyRange.only(condition));
            request.onsuccess = function (event) {
                var cursor = event.target.result;
                if (cursor) {
                    var deleteRequest = cursor.delete();
                    _this.executeQuery(deleteRequest, function () {
                        console.log("".concat(_this.prefix, " Data deleted successfully."));
                        resolve();
                        if (successCallback) {
                            successCallback();
                        }
                    }, function (error) {
                        reject(error);
                        if (errorCallback) {
                            errorCallback(error);
                        }
                    });
                }
                else {
                    console.log("".concat(_this.prefix, " No data found for delete."));
                    resolve();
                    if (successCallback) {
                        successCallback();
                    }
                }
            };
            request.onerror = function (event) {
                reject(event.target.error);
                if (errorCallback) {
                    errorCallback(event.target.error);
                }
            };
        });
    };
    return IndexedDBDatabase;
}());
module.exports = IndexedDBDatabase;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var IndexDB_1 = __importDefault(__webpack_require__(/*! ./IndexDB */ "./src/IndexDB.ts"));
var utils_1 = __importDefault(__webpack_require__(/*! ./utils */ "./src/utils.ts"));
var LoggerModule = /** @class */ (function () {
    function LoggerModule(_a) {
        var moduleName = _a.moduleName, Logger = _a.Logger;
        this.moduleName = moduleName;
        this.Logger = Logger;
    }
    LoggerModule.prototype.info = function (message) {
        console.log("[Info] [".concat(this.moduleName, "] ").concat(message));
        this.Logger(this.moduleName, 'Info', message);
    };
    LoggerModule.prototype.warn = function (message) {
        console.log("[Warn] [".concat(this.moduleName, "] ").concat(message));
        this.Logger(this.moduleName, 'Warn', message);
    };
    return LoggerModule;
}());
var Logger = /** @class */ (function () {
    function Logger(props) {
        var _a = props.CollectionName, CollectionName = _a === void 0 ? 'logs' : _a, _b = props.DatabaseName, DatabaseName = _b === void 0 ? 'MyDatabase' : _b, _c = props.ObjectStoreName, ObjectStoreName = _c === void 0 ? 'logs' : _c, _d = props.UserId, UserId = _d === void 0 ? 'UNKNOWN' : _d, _e = props.ClientId, ClientId = _e === void 0 ? 'UNKNOWN' : _e, _f = props.Modules, Modules = _f === void 0 ? [] : _f;
        this.CollectionName = CollectionName;
        this.DatabaseName = DatabaseName;
        this.ObjectStoreName = ObjectStoreName;
        this.UserId = UserId;
        this.ClientId = ClientId;
        console.log(this.ClientId);
        this.prefix = '[LogSystem] : ';
        console.log("".concat(this.prefix, "Logger initialized."));
        this.connect();
        this.initModules(Modules);
    }
    Logger.prototype.connect = function () {
        var _this = this;
        this.dbClient = new IndexDB_1.default(this.DatabaseName, this.ObjectStoreName);
        this.dbClient
            .openDatabase()
            .then(function () {
            console.log("".concat(_this.prefix, "Connected to IndexedDB."));
            _this.createTable();
        })
            .catch(function (error) {
            console.error("".concat(_this.prefix, "Error connecting to IndexedDB:"), error);
        });
    };
    Logger.prototype.initModules = function (modules) {
        var _this = this;
        modules.forEach(function (module) {
            _this[module] = new LoggerModule({ moduleName: module, Logger: _this.logger.bind(_this) });
            // this[module] = new LoggerModule({ moduleName: module, Logger: this.logger.bind(this) });
        });
    };
    Logger.prototype.createTable = function () {
        var _this = this;
        this.dbClient
            .createTable()
            .then(function () {
            console.log("".concat(_this.prefix, "Logs table created successfully."));
        })
            .catch(function (error) {
            console.error("".concat(_this.prefix, "Error creating logs table:"), error);
        });
    };
    Logger.prototype.logger = function (module, level, content) {
        var _this = this;
        var data = {
            userId: this.UserId,
            clientId: this.ClientId,
            module: module,
            level: level,
            timestamp: utils_1.default.getFormattedDate(),
            message: content,
            isUpload: false,
            data: { key: 'value' }
        };
        this.dbClient
            .insertData(data)
            .then(function () {
            console.log("".concat(_this.prefix, "Log inserted successfully."));
        })
            .catch(function (error) {
            console.error("".concat(_this.prefix, "Error inserting log:"), error);
        });
    };
    Logger.prototype.getLogs = function (test, successCallback, errorCallback) {
        // const condition = new Date().toISOString(); // 获取当前时间
        var _this = this;
        this.dbClient.selectData({
            userId: 'Huangliang'
        }, successCallback, errorCallback)
            .then(function (logs) {
            console.log("".concat(_this.prefix, "Logs retrieved successfully:"), logs);
        })
            .catch(function (error) {
            console.error("".concat(_this.prefix, "Error retrieving logs:"), error);
        });
    };
    return Logger;
}());
window.Logger = Logger;
exports["default"] = Logger;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((module) => {


var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getFormattedDate = function () {
        var currentDate = new Date();
        var year = currentDate.getFullYear();
        var month = String(currentDate.getMonth() + 1).padStart(2, '0');
        var day = String(currentDate.getDate()).padStart(2, '0');
        var hours = String(currentDate.getHours()).padStart(2, '0');
        var minutes = String(currentDate.getMinutes()).padStart(2, '0');
        var seconds = String(currentDate.getSeconds()).padStart(2, '0');
        var milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');
        var formattedDate = "".concat(year, "-").concat(month, "-").concat(day, " ").concat(hours, ":").concat(minutes, ":").concat(seconds, ".").concat(milliseconds);
        return formattedDate;
    };
    Utils.generateRandomString = function (length) {
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
    };
    return Utils;
}());
module.exports = Utils;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=bundle.js.map