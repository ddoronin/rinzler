import { mongo, server } from './config';
import { startMongo }    from './start/mongo';
import { startWss }      from './start/wss';
import { App }           from './app';

async function run() {
    try {
        const mongoClient = await startMongo(mongo);
        const wss         = await startWss(server);
        return { mongoClient, wss };
    }
    catch(error) {
        console.error(error);
        return process.exit(1);
    }
}

run().then(({ mongoClient, wss }) => {
    const app = new App(mongoClient, wss);
    try {
        app.start();
    }
    catch(error) {
        console.error(error);
        process.exit(1);
    }
});
