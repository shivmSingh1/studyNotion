const express = require("express")
const app = express();

require("dotenv").config();
PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
	res.send("welcome")
})

app.listen(PORT, () => {
	console.log(`server is listening on port ${PORT}`)
})