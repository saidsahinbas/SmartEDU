const express = require('express');
const app = express();

const port = 3000;

app.get('/', (req, res) => {
    res.status(200).send('merhaba dünya');
})

app.get('/about', (req, res) => {
    res.send('About');
})

app.listen(port, () => {
    console.log(`Smart edu app listen on ${port} port`);
})