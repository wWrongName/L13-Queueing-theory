const argv = require('yargs').argv;
const gnuplot = require('gnu-plot');
const config = require('./config.json');
const SyncSystem = require('./syncSystem');
const AsyncSystem = require('./asyncSystem');

class Experiment {
    constructor (args) {
        this.syncSystem  = new SyncSystem(args, config);
        this.asyncSystem = new AsyncSystem(args, config);
    }

    async start () {
        let lambdaStep = 0.01;
        
        await this.syncSystem.run(lambdaStep);
        await this.asyncSystem.run(lambdaStep);

        gnuplot().plot(this.syncSystem.graphData);
        gnuplot().plot(this.asyncSystem.graphData);
    }
};

const experiment = new Experiment(argv);
experiment.start();