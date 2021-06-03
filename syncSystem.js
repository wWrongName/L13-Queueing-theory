const TSystem = require("./TSystem");

class SyncSystem extends TSystem {
    
    handleRequest () {
        for (let req of this.queue)
            if (req.status == this.statuses.S_WAIT) {
                req.status = this.statuses.S_DONE;
                return;
            }
    };
};

module.exports = SyncSystem;