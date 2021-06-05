const TSystem = require("./TSystem");

class AsyncSystem extends TSystem {

    countTheoreticalExpD (tExpN, lambda) {
        return tExpN / lambda;
    };

    countSimulationStatistics (time) {
        return new Promise (resolve => {
            if (this.queue.length > 0) {
                this.statistics.d.push(time - this.queue[0] + 0.5);
                this.queue.splice(0, 1);
            }
            if (this.queue.length > 0)
                this.statistics.n.push(this.queue.length);
            resolve();
        });
    };
};

module.exports = AsyncSystem;