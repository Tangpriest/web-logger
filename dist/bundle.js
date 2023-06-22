/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/IndexDB.ts":
/*!************************!*\
  !*** ./src/IndexDB.ts ***!
  \************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var utils_1 = __importDefault(__webpack_require__(/*! ./utils */ "./src/utils.ts"));
var IndexedDBDatabase = /** @class */ (function () {
    function IndexedDBDatabase(databaseName, objectStoreName, Console) {
        this.prefix = '[LogDBSDK]  : ';
        this.databaseName = databaseName;
        this.objectStoreName = objectStoreName;
        this.db = null;
        this.Console = Console;
    }
    IndexedDBDatabase.prototype.openDatabase = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = window.indexedDB.open(_this.databaseName);
            request.onerror = function (event) {
                var error = event.target.error;
                // this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix} Failed to open database: ${error}`);
                reject(error);
            };
            request.onsuccess = function (event) {
                _this.db = event.target.result;
                // this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix} Open database ${this.databaseName} successfully.`);
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
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, " Error executing query: ").concat(event.target.error));
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
                // this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Data inserted successfully.`);
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
            _this.Console && console.log(condition);
            var request;
            if (condition && condition.startTime && condition.endTime) {
                request = objectStore.index('byTimestamp').openCursor(IDBKeyRange.bound(condition.startTime, condition.endTime));
            }
            else {
                request = objectStore.openCursor();
            }
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
                    _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, " Selected data:"), results);
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
                        _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, " Data updated successfully."));
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
                    _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, " No data found for update."));
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
                        _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, " Data deleted successfully."));
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
                    _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, " No data found for delete."));
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
        var moduleName = _a.moduleName, Logger = _a.Logger, Console = _a.Console;
        this.moduleName = moduleName;
        this.Logger = Logger;
        this.Console = Console;
        this.prefix = '[LogModule] : ';
    }
    LoggerModule.prototype.info = function (message) {
        var timestamp = utils_1.default.getFormattedDate();
        // this.Console && console.log(`${timestamp} - ${this.prefix}[Info] [${this.moduleName}] ${message}`);
        this.Console && console.log("".concat(timestamp, " - ").concat(this.prefix, "[Info] [").concat(this.moduleName, "] ").concat(message));
        this.Logger(this.moduleName, 'Info', message);
    };
    LoggerModule.prototype.warn = function (message) {
        var timestamp = utils_1.default.getFormattedDate();
        // this.Console && console.log(`${timestamp} - ${this.prefix}[Warn] [${this.moduleName}] ${message}`);
        this.Console && console.log("%c".concat(timestamp, " - ").concat(this.prefix, "[Warn] [").concat(this.moduleName, "] ").concat(message), 'color: orange');
        this.Logger(this.moduleName, 'Warn', message);
    };
    LoggerModule.prototype.error = function (message) {
        var timestamp = utils_1.default.getFormattedDate();
        // this.Console && console.log(`${timestamp} - ${this.prefix}[Error] [${this.moduleName}] ${message}`);
        this.Console && console.log("%c".concat(timestamp, " - ").concat(this.prefix, "[Error] [").concat(this.moduleName, "] ").concat(message), 'color: red');
        this.Logger(this.moduleName, 'Error', message);
    };
    LoggerModule.prototype.debug = function (message) {
        var timestamp = utils_1.default.getFormattedDate();
        // this.Console && console.log(`${timestamp} - ${this.prefix}[Debug] [${this.moduleName}] ${message}`);
        this.Console && console.log("%c".concat(timestamp, " - ").concat(this.prefix, "[Debug] [").concat(this.moduleName, "] ").concat(message), 'color: blue');
        this.Logger(this.moduleName, 'Debug', message);
    };
    return LoggerModule;
}());
var Logger = /** @class */ (function () {
    function Logger(props) {
        var _a = props.CollectionName, CollectionName = _a === void 0 ? 'logs' : _a, _b = props.DatabaseName, DatabaseName = _b === void 0 ? 'WEB_LOGS' : _b, _c = props.ObjectStoreName, ObjectStoreName = _c === void 0 ? 'logs' : _c, _d = props.UserId, UserId = _d === void 0 ? 'UNKNOWN' : _d, _e = props.ClientId, ClientId = _e === void 0 ? 'UNKNOWN' : _e, _f = props.Modules, Modules = _f === void 0 ? [] : _f, _g = props.Mode, Mode = _g === void 0 ? 'development' : _g;
        this.CollectionName = CollectionName;
        this.DatabaseName = DatabaseName;
        this.ObjectStoreName = ObjectStoreName;
        this.UserId = UserId;
        this.ClientId = ClientId;
        this.Mode = Mode;
        this.Console = this.Mode === 'development';
        this.prefix = '[LogSystem] : ';
        this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(this.prefix, "Logger initialized."));
        if (!this.Console) {
            console.log('Logger Mode is production, no logs will be printed to console.');
        }
        this.connect();
        this.initModules(Modules);
    }
    Logger.prototype.connect = function () {
        var _this = this;
        this.dbClient = new IndexDB_1.default(this.DatabaseName, this.ObjectStoreName, this.Console);
        this.dbClient
            .openDatabase()
            .then(function () {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Connected to IndexedDB."));
            _this.createTable();
        })
            .catch(function (error) {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Error connecting to IndexedDB:"), error);
        });
    };
    Logger.prototype.initModules = function (modules) {
        var _this = this;
        modules.forEach(function (module) {
            _this[module] = new LoggerModule({ moduleName: module, Logger: _this.writeLogEntry.bind(_this), Console: _this.Console });
        });
    };
    Logger.prototype.createTable = function () {
        var _this = this;
        this.dbClient
            .createTable()
            .then(function () {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Logs table created successfully."));
        })
            .catch(function (error) {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Error creating logs table:"), error);
        });
    };
    Logger.prototype.writeLogEntry = function (module, level, content, timestamp) {
        var _this = this;
        var data = {
            userId: this.UserId,
            clientId: this.ClientId,
            module: module,
            level: level,
            timestamp: timestamp,
            message: content,
            isUpload: false,
            data: { key: 'value' }
        };
        this.dbClient
            .insertData(data)
            .then(function () {
            // this.Console && console.log(`${Utils.getFormattedDate()} - ${this.prefix}Log inserted successfully.`);
        })
            .catch(function (error) {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Error inserting log:"), error);
        });
    };
    Logger.prototype.getFilteredLogEntries = function (condition, successCallback, errorCallback) {
        var _this = this;
        this.dbClient.selectData(condition = {
            startTime: utils_1.default.getFormattedDate('1970-01-01 00:00:00.000'),
            endTime: utils_1.default.getFormattedDate()
        }, successCallback, errorCallback)
            .then(function (logs) {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Logs retrieved successfully:"), logs);
        })
            .catch(function (error) {
            _this.Console && console.log("".concat(utils_1.default.getFormattedDate(), " - ").concat(_this.prefix, "Error retrieving logs:"), error);
        });
    };
    Logger.prototype.updateConfig = function (config) {
        this.UserId = config.userId || this.UserId;
        this.ClientId = config.clientId || this.ClientId;
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
    Utils.getFormattedDate = function (time) {
        var transactionDate = time
            ? new Date(time)
            : new Date();
        var currentDate = transactionDate;
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