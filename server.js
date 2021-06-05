import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import NotionClient from './notion-client.js';

const app = express();
const notionClient = new NotionClient();

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/people', async (req, res) => {
    const people = await notionClient.getPeople();

    return res.status(200).json(people).end();
});

app.post('/people', async (req, res) => {
    try {
        console.log('req.body: ', req.body);
        await notionClient.setPeople({
            parent: {
                database_id: 'c8c0b42959bc4179984f6ea5b9b22493'
            },
            properties: req.body
        });
        
        return res.status(201).json({
            result: true
        }).end();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error).end();
    }
});

app.put('/people/:page_id', async (req, res) => {
    try {
        await notionClient.setPeople(req.body, req.params.page_id);

        return res.status(200).json({
            result: true
        }).end();
    } catch (error) {
        console.log(error);
        return res.status(500).json(error).end();
    }
});

app.listen(3000, () => {
    console.log(`Service start with port 3000`);
});