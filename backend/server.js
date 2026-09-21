import "dotenv/config";
import { initProcessHandlers } from "./src/config/processHandlers.js";
import app from "./app.js"

// dotenv.config();

const PORT = process.env.PORT || 5000;

// start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
})


// Register process safety net handlers
initProcessHandlers(server);