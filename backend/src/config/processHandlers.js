import logger from '../utils/logger.js'; // Adjust path to your logger

export const initProcessHandlers = (server) => {
    // 1. Catch Unhandled Promise Rejections
    process.on('unhandledRejection', (reason) => {
        logger.error('Unhandled Rejection detected:', reason);
        // Throwing forces it into uncaughtException for a clean shutdown
        throw reason;
    });

    // 2. Catch Synchronous Uncaught Exceptions
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception thrown:', error);
        gracefulShutdown(server, 1);
    });

    // 3. Handle OS Signals (Docker / PM2 / Kubernetes restarts)
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received. Initiating graceful shutdown...');
        gracefulShutdown(server, 0);
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT (Ctrl+C) received. Shutting down...');
        gracefulShutdown(server, 0);
    });
};

const gracefulShutdown = (server, exitCode = 0) => {
    if (server) {
        // Stop accepting new HTTP requests
        server.close(async () => {
            try {
                logger.info('HTTP server closed. Cleaning up resources...');
                // Add DB pool cleanup here if needed: await pool.end();
                process.exit(exitCode);
            } catch (err) {
                logger.error('Error during cleanup:', err);
                process.exit(1);
            }
        });
    } else {
        process.exit(exitCode);
    }

    // Force shutdown after 10 seconds if connections hang
    setTimeout(() => {
        logger.error('Forced shutdown due to timeout.');
        process.exit(1);
    }, 10000).unref();
};