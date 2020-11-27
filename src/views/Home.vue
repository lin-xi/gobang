<!-- @format -->

<template>
  <div class="home">
    <div class="chess">
      <canvas ref="canvas"></canvas>
    </div>
    <div class="result-dialog" v-show="gameOver">{{ gameResult }}</div>
    <div class="state-board">
      <div class="carlo-cat">
        <img
          src='data:image/svg+xml;utf8,<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1602675917851" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4880" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100"><defs><style type="text/css"></style></defs><path d="M581.18 384c-40.36 0-213.64 3.96-325.18 171.9V384c0-105.88-86.12-192-192-192-35.34 0-64 28.66-64 64s28.66 64 64 64c35.28 0 64 28.72 64 64v512c0 70.6 57.4 128 128 128h352c17.68 0 32-14.32 32-32v-32c0-35.34-28.66-64-64-64h-64l256-192v288c0 17.68 14.32 32 32 32h64c17.68 0 32-14.32 32-32V579.72c-20.58 5.34-41.78 9.08-64 9.08-123.62 0-227.04-88.1-250.82-204.8zM896 192h-128l-128-128v268.8c0 106.04 85.96 192 192 192s192-85.96 192-192V64l-128 128z m-144 160c-17.68 0-32-14.32-32-32s14.32-32 32-32 32 14.32 32 32-14.32 32-32 32z m160 0c-17.68 0-32-14.32-32-32s14.32-32 32-32 32 14.32 32 32-14.32 32-32 32z" p-id="4881"></path></svg>'
        />
        卡洛猫
      </div>

      <div class="player">
        <img
          src='data:image/svg+xml;utf8,<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1602675441972" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3988" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="100"><defs><style type="text/css"></style></defs><path d="M833.6 762.4A308.8 308.8 0 0 1 936 1024h-85.6c1.6-12 3.2-24 3.2-36 0-72-35.2-136-92-185.6a588 588 0 0 1-499.2 0 245.6 245.6 0 0 0-92 185.6c0 12.8 1.6 24 3.2 36H88a283.2 283.2 0 0 1-2.4-36c0-86.4 40-165.6 104.8-226.4A405.6 405.6 0 0 1 0 428.8C0 192 229.6 0 512 0s512 192 512 428.8c0 134.4-74.4 254.4-190.4 333.6zM512 295.2c-236 0-426.4-80.8-426.4 122.4s190.4 368 426.4 368c236 0 426.4-164.8 426.4-368S748 296 512 296z m199.2 204.8c-32 0-56.8-21.6-56.8-48 0-25.6 25.6-47.2 56-47.2 32 0 57.6 21.6 57.6 48s-25.6 48-56.8 48zM682.4 632c0 32-76 59.2-170.4 59.2S341.6 664 341.6 632c0-8 4.8-16 14.4-24 26.4 20.8 86.4 36 156 36s129.6-15.2 156-36c9.6 8 14.4 16 14.4 24zM312.8 500c-32 0-56.8-21.6-56.8-48 0-25.6 25.6-47.2 56.8-47.2 32 0 56.8 21.6 56.8 48s-25.6 48-56 48z" p-id="3989"></path></svg>'
        />
        You
      </div>

      <div class="turn"></div>
    </div>
  </div>
</template>

<script>
  import Game from "../game/Game";
  import EventHub from "../game/EventHub";
  import MonteCarloTreeNode from "../game/MonteCarloTreeNode";
  import MonteCarloSearchTree from "../game/MonteCarloSearchTree";

  export default {
    name: "Home",
    data() {
      return {
        gameOver: false,
      };
    },
    components: {},
    computed: {
      gameResult() {
        if (this.game) {
          if (this.game.state.getGameResult() === 1) {
            if (this.player == 1) {
              return "You win!";
            } else {
              return "CarloCat win!";
            }
          } else if (this.game.state.getGameResult() === 2) {
            return "draw!";
          }
        }
      },
    },
    methods: {
      nextMove() {
        const root = new MonteCarloTreeNode(this.game.state);
        const mcts = new MonteCarloSearchTree(root);
        const bestNode = mcts.bestAction(100);
        if (bestNode) {
          this.game.state = bestNode.state;
          if (bestNode.isTerminalNode()) {
            this.gameOver = true;
          }
        } else {
          console.log("Can't get best child!");
        }
      },
    },
    mounted() {
      const game = new Game(this.$refs.canvas);
      EventHub.on("gameOver", () => {
        console.log(" gameOver>> ");
        this.gameOver = true;
      });
      EventHub.on("nextMove", () => {
        this.nextMove();
      });
      EventHub.on("drawState", () => {
        // console.log("drawState>>", JSON.parse(JSON.stringify(state)));
      });
      this.game = game;
      this.nextMove();
    },
  };
</script>

<style lang="less">
  #app {
    display: flex;
  }

  .chess {
    width: 620px;
    height: 620px;
  }

  .state-board {
    width: 150px;
    padding: 60px 0 90px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  .carlo-cat {
    width: 100px;
    height: 100px;
    text-align: center;
  }

  .player {
    width: 100px;
    height: 100px;
    text-align: center;
  }

  .turn {
    animation: fade 1s linear infinite;
    border: 4px solid red;
    border-radius: 8px;
    position: absolute;
    top: 60px;
    width: 130px;
    height: 140px;
  }

  @keyframes fade {
    from {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
    to {
      opacity: 1;
    }
  }

  .result-dialog {
    position: absolute;
    left: 0;
    top: 0;
    width: 1000px;
    height: 860px;
    background-color: rgba(0, 0, 0, 0.7);
    font-size: 60px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
</style>
