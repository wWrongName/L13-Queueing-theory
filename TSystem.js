class TSystem {
    constructor (argv, config) {
        this.statuses = {
            S_WAIT : 0x0,
            S_DONE : 0x1,
            S_CONF : 0x2
        };

        this.winLen = (argv.wl) ? argv.wl : config.winLen;
        this.maxReqPerTick = (argv.mpt) ? argv.mpt : config.maxPerTick;
        this.experimentLen = (argv.el) ? argv.el : config.experimentLen;
        this.queue = [];
    };

    generateRequests = () => {
        let amountOfMessages = Math.floor(Math.random() * this.maxReqPerTick);
        for (let i = 0; i < amountOfMessages; i++)
            this.newRequest();
    };

    newRequest () {
        this.queue.push({ 
            counter : 0, 
            status : this.statuses.S_WAIT, 
            startTime : Math.random()
        });
    };

    countMD () {
        let volume = 0;
        let total = 0;
        for (let req of this.queue) {
            if (req.status == this.statuses.S_DONE) {
                total += this.winLen + req.counter + req.startTime;
                volume++;
            }
        }
        return total / volume;
    };

    countD () {
        this.queue = this.queue.map(el => {
            if (el.status !== this.statuses.S_DONE)
                el.counter++;
            return el;
        });
    };

    workCycles () {
        for (let window = 0; window < this.experimentLen; window++) {
            this.generateRequests();
            this.countD();
            this.handleRequest();
        }
    };

    run (tryCounter) {
        this.workCycles();
        let mD = this.countMD();
        console.log(`Try: ${tryCounter}. M[D] = ${mD}`);
    };
};

module.exports = TSystem;