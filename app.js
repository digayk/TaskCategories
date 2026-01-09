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

app.get('/items', async (req, res) => {
    const sortField = req.query.sort === 'prijs' ? 'prijs' : 'id';
    const [rows] = await db.query(`SELECT * FROM items ORDER BY ${sortField} ASC`);
    res.json(rows);
});
app.get('/items/search', async (req, res) => {
    const searchTerm = req.query.q;
    const [rows] = await db.query("SELECT * FROM items WHERE naam LIKE ?", [`%${searchTerm}%`]);
    res.json(rows);
});

app.post('/items', async (req, res) => {
    const { naam, prijs } = req.body;
    if (!naam || !prijs) return res.status(400).json({ error: "Naam en prijs verplicht" });
    if (typeof prijs !== 'number') return res.status(400).json({ error: "Prijs moet een getal zijn" });
    if (/\d/.test(naam)) return res.status(400).json({ error: "Naam mag geen cijfers bevatten" });

    const [result] = await db.query("INSERT INTO items (naam, prijs) VALUES (?, ?)", [naam, prijs]);
    res.status(201).json({ message: "Bloem toegevoegd", id: result.insertId });
});

app.delete('/items/:id', async (req, res) => {
    try {
        const [result] = await db.query("DELETE FROM items WHERE id = ?", [req.params.id]);
        res.json({ message: "Verwijderd" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});
app.listen(port, () => {
    console.log(`Server draait op http://localhost:${port}`);
});