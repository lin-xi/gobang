/** @format */

export default class MonteCarloSearchTree {
  constructor(root) {
    this.root = root;
  }

  bestAction(simulationsNumber = 1000) {
    for (let i = 0; i < simulationsNumber; i++) {
      const node = this.treePolicy();
      const reward = node.simulate();
      node.backpropagate(reward);
    }
    return this.root.bestChild(0);
  }

  treePolicy() {
    let currentNode = this.root;
    while (!currentNode.isTerminalNode()) {
      if (currentNode.isFullyExpanded()) {
        return currentNode.expand();
      } else {
        currentNode = currentNode.bestChild(0);
      }
    }
    return currentNode;
  }
}
