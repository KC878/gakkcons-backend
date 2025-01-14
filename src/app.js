const express = require("express");
const apiRoutes = require("./routes/index");
const appointmentRoutes = require("./routes/appointment");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", apiRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
