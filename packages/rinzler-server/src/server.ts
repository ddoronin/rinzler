import * as config       from './config';
import { startMongo }    from './start/mongo';
import { startWss }      from './start/wss';
import { startStatic }   from './start/static';
import { App }           from './app';
import { yorker }        from 'yorker';
import * as express      from 'express';
import * as http         from 'http';

(async () => {
    const say = yorker.see('>>> Rinzler Server >>>');
    try {
        const mongoClient = await startMongo(config.mongo);
        const server      = express();
        const httpServer  = http.createServer(server);
                            await startStatic(server);
        const wss         = await startWss(httpServer);
                            new App(mongoClient, wss).start();
        httpServer.listen(config.server.port);
        say(`listening on the port # ${config.server.port}`);
    }
    catch(error) {
        console.error(error);
        return process.exit(1);
    }
})();
