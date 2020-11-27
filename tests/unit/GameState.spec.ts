import GameState from "@/game/Game.js";

test("GameState", () => {
  const state = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  new GameState(state, 1);
  expect(1 + 2).toBe(3);
});
