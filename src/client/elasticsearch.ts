import elasticsearch from 'elasticsearch';

export default function getClient(){
    const client = new elasticsearch.Client({
        host: 'localhost:9200',
        /* log: 'trace' */
    });

    return client;
}