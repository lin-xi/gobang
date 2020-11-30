import EventHub from "./EventHub";

export default class GameState {
  _state: number[][];
  player: number;
  DIMENSION: number;

  constructor(state: number[][], nextPlayer: number) {
    this._state = state;
    this.player = nextPlayer;
    this.DIMENSION = state.length - 1;
  }

  get state() {
    return this._state;
  }

  move(i: number, j: number) {
    this.state[i][j] = this.player;
    EventHub.emit("draw");
    this.player = this.player > 1 ? 1 : 2;

    if (this.getGameResult() == 1) {
      EventHub.emit("gameOver");
    } else if (this.getGameResult() == 2) {
      // console.log("2");
    } else {
      EventHub.emit("nextMove");
    }
  }

  simulateMove(i: number, j: number) {
    this.state[i][j] = this.player;
    this.player = this.player > 1 ? 1 : 2;
    EventHub.emit("drawState", this.state);
  }

  getLegalActions() {
    const steps = [];
    for (let i = 0; i <= this.DIMENSION; i++) {
      for (let j = 0; j <= this.DIMENSION; j++) {
        if (!this.state[i][j]) {
          steps.push([i, j]);
        }
      }
    }
    return steps;
  }

  copy() {
    const newState = this.copyState();
    return new GameState(newState, this.player);
  }

  copyState() {
    const newState = [];
    for (let i = 0; i <= this.DIMENSION; i++) {
      const row = [];
      for (let j = 0; j <= this.DIMENSION; j++) {
        row.push(this.state[i][j]);
      }
      newState.push(row);
    }
    return newState;
  }

  getGameResult() {
    return this.checkGameResult();
  }

  // 0: 游戏未结束
  // 1: 游戏结束，有胜方
  // 2: 平局
  checkGameResult() {
    for (let i = 0; i <= this.DIMENSION; i++) {
      let last = -1;
      let count = 0;

      let x = i;
      let y = 0;
      //纵向
      while (y <= this.DIMENSION) {
        if (count == 4) {
          return 1;
        } else if (this.state[x][y]) {
          if (this.state[x][y] == last) {
            count++;
          } else {
            count = 0;
            last = this.state[x][y];
          }
        } else {
          count = 0;
          last = -1;
        }
        y++;
      }
      if (count == 4) {
        return 1;
      }

      //横向
      x = 0;
      y = i;
      count = 0;
      while (x <= this.DIMENSION) {
        if (count == 4) {
          return 1;
        } else if (this.state[x][y]) {
          if (this.state[x][y] == last) {
            count++;
          } else {
            count = 0;
            last = this.state[x][y];
          }
        } else {
          count = 0;
          last = -1;
        }
        x++;
      }
      if (count == 4) {
        return 1;
      }

      //斜-45度
      last = -1;
      count = 0;
      x = i;
      y = 0;
      while (x <= this.DIMENSION && y <= this.DIMENSION) {
        if (count == 4) {
          return 1;
        } else if (this.state[x][y]) {
          if (this.state[x][y] == last) {
            count++;
          } else {
            count = 0;
            last = this.state[x][y];
          }
        } else {
          count = 0;
          last = -1;
        }
        y++;
        x++;
      }
      if (count == 4) {
        return 1;
      }

      x = 0;
      y = i;
      count = 0;
      while (x <= this.DIMENSION && y <= this.DIMENSION) {
        if (count == 4) {
          return 1;
        } else if (this.state[x][y]) {
          if (this.state[x][y] == last) {
            count++;
          } else {
            count = 0;
            last = this.state[x][y];
          }
        } else {
          count = 0;
          last = -1;
        }
        y++;
        x++;
      }
      if (count == 4) {
        return 1;
      }

      // 斜45度
      last = -1;
      count = 0;
      x = 0;
      y = this.DIMENSION - i;
      while (x <= this.DIMENSION && y >= 0) {
        if (count == 4) {
          return 1;
        } else if (this.state[x][y]) {
          if (this.state[x][y] == last) {
            count++;
          } else {
            count = 0;
            last = this.state[x][y];
          }
        } else {
          count = 0;
          last = -1;
        }
        x++;
        y--;
      }
      if (count == 5) {
        return 1;
      }

      last = -1;
      count = 0;
      x = this.DIMENSION;
      y = i;
      while (x >= 0 && y <= this.DIMENSION) {
        if (count == 4) {
          return 1;
        } else if (this.state[x][y]) {
          if (this.state[x][y] == last) {
            count++;
          } else {
            count = 0;
            last = this.state[x][y];
          }
        } else {
          count = 0;
          last = -1;
        }
        x--;
        y++;
      }
      if (count == 4) {
        return 1;
      }
    }

    let zeroCount = 0;
    for (let i = 0; i <= this.DIMENSION; i++) {
      for (let j = 0; j <= this.DIMENSION; j++) {
        if (!this.state[i][j]) {
          zeroCount++;
        }
      }
    }
    if (!zeroCount) {
      return 2;
    }
    return 0;
  }
}
