import { getSideToPlayFromFen } from "./chess";

test("getSideToPlayFromFen", () => {
  expect(
    getSideToPlayFromFen(
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    )
  ).toEqual("w");
});
