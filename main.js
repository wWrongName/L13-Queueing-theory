const argv = require('yargs').argv;
const config = require('./config.json');
const SyncSystem = require('./syncSystem');

class Experiment {
    constructor (args) {
        this.syncSystem = new SyncSystem(args, config);
        // this.asyncSystem = new AsyncSystem(args);
    }

    start () {
        this.syncSystem.run();
        // this.asyncSystem.run();
    }
};

const experiment = new Experiment(argv);
experiment.start();