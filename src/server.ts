import express, { Request, Response } from 'express';
import getClient from './client/elasticsearch';
import PhotoController from './PhotoController';

const app = express();

app.get('/', async (request: Request, response: Response) => {
    const client = getClient();

    //criar um registro no elasticsearch
    const result = await client.index({
        index: 'elastic_users',
        type: 'type_elastic_users',
        body: {
            user: 'Matheus',
            password: '1qaz2wsx',
            email: 'mathhardw@gmail.com'
        }
    });


    //fazer uma busca no elasticsearch
    return response.json(result);
});

app.get('/ApiToElastic', PhotoController.ApiToElastic);
app.get('/createPokemon', PhotoController.createPokemon);

app.get('/findAll', PhotoController.findAll);
app.get('/findByQuery', PhotoController.findByQuery);
app.get('/findById/:id', PhotoController.findById);

app.listen(3333, () => console.log('Running'));