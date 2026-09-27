import { Product } from '@/types';

export type PCBuild = {
  cpu?: Product;
  motherboard?: Product;
  ram?: Product;
  gpu?: Product;
  storage?: Product;
  psu?: Product;
  case?: Product;
  cooling?: Product;
};

export type PCBuildKey = keyof PCBuild;

export type BuildSlot = {
  key: PCBuildKey;
  name: string;
  category: string;
  required: boolean;
  hint: string;
};

export const BUILD_SLOTS: BuildSlot[] = [
  { key: 'cpu', name: 'Processor', category: 'Processors', required: true, hint: 'Sets the socket for the board and cooler.' },
  { key: 'motherboard', name: 'Motherboard', category: 'Motherboards', required: true, hint: 'Must match the CPU socket and RAM type.' },
  { key: 'ram', name: 'Memory', category: 'Memory (RAM)', required: true, hint: 'DDR generation has to match the board.' },
  { key: 'gpu', name: 'Graphics card', category: 'Graphics Cards', required: true, hint: 'The largest draw on the power supply.' },
  { key: 'storage', name: 'Storage', category: 'Storage', required: true, hint: 'M.2 NVMe drives mount on the board.' },
  { key: 'psu', name: 'Power supply', category: 'Power Supplies', required: true, hint: 'Sized from the estimated draw plus 25%.' },
  { key: 'case', name: 'Case', category: 'Cases', required: false, hint: 'Optional if you are reusing a chassis.' },
  { key: 'cooling', name: 'CPU cooler', category: 'Cooling', required: false, hint: 'Checked against the CPU socket.' },
];

export type CheckResult = {
  id: string;
  status: 'pass' | 'fail';
  message: string;
};

export function getSpec(product: Product | undefined, key: string) {
  return product?.specifications?.[key];
}

export function firstNumber(value: string | undefined) {
  if (!value) {
    return 0;
  }

  const match = value.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function normalize(value: string | undefined) {
  return value?.toLowerCase().replace(/\s+/g, '') ?? '';
}

function includesNormalized(haystack: string | undefined, needle: string | undefined) {
  const normalizedNeedle = normalize(needle);
  return Boolean(normalizedNeedle) && normalize(haystack).includes(normalizedNeedle);
}

export function socketsMatch(a: string | undefined, b: string | undefined) {
  return Boolean(a && b) && normalize(a) === normalize(b);
}

export function estimateWattage(build: PCBuild) {
  const cpu = Math.max(firstNumber(getSpec(build.cpu, 'TDP')), firstNumber(getSpec(build.cpu, 'Max Turbo Power')));
  const gpu = firstNumber(getSpec(build.gpu, 'Power Consumption'));
  const extras =
    (build.cooling ? 15 : 0) + (build.storage ? 10 : 0) + (build.ram ? 12 : 0) + (build.motherboard ? 50 : 0);

  // 60W baseline covers fans, USB devices and conversion losses.
  return cpu + gpu + extras + 60;
}

export function recommendedPsuWattage(build: PCBuild) {
  return Math.max(Math.ceil(estimateWattage(build) * 1.25), firstNumber(getSpec(build.gpu, 'Recommended PSU')));
}

export function runCompatibilityChecks(build: PCBuild): CheckResult[] {
  const checks: CheckResult[] = [];
  const cpuSocket = getSpec(build.cpu, 'Socket');
  const boardSocket = getSpec(build.motherboard, 'Socket');
  const ramType = getSpec(build.ram, 'Type');
  const boardMemory = getSpec(build.motherboard, 'Memory');
  const coolerSockets = getSpec(build.cooling, 'Socket');
  const psuWattage = firstNumber(getSpec(build.psu, 'Wattage'));

  if (build.cpu && build.motherboard && cpuSocket && boardSocket) {
    const ok = socketsMatch(cpuSocket, boardSocket);
    checks.push({
      id: 'socket',
      status: ok ? 'pass' : 'fail',
      message: ok
        ? `CPU and board share the ${cpuSocket} socket.`
        : `CPU is ${cpuSocket} but the board is ${boardSocket}.`,
    });
  }

  if (build.ram && build.motherboard && ramType && boardMemory) {
    const ok = includesNormalized(boardMemory, ramType);
    checks.push({
      id: 'memory',
      status: ok ? 'pass' : 'fail',
      message: ok ? `Board supports ${ramType} memory.` : `Board does not list ${ramType} support.`,
    });
  }

  if (build.cooling && build.cpu && cpuSocket && coolerSockets) {
    const ok = includesNormalized(coolerSockets, cpuSocket);
    checks.push({
      id: 'cooler',
      status: ok ? 'pass' : 'fail',
      message: ok ? `Cooler mounts on ${cpuSocket}.` : `Cooler has no ${cpuSocket} mounting kit listed.`,
    });
  }

  if (build.psu && psuWattage > 0) {
    const needed = recommendedPsuWattage(build);
    const ok = psuWattage >= needed;
    checks.push({
      id: 'power',
      status: ok ? 'pass' : 'fail',
      message: ok
        ? `${psuWattage}W covers the ${needed}W recommendation.`
        : `${psuWattage}W is under the ${needed}W recommendation.`,
    });
  }

  return checks;
}

/** Parts in the catalog that are known to fit with the given product. */
export function findCompatibleParts(product: Product, catalog: Product[]) {
  const socket = getSpec(product, 'Socket');
  const memoryType = getSpec(product, 'Type');
  const boardMemory = getSpec(product, 'Memory');
  const others = catalog.filter((entry) => entry.id !== product.id);

  switch (product.category) {
    case 'Processors':
      return others.filter(
        (entry) =>
          (entry.category === 'Motherboards' && socketsMatch(getSpec(entry, 'Socket'), socket)) ||
          (entry.category === 'Cooling' && includesNormalized(getSpec(entry, 'Socket'), socket)),
      );
    case 'Motherboards':
      return others.filter(
        (entry) =>
          (entry.category === 'Processors' && socketsMatch(getSpec(entry, 'Socket'), socket)) ||
          (entry.category === 'Memory (RAM)' && includesNormalized(boardMemory, getSpec(entry, 'Type'))),
      );
    case 'Memory (RAM)':
      return others.filter(
        (entry) => entry.category === 'Motherboards' && includesNormalized(getSpec(entry, 'Memory'), memoryType),
      );
    case 'Cooling':
      return others.filter(
        (entry) => entry.category === 'Processors' && includesNormalized(socket, getSpec(entry, 'Socket')),
      );
    case 'Graphics Cards': {
      const needed = firstNumber(getSpec(product, 'Recommended PSU'));
      return others.filter(
        (entry) => entry.category === 'Power Supplies' && firstNumber(getSpec(entry, 'Wattage')) >= needed,
      );
    }
    default:
      return [];
  }
}
