const states = {
    S_NONE : 0x0,
    S_WAIT : 0x1,
    S_DONE : 0x2
}

class SyncSystem {
    constructor (argv, config) {
        this.winLen = (argv.wl) ? argv.wl : config.sync.win_len;
        this.winAmount = (argv.wa) ? argv.wa : config.sync.win_amount;
        this.requests = [
            { user : 4, msg : 1, state : states.S_NONE}, /* 0 */
            { user : 1, msg : 1, state : states.S_NONE}, /* 1 */
            { user : 3, msg : 1, state : states.S_NONE}, /* 2 */
            { user : 3, msg : 2, state : states.S_NONE}, /* 3 */
            { user : 2, msg : 1, state : states.S_NONE}  /* 4 */
        ];
        this.initialTask = [ 
            [],
            [0],
            [],
            [1, 2],
            [],
            [3, 4]
        ];

    }

    allCompleted () {
        if (this.requests.find(req => req.state != states.S_DONE) === undefined)
            return true;
        return false;
    }

    activateRequest (initialCounter) {
        for (let requestIndex of this.initialTask[initialCounter])
            this.requests[requestIndex].state = states.S_WAIT;
    }

    getUserInWindow (window) {
        let minMsg = Number.MAX_SAFE_INTEGER;
        for (let req in this.requests) {
            if (req.user == window && req.state == states.S_WAIT && minMsg > req.msg)
                minMsg = req.msg;
        }
        if (minMsg == Number.MAX_SAFE_INTEGER)
            return;
        return this.requests.find(req => req.msg == minMsg);
    }

    handleRequest (userRequest) {
        userRequest.state = states.S_DONE;
    }

    run () {
        let initialCounter = 0;
        for (let i = 0; this.allCompleted(); i = (i + 1) % this.winAmount) {
             
            let userRequest = this.getUserInWindow(i);
            if (userRequest)
                this.handleRequest(userRequest);
            
            // -- initialize request from task --
            if (initialCounter !== undefined) {
                this.activateRequest(initialCounter);
                initialCounter++;
            }
            // ----------------------------------
            
            if (initialCounter == this.initialTask.length)
                initialCounter = undefined;
        }
    }
};

module.exports = SyncSystem;