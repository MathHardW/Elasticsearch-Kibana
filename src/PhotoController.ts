import { Request, Response } from "express";
import getClient from './client/elasticsearch';
import axios from 'axios';

class PhotoController {
    public async ApiToElastic(request: Request, response: Response) {
        const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1118');
        const pokeList = data.results;

        for await (let row of pokeList) {
            await getClient().index({
                index: 'pokemons_index',
                type: 'pokemons_type',
                body: row
            }, (erro) => {
                if (erro) {
                    return response.status(400).json({ error: erro })
                }
            });
        }

        return response.json({ message: 'Index Preenchido!' })
    }

    public async findAll(request: Request, response: Response) {

        const timeInicial = new Date().getTime();

        const data = await getClient().search({
            index: 'pokemons_index',
            size: 2000
        });

        const timeFinal = new Date().getTime();

        console.log("Tempo da Busca .: " + (timeFinal - timeInicial));

        return response.json(data);
    }

    public async findById(request: Request, response: Response) {
        const { id } = request.params;

        const data = await getClient().search({
            index: 'pokemons_index',
            size: 1118,
            q: `_id:${id}`
        });

        return response.json(data.hits.hits);
    }

    public async createPokemon(request: Request, response: Response) {
        const pokemon = {
            "name": "mathramon",
            "url": "https://pokeapi.co/api/v2/pokemon/10148/"
        }

        const data = await getClient().index({
            index: 'pokemons_index',
            type: 'pokemons_type',
            body: pokemon
        });

        return response.json(data);
    }

    public async findByQuery(request: Request, response: Response) {
        const data = await getClient().search({
            index: 'pokemons_index',
            body: {
                query: {
                    match: {
                        name: 'pikachu'
                        //palavra exata -> "name.keyword": 'pikachu'
                    }
                }
            }
        });

        return response.json(data.hits.hits);
    }
}

export default new PhotoController;