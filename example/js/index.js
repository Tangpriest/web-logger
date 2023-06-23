const Logger = new window.Logger({
	CollectionName  : 'logs', // Name of the collection/table in IndexedDB (optional, default: 'logs')
	DatabaseName    : 'WEB_LOGS', // Name of the IndexedDB database (optional, default: 'WEB_LOGS')
	ObjectStoreName : 'logs', // Name of the object store in IndexedDB (optional, default: 'logs')
	UserId          : 'MyUserId', // User ID for log entries (optional, default: 'UNKNOWN')
	ClientId        : 'MyClientId', // Client ID for log entries (optional, default: 'UNKNOWN')
	Modules         : [ 'module1', 'module2' ], // List of module names (optional)
	Mode            : 'development' // Mode of the logger (optional, default: 'development')
})

// Logger.module1.info('This is a test message')

function writeLog() {
	Logger.module1.info('This is a test message')
	Logger.module1.debug('This is a test message')
	Logger.module1.warn('This is a test message')
	Logger.module1.error('This is a test message')
}

function getLog() {
	Logger.getFilteredLogEntries({}, function(result) {
		console.log(result)
	})
}