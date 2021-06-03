const argv = require('yargs').argv;
const config = require('./config.json');
const SyncSystem = require('./syncSystem');
const AsyncSystem = require('./asyncSystem');

class Experiment {
    constructor (args) {
        // this.syncSystem = new SyncSystem(args, config.sync);
        this.asyncSystem = new AsyncSystem(args, config.sync);
    }

    start () {
        for (let i = 0; i < 10; i++) {
            // this.syncSystem.run(i);
            this.asyncSystem.run();
        }
    }
};

const experiment = new Experiment(argv);
experiment.start();