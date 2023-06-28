/**
 * Create a new instance of Logger with configuration options.
 * - UserId: User ID for log entries (optional, default: 'UNKNOWN').
 * - ClientId: Client ID for log entries (optional, default: 'UNKNOWN').
 * - Modules: List of module names (optional).
 * - StoragePath: URL for log storage.
 * - InitSuccess: Callback function for initialization success.
 */
const Logger = new window.Logger({
	UserId      : '周承',
	ClientId    : 'ZhouCheng',
	Modules     : [ 'User', 'Pay' ],
	StoragePath : 'http://172.17.16.164',
	InitSuccess : InitSuccess
});

function InitSuccess() {
	// Callback function executed on initialization success.
	// Logger.uploadImmediately();
}

function log() {
	// Example log entries using Logger methods.

	// Info log message for module1.
	Logger.User.info('This is an info message');

	// Warn log message for module1.
	Logger.User.warn('This is a warn message');

	// Debug log message for module1.
	Logger.User.debug('This is a debug message');

	// Error log message for module1.
	Logger.Pay.error('This is an error message');

	// Info log message for module1 with an object.
	Logger.Pay.info('This is a message with an object', { name : 'name', age : 18 });

	// Info log message for module2.
	Logger.Pay.info('This is an info message', [ 'a', 'b', 'c' ]);

}

function upload() {
	// Upload all log entries.
	Logger.uploadImmediately();
}
