const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`
        <h1>Project 2 - Node.js API</h1>
        <p>Welkom op de API documentatie.</p>
        <ul>
            <li><strong>GET /items</strong> - Lijst van alle items</li>
            <li><strong>POST /items</strong> - Nieuw item toevoegen</li>
        </ul>
    `);
});


app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});