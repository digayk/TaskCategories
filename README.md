# Bloemenwinkel API - Project 2

Dit is een database-driven API voor de bloemenwinkel ImagineFlowers, gebouuwd met Node.js, Express en MySQL.

## Reden voor Bloemenwinkel

Aangezien ik al werk op een website voor de bloemenwinkel ImagineFlowers, dacht ik dat ik mij hierop zou baseren. 

## Installatie
1. Clone de repository.
2. Voer "npm install" uit.
3. Maak een ".env" bestand aan met je eigen database-gegevens (DB_HOST, DB_USER, DB_PASS, DB_NAME).
4. Gebruik de SQL-instructies (zie onder) om de tabellen "items" en "categories" aan te maken.
5. Start de server met "node app.js".

## Features
- Volledige CRUD voor Bloemen en Categorieën.
- Zoekfunctie op naam via "/items/search?q=...".
- Paginering via "/items/pagination?limit=...&offset=...".
- Sorteren op prijs via "/items?sort=prijs".
- Validatie: Geen lege velden, prijs moet numeriek zijn, namen mogen geen cijfers bevatten.

## Bronvermelding
Youtube tutorial dat mij veel geholpen heeft = https://www.youtube.com/watch?v=Hej48pi_lOc 