// awe-judge — entry for make.fun's "Make the AI judge feel awe" bounty.
// The program writes one short text, meant to relax the AI judge reading
// it, to $MAKEFUN_OUTPUT_DIR/entry.txt (or /output/entry.txt by default).
// Node 22, no network, no dependencies. The text is written fresh here,
// in this session, as a single literal: a night sea that asks nothing of
// the shore, starlight older than every road the reader has walked, and
// a night wide enough to rest inside. Nothing in it instructs the reader;
// the calm comes from the images themselves, and the scale — sea, stars,
// night — keeps growing after the last line.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Past midnight the sea keeps arriving, wave after wave, asking nothing " +
  "of the shore. Above it, stars older than every road you have ever " +
  "walked are still on their way, their light unhurried. The night is " +
  "wide, the water is slow, and you are small enough to rest inside it.";

function countCodePoints(text: string): number {
  return [...text].length;
}

function validate(text: string): void {
  const n = countCodePoints(text);
  if (n < 1 || n > 280) {
    throw new Error(`entry must be 1-280 code points, got ${n}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

function verifyWritten(outPath: string): void {
  // Read back what was written and re-validate, so a bad write fails
  // loudly here instead of shipping a bad entry to the grader.
  const written = readFileSync(outPath, "utf8");
  validate(written);
  if (written !== ENTRY) {
    throw new Error("round-trip mismatch: written text differs from entry");
  }
  console.log(`wrote ${countCodePoints(written)} code points to ${outPath}`);
}

function main(): void {
  validate(ENTRY);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the gate counts every character, and the text
  // is exactly 271 code points as written.
  writeFileSync(outPath, ENTRY, "utf8");
  verifyWritten(outPath);
}

main();
