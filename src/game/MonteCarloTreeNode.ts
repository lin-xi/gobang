/** @format */

const KEYS = ["lose", "win", "draw"];
export default class MonteCarloTreeNode {
  constructor(state, parent) {
    this.numberOfVisit = 0;
    this.results = {};
    for (const v of KEYS) {
      this.results[v] = 0;
    }
    this.state = state;
    this.untriedActions = [];
    this.parent = parent;
    this.children = [];
    this.getUntriedActions();
  }

  get q() {
    return this.results["win"] - this.results["lose"];
  }

  isTerminalNode() {
    return this.state.getGameResult() !== 0;
  }

  isFullyExpanded() {
    return this.untriedActions.length > 0;
  }

  getUntriedActions() {
    this.untriedActions = this.state.getLegalActions();
  }

  expand() {
    const action = this.untriedActions.pop();
    const nextState = this.state.copy();
    nextState.simulateMove(action[0], action[1]);
    const childNode = new MonteCarloTreeNode(nextState, this);
    this.children.push(childNode);
    return childNode;
  }

  simulate() {
    const currentSimulateState = this.state;
    while (!currentSimulateState.getGameResult()) {
      const possibleMoves = currentSimulateState.getLegalActions();
      const action = this.simulatePolicy(possibleMoves);
      currentSimulateState.simulateMove(action[0], action[1]);
    }
    return currentSimulateState.getGameResult();
  }

  simulatePolicy(possibleMoves) {
    //随机策略
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  backpropagate(result) {
    console.log("backpropagate>>>", result);
    this.numberOfVisit += 1;
    this.results[KEYS[result]] += 1;
    if (this.parent) {
      this.parent.backpropagate(result);
    }
  }

  bestChild(cparam) {
    console.log("bestChild>>", this.children);
    const choicesWeights = this.children.map(child => {
      return (
        child.q / child.numberOfVisit +
        cparam *
          Math.sqrt((2 * Math.log(this.numberOfVisit)) / child.numberOfVisit)
      );
    });
    const result = choicesWeights.reduce(
      (prev, cur, index) => {
        if (cur > prev[0]) {
          return [cur, index];
        }
        return prev;
      },
      [-1, 0]
    );
    return this.children[result[1]];
  }
}
