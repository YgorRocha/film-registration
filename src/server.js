const express = require('express');

const app = express();

const PORT = 3333; 

app.post("/user", (req, res) => {
res.send(`You did call method post`) })

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

