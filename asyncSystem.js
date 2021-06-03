const TSystem = require("./TSystem");
const TNode = require("./TNode");

class AsyncSystem extends TSystem {
    constructor (argv, config) {
        super(argv, config);
        this.tree;
    };

    getLastNode (node) {
        if (node.value.length == 1 && node.value.status == this.statuses.S_DONE)
            return 1;

        let nNode;
        if (node.left)
            nNode = this.getLastNode(node.left);
        if (node.right && nNode == 1)
            nNode = this.getLastNode(node.left);

        if (nNode == undefined)
            return node.value;
        else 
            return nNode;
    };

    getNewConflicts () {
        let res = [];
        for (let request of this.queue) {
            if (request.status == this.statuses.S_WAIT) {
                request.status = this.statuses.S_CONF;
                res.push({...request});
            }
        }
        return res;
    };

    handleRequest () {
        if (!this.tree)
            this.tree = new TNode(this.getNewConflicts());
        let node = this.getLastNode(this.tree);
        if (node == 1) {
            this.tree = new TNode(this.getNewConflicts());
            node = this.getLastNode(this.tree);
        }

        this.handle(node);
    };

    handle (node) {
        let nextNodes = [];
        for (let index in node.value) {
            let sendFlag = Math.round(Math.random());
            if (sendFlag) {
                nextNodes.push(node.value[index]);
                node.value.splice(index, 1);
            }
        }

        if (nextNodes.length == 0)
            nextNodes = (node.value) ? node.value : [];
        if (nextNodes.length == 1)
            nextNodes[0].status = this.statuses.S_DONE;
        if (node.left)
            node.left = new TNode(nextNodes);
        else 
            node.right = new TNode(nextNodes);
    };
};

module.exports = AsyncSystem;