# Logger Hub

The LoggerHub is a JavaScript library that provides logging capabilities for front-end web applications. It allows you to log different levels of messages (info, warn, debug, error) to the console, store them in IndexedDB, and retrieve them based on various filters.

## Installation

To use the Logger Library in your project, you can follow these steps:

1. Install the library using npm:

```shell
npm install logger-hub
```

2. After importing, LoggerHub will automatically be attached to the window object. In the future, support for the ES6 `import` syntax will be available.
  
```javascript
import 'logger-hub';
```

3. Create an instance of the Logger class with the desired configuration:

```javascript
/**
 * Create a new instance of Logger with configuration options.
 * - UserId: User ID for log entries (optional, default: 'UNKNOWN').
 * - ClientId: Client ID for log entries (optional, default: 'UNKNOWN').
 * - Modules: List of module names (optional).
 * - StoragePath: URL for log storage.
 * - InitSuccess: Callback function for initialization success.
 * - StoragePath: Enable upload function
 */
const Logger = new window.Logger({
  UserId: 'UserId',
  ClientId: 'ClientId',
  Modules: ['module1', 'module2'],
  StoragePath: 'http://172.17.16.130',
  InitSuccess: InitSuccess
});

function InitSuccess() {
  // Callback function executed on initialization success.
  // Logger.uploadImmediately();
}

function log() {
  // Example log entries using Logger methods.

  // Info log message for module1.
  Logger.module1.info('This is an info message');

  // Warn log message for module1.
  Logger.module1.warn('This is a warn message');

  // Debug log message for module1.
  Logger.module1.debug('This is a debug message');

  // Error log message for module1.
  Logger.module1.error('This is an error message');

  // Info log message for module1 with an object.
  Logger.module1.info('This is a message with an object', { name: 'name', age: 18 });

  // Info log message for module2.
  Logger.module2.info('This is an info message');
}

```

## Usage

If you need to manually upload logs, assuming you have configured the storage, you can call `Logger.uploadImmediately()`; to upload logs immediately.


## Contribution
Contributions to the Logger Library are welcome! If you find any issues or want to add new features, please submit a pull request.

## License
The Logger Library is released under the MIT License.