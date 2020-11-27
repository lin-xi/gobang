import GameState from "./GameState";

export default class Game {
  dom: HTMLElement;
  DIMENSION = 7;
  SIZE = 60;
  QIZI = 20;
  predrawPosition = [-1, -1];
  board: number[][];
  _state: GameState;
  context: CanvasRenderingContext2D;

  constructor(dom: HTMLElement) {
    this.dom = dom;
    const board = [];
    for (let i = 0; i <= this.DIMENSION; i++) {
      const row = [];
      for (let j = 0; j <= this.DIMENSION; j++) {
        row.push(0);
      }
      board.push(row);
    }
    this.board = board;
    this._state = new GameState(this.board, 1);

    this.initCanvas(dom);
    this.eventHandle(dom);
    this.draw();
  }

  get state() {
    return this._state;
  }

  set state(sta) {
    this._state = sta;
  }

  initCanvas(dom: HTMLElement) {
    const canvas = dom;
    const parent = canvas.parentNode;
    this.context = canvas.getContext("2d");
    const devicePixelRatio = window.devicePixelRatio || 1;
    const backingStoreRatio =
      this.context.webkitBackingStorePixelRatio ||
      this.context.mozBackingStorePixelRatio ||
      this.context.msBackingStorePixelRatio ||
      this.context.oBackingStorePixelRatio ||
      this.context.backingStorePixelRatio ||
      1;
    const ratio = devicePixelRatio / backingStoreRatio;
    this.ratio = ratio;

    const rect = parent.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    canvas.width = rect.width * this.ratio;
    canvas.height = rect.height * this.ratio;
    this.context.scale(this.ratio, this.ratio);
    this.context.lineWidth = 2;
    this.context.strokeStyle = "#cccccc";
    this.context.fillStyle = "coral";
    this.context.lineJoin = "round";
    this.context.font = "16px sans-serif";
    this.context.textBaseline = "hanging";
  }

  draw() {
    const state = this.state.state;
    this.context.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i <= this.DIMENSION; i++) {
      for (let j = 0; j <= this.DIMENSION; j++) {
        if (i != this.DIMENSION && j != this.DIMENSION) {
          this.context.strokeRect(
            (i + 1) * this.SIZE,
            (j + 1) * this.SIZE,
            this.SIZE,
            this.SIZE
          );
          this.context.fillStyle = "coral";
          this.context.fillRect(
            (i + 1) * this.SIZE,
            (j + 1) * this.SIZE,
            this.SIZE,
            this.SIZE
          );
        }
        if (state[i][j] == 1) {
          //player: 1  black
          const x = (i + 1) * this.SIZE;
          const y = (j + 1) * this.SIZE;
          this.context.beginPath();
          this.context.arc(x, y, this.QIZI, 0, 2 * Math.PI);
          this.context.closePath();
          const rg = this.context.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            this.QIZI
          );
          rg.addColorStop(0, "rgba(100,100,100,1)");
          rg.addColorStop(0.7, "rgba(40,40,40,1)");
          rg.addColorStop(1, "rgba(0,0,0, 1)");
          this.context.fillStyle = rg;
          this.context.fill();
        } else if (state[i][j] == 2) {
          //player: 2  white
          const x = (i + 1) * this.SIZE;
          const y = (j + 1) * this.SIZE;
          this.context.beginPath();
          this.context.arc(x, y, this.QIZI, 0, 2 * Math.PI);
          this.context.closePath();
          const rg = this.context.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            this.QIZI
          );
          rg.addColorStop(0, "rgba(255,255,255,1)");
          rg.addColorStop(0.7, "rgba(220,220,220,1)");
          rg.addColorStop(1, "rgba(180,180,180, 1)");
          this.context.fillStyle = rg;
          this.context.fill();
        } else if (
          i === this.predrawPosition[0] &&
          j === this.predrawPosition[1]
        ) {
          if (this.state.player === 1) {
            const x = (i + 1) * this.SIZE;
            const y = (j + 1) * this.SIZE;
            this.context.beginPath();
            this.context.arc(x, y, this.QIZI, 0, 2 * Math.PI);
            this.context.closePath();
            const rg = this.context.createRadialGradient(
              x,
              y,
              0,
              x,
              y,
              this.QIZI
            );
            rg.addColorStop(0, "rgba(100,100,100, 0.6)");
            rg.addColorStop(0.7, "rgba(40,40,40, 0.6)");
            rg.addColorStop(1, "rgba(0,0,0, 0.6)");
            this.context.fillStyle = rg;
            this.context.fill();
          } else if (this.state.player === 2) {
            //player: 2  white
            const x = (i + 1) * this.SIZE;
            const y = (j + 1) * this.SIZE;
            this.context.beginPath();
            this.context.arc(x, y, this.QIZI, 0, 2 * Math.PI);
            this.context.closePath();
            const rg = this.context.createRadialGradient(
              x,
              y,
              0,
              x,
              y,
              this.QIZI
            );
            rg.addColorStop(0, "rgba(255,255,255, 0.6)");
            rg.addColorStop(0.7, "rgba(220,220,220, 0.6)");
            rg.addColorStop(1, "rgba(180,180,180, 0.6)");
            this.context.fillStyle = rg;
            this.context.fill();
          }
        }
      }
    }
  }
  eventHandle(dom) {
    dom.addEventListener("click", evt => {
      const [i, j] = this.getPosition(evt);
      if (i <= this.DIMENSION && j <= this.DIMENSION) {
        this.state.move(i, j);
      }
    });
    dom.addEventListener("mousemove", evt => {
      const [i, j] = this.getPosition(evt);
      if (i <= this.DIMENSION && j <= this.DIMENSION) {
        this.predrawPosition = [i, j];
        this.draw();
      }
    });
    EventHub.on("draw", () => {
      console.log("draw>>>>>>");
      this.draw();
    });
  }
  getPosition(evt) {
    const x = evt.pageX - this.dom.offsetLeft - this.SIZE;
    const y = evt.pageY - this.dom.offsetTop - this.SIZE;
    const i = Math.round(x / this.SIZE);
    const j = Math.round(y / this.SIZE);
    return [i, j];
  }
}
