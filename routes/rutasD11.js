import { fork } from 'child_process';
import os from "os"

function info(req, res) {
    const result = {
        argumentos: `${process.argv.slice(2)}`,
        plataforma: process.platform,
        versionNode: process.version,
        usoMemoria: process.memoryUsage().rss,
        cantCpus: os.cpus().length,
        path: process.execPath,
        processId: process.pid,
        carpetaProyecto: process.cwd(),
    };
    res.status(200).render('info', result);
}

function randoms(req, res) {
    let cantidad = req.query.cant;

    if (!cantidad) {
        cantidad = 1e8;
    }
    const forked = fork('controllers/generarNumerosRandom.js');

    forked.on('message', (resultado) => {
        if (resultado === 'listo') {
            forked.send(cantidad);
        } else {
            res.status(200).json({ resultado: resultado });
        }
    });
}

export default {
    info,
    randoms
};
