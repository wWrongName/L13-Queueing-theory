class TSystem {
    constructor (argv, config) {
        this.winLen = (argv.wl) ? argv.wl : config.winLen;
        this.maxReqPerTick = (argv.mpt) ? argv.mpt : config.maxPerTick;
        this.experimentLen = (argv.el) ? argv.el : config.experimentLen;
        this.graphData = [{
            title : 'E[D]',
            data : []
        }, {
            title : 'E[N]',
            data : []
        }, {
            title : 'theoretical E[D]',
            data : []
        }, {
            title : 'theoretical E[N]',
            data : []
        },];

        this.queue = [];
        this.statistics = {
            d : [],
            n : []
        };
    };

    fillTheQueue (requests, winEdgeTime) {
        return new Promise (resolve => {
            for (let i in requests) {
                if (requests[i] < winEdgeTime) {
                    this.queue.push(requests[i]);
                    requests.splice(i, 1);
                }
            }
            resolve();
        });
    };

    reverseExponential (lambda) {
        return new Promise (async resolve => {
            let U = Math.random();
            // if (U == 0)
            //     U = 0.0000000001
            resolve(-(Math.log(U) / lambda));
        });
    };

    generateRequests (lambda) {
        return new Promise (async resolve => {
            let time = 0;
            let timeframes = [];
            while (time < this.experimentLen) {
                time += await this.reverseExponential(lambda);
                timeframes.push(time);
            }
            resolve(timeframes);
        });
    };

    countGraphData (lambda) {
        return new Promise (resolve => {
            let totalD = 0, totalN = 0;
            for (let dpart of this.statistics.d) 
                totalD += dpart;
            for (let npart of this.statistics.n)
                totalN += npart;
            let expD = totalD / this.statistics.d.length; // approximate
            let expN = totalN / this.experimentLen;       // approximate
            let tExpN = (lambda * (2 - lambda)) / (2 * (1 - lambda));
            let tExpD = this.countTheoreticalExpD(tExpN, lambda);
            this.graphData[0].data.push([lambda, expD]); // E[D]
            this.graphData[1].data.push([lambda, expN]); // E[N]
            this.graphData[2].data.push([lambda, tExpD]); // E[D] theoretical
            this.graphData[3].data.push([lambda, tExpN]); // E[N] theoretical
            this.statistics.n = [];
            this.statistics.d = [];
            this.queue = [];
            resolve();
        });
    };

    workCycles (requests) {
        return new Promise (async resolve => {
            for (let time = 1; time < this.experimentLen; time++) {
                await this.fillTheQueue(requests, time);
                await this.countSimulationStatistics(time);
            }
            resolve();
        });
    };

    run (lambdaStep) {
        return new Promise (async resolve => {
            for (let _lambda = lambdaStep; _lambda < 1 - lambdaStep; _lambda += lambdaStep) {
                let requests = await this.generateRequests(_lambda);
                await this.workCycles(requests);
                await this.countGraphData(_lambda);
            }
            resolve();
        });
    };
};

module.exports = TSystem;