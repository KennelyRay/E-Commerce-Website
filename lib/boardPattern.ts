/*
  Procedural circuit-board layout for the site background. Traces are routed on a
  square grid so 45 degree jogs stay exactly 45 degrees and nothing overlaps:
  horizontal and vertical buses (sometimes as 2 or 3 lane bundles), vias where
  they cross, and small parts placed only in empty cells. A fixed seed keeps the
  same board on every visit.
*/

const CELL = 40;
const LANE_GAP = 7;

export type Bus = { d: string; length: number };
export type BoardLayout = {
  width: number;
  height: number;
  buses: Bus[];
  stubs: string[];
  vias: Array<{ x: number; y: number; r: number }>;
  pads: Array<{ x: number; y: number }>;
  chips: Array<{ x: number; y: number; w: number; h: number; pins: string }>;
};

function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateBoard(width: number, height: number, seed = 20260928): BoardLayout {
  const rand = random(seed);
  const between = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
  const cols = Math.ceil(width / CELL) + 1;
  const rows = Math.ceil(height / CELL) + 1;
  const used = new Set<string>();
  const mark = (c: number, r: number) => used.add(`${c},${r}`);
  const isFree = (c: number, r: number) => !used.has(`${c},${r}`);

  const buses: Bus[] = [];
  const stubs: string[] = [];
  const vias: BoardLayout['vias'] = [];
  const pads: BoardLayout['pads'] = [];
  const chips: BoardLayout['chips'] = [];
  // For each horizontal bus: row index at every column, to place vias at crossings.
  const horizontalRows: Array<Map<number, number>> = [];

  // Horizontal buses, left to right, jogging one row up or down now and then.
  for (let row = between(1, 3); row < rows - 1; row += between(4, 7)) {
    const lanes = [1, 1, 2, 3][between(0, 3)];
    const rowAt = new Map<number, number>();
    const points: Array<[number, number]> = [[-1, row]];
    let current = row;
    let sinceJog = 0;
    for (let col = 0; col <= cols; col += 1) {
      rowAt.set(col, current);
      mark(col, current);
      sinceJog += 1;
      const dir = rand() < 0.5 ? -1 : 1;
      const target = current + dir;
      if (sinceJog > 4 && rand() < 0.16 && target > 0 && target < rows - 1 && Math.abs(target - row) <= 1) {
        points.push([col, current], [col + 1, target]);
        current = target;
        sinceJog = 0;
      }
    }
    points.push([cols + 1, current]);
    horizontalRows.push(rowAt);

    for (let lane = 0; lane < lanes; lane += 1) {
      const offset = lane * LANE_GAP;
      let length = 0;
      const d = points
        .map(([c, r], index) => {
          const x = c * CELL;
          const y = r * CELL + offset;
          if (index > 0) {
            const [pc, pr] = points[index - 1];
            length += Math.hypot(x - pc * CELL, y - (pr * CELL + offset));
          }
          return `${index === 0 ? 'M' : 'L'}${x} ${y}`;
        })
        .join('');
      buses.push({ d, length });
    }
  }

  // Vertical buses, top to bottom; a via wherever they cross a horizontal bus.
  for (let col = between(3, 6); col < cols - 1; col += between(7, 11)) {
    const points: Array<[number, number]> = [[col, -1]];
    let current = col;
    let sinceJog = 0;
    for (let row = 0; row <= rows; row += 1) {
      const crossing = horizontalRows.find((map) => map.get(current) === row);
      if (crossing) {
        vias.push({ x: current * CELL, y: row * CELL, r: 4.5 });
      }
      mark(current, row);
      sinceJog += 1;
      const dir = rand() < 0.5 ? -1 : 1;
      const target = current + dir;
      if (!crossing && sinceJog > 4 && rand() < 0.14 && Math.abs(target - col) <= 1) {
        points.push([current, row], [target, row + 1]);
        current = target;
        sinceJog = 0;
      }
    }
    points.push([current, rows + 1]);
    let length = 0;
    const d = points
      .map(([c, r], index) => {
        if (index > 0) {
          const [pc, pr] = points[index - 1];
          length += Math.hypot((c - pc) * CELL, (r - pr) * CELL);
        }
        return `${index === 0 ? 'M' : 'L'}${c * CELL} ${r * CELL}`;
      })
      .join('');
    buses.push({ d, length });
  }

  // Parts in empty space: occasional small chips, and lone vias whose stubs point in
  // varied directions so the parts never line up into a visible grid.
  const clear = (c0: number, r0: number, c1: number, r1: number) => {
    for (let cc = c0; cc <= c1; cc += 1) for (let rr = r0; rr <= r1; rr += 1) if (!isFree(cc, rr)) return false;
    return true;
  };
  const reserve = (c0: number, r0: number, c1: number, r1: number) => {
    for (let cc = c0; cc <= c1; cc += 1) for (let rr = r0; rr <= r1; rr += 1) mark(cc, rr);
  };

  const attempts = Math.floor((cols * rows) / 10);
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const c = between(1, cols - 3);
    const r = between(1, rows - 3);

    if (rand() < 0.22 && clear(c - 1, r - 1, c + 2, r + 2)) {
      const x = c * CELL + 6;
      const y = r * CELL + 10;
      const w = CELL * 2 - 12;
      const h = CELL - 20;
      const pinCount = 5;
      let pins = '';
      for (let i = 0; i < pinCount; i += 1) {
        const px = x + 6 + (i * (w - 12)) / (pinCount - 1);
        pins += `M${px} ${y}v-5M${px} ${y + h}v5`;
      }
      chips.push({ x, y, w, h, pins });
      const sx = x + w / 2;
      const turn = rand() < 0.5 ? -1 : 1;
      stubs.push(`M${sx} ${y + h + 5}V${(r + 1) * CELL + 12}L${sx + 16 * turn} ${(r + 1) * CELL + 28}`);
      pads.push({ x: sx + 16 * turn, y: (r + 1) * CELL + 28 });
      reserve(c - 2, r - 2, c + 3, r + 3);
    } else if (clear(c - 1, r - 1, c + 1, r + 1)) {
      // Jitter within the cell and pick one of four directions and two lengths.
      const x = c * CELL + between(12, 28);
      const y = r * CELL + between(12, 28);
      const [dx, dy] = [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ][between(0, 3)];
      const straight = rand() < 0.5 ? 16 : 26;
      const diag = rand() < 0.5 ? 10 : 16;
      vias.push({ x, y, r: 3.5 });
      stubs.push(`M${x} ${y + 3.5 * dy}V${y + straight * dy}L${x + diag * dx} ${y + (straight + diag) * dy}`);
      pads.push({ x: x + diag * dx, y: y + (straight + diag) * dy });
      reserve(c - 2, r - 2, c + 2, r + 2);
    }
  }

  return { width, height, buses, stubs, vias, pads, chips };
}
