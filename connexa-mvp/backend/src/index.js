const createApp = require("./app");
const port = process.env.PORT || 3000;

createApp()
  .then((app) => {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to start app:", err);
    process.exit(1);
  });
