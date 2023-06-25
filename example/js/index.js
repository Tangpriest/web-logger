const Logger = new window.Logger({
	UserId      : '黄亮', // User ID for log entries (optional, default: 'UNKNOWN')
	ClientId    : 'huangliang-web', // Client ID for log entries (optional, default: 'UNKNOWN')
	Modules     : [ 'module1', 'module2' ], // List of module names (optional)
	StoragePath : 'http://172.17.16.130/app/v1/logger/upload/info',
	InitSuccess : InitSuccess
})

function InitSuccess() {
	//

	// Logger.uploadImmediately()
}

// Logger.module1.info('This is a test message')

function writeLog() {
	Logger.module1.info('This is a test message', { age : 19 })
	Logger.module1.debug('This is a test message', [ { a : 1 }, { b : 2 } ])
	// Logger.debug('This is a test message', [ { a : 1 }, { b : 2 } ])
	// Logger.debug('This is a test message', [ { a : 1 }, { b : 2 } ])
	// Logger.debug('This is a test message', [ { a : 1 }, { b : 2 } ])
	// Logger.debug('This is a test message', [ { a : 1 }, { b : 2 } ])
}

function getLog() {
	Logger.getFilteredLogEntries({
		
	}, function(result) {
		console.log(result)
	})
}