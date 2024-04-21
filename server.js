const taskRoutes = require("./taskRoutes"); // Import taskRoutes
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Routes
//app.get("/", (req, res) => {
//  res.send("Hello World");
//});
app.use("/api", taskRoutes); // Use taskRoutes for routes starting with "/api"

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
