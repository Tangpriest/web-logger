# Logger Library

The Logger Library is a JavaScript library that provides logging capabilities for front-end web applications. It allows you to log different levels of messages (info, warn, debug, error) to the console, store them in IndexedDB, and retrieve them based on various filters.

## Installation

To use the Logger Library in your project, you can follow these steps:

1. Install the library using npm:

```shell
npm install logger-library
```

2. Import the Logger class into your project:
  
```javascript
import Logger from 'logger-library';
```

3.Create an instance of the Logger class with the desired configuration:

```javascript
const logger = new Logger({
  CollectionName: 'logs',        // Name of the collection/table in IndexedDB (optional, default: 'logs')
  DatabaseName: 'WEB_LOGS',      // Name of the IndexedDB database (optional, default: 'WEB_LOGS')
  ObjectStoreName: 'logs',       // Name of the object store in IndexedDB (optional, default: 'logs')
  UserId: 'UNKNOWN',             // User ID for log entries (optional, default: 'UNKNOWN')
  ClientId: 'UNKNOWN',           // Client ID for log entries (optional, default: 'UNKNOWN')
  Modules: ['module1', 'module2'],  // List of module names (optional)
  Mode: 'development',           // Mode of the logger ('development' or 'production') (optional, default: 'development')
});

```

## Usage

Once you have created an instance of the Logger class, you can use it to log messages and perform other logging operations. Here's how you can use the library:

Logging Messages
You can log messages at different levels using the methods provided by the LoggerModule class. The supported log levels are info, warn, debug, and error. Here's an example of logging messages at different levels:

```javascript
logger.module1.info('This is an informational message.');
logger.module2.warn('This is a warning message.');
logger.module1.error('This is an error message.');
logger.module2.debug('This is a debug message.');
```
Retrieving Log Entries
You can retrieve log entries from the IndexedDB based on various filters using the getFilteredLogEntries method. Here's an example of retrieving log entries:

```javascript
const condition = {
  module: 'module1',      // Filter by module name (optional)
  level: 'info',          // Filter by log level (optional)
  userId: '123456',       // Filter by user ID (optional)
  clientId: '123456',     // Filter by client ID (optional)
  startTime: '2023-06-22 15:30:00',  // Filter by start time (optional)
  endTime: '2023-06-22 15:35:00'     // Filter by end time (optional)
};

logger.getFilteredLogEntries(condition, successCallback, errorCallback);
```

The successCallback is a function that will be called with the retrieved log entries as an argument, and the errorCallback is a function that will be called if an error occurs during the retrieval process.

Updating Configuration
You can update the configuration of the logger dynamically using the updateConfig method. Here's an example of updating the configuration:

```javascript
logger.updateConfig({
  // Specify updated configuration options here
});
```

## Contribution
Contributions to the Logger Library are welcome! If you find any issues or want to add new features, please submit a pull request.

## License
The Logger Library is released under the MIT License.