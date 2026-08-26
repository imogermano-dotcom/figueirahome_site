const COMISSAO = 10000;

const BKTS = [
  { pct: 0.40, limit: 5, fee_mo: 0, fee_cmi: 0 },
  { pct: 0.50, limit: 7, fee_mo: 0, fee_cmi: 0 },
  { pct: 0.60, limit: 8, fee_mo: 100, fee_cmi: 100 },
  { pct: 0.70, limit: 10, fee_mo: 200, fee_cmi: 200 },
  { pct: 0.80, limit: 9999, fee_mo: 300, fee_cmi: 300 }
];

function startBkt(yearOfActivity: number) {
  return yearOfActivity <= 1 ? 0 : 1;
}

function netForDeals(dealsTarget: number, yearOfActivity: number, cmiRate: number) {
  if (dealsTarget <= 0) return 0;
  let bi = startBkt(yearOfActivity);
  let gross = 0;
  let fees = 0;
  let done = 0;
  const dealsPerMonth = dealsTarget / 12;

  while (bi < BKTS.length && done < dealsTarget) {
    const bkt = BKTS[bi];
    const cap = bkt.limit >= 9999 ? dealsTarget - done : bkt.limit;
    const inBkt = Math.min(dealsTarget - done, cap);
    const monthStart = done / dealsPerMonth;
    const monthEnd = (done + inBkt) / dealsPerMonth;

    gross += inBkt * COMISSAO * bkt.pct;
    if (bkt.fee_mo > 0) fees += (monthEnd - monthStart) * bkt.fee_mo;
    if (bkt.fee_cmi > 0) fees += inBkt * cmiRate * bkt.fee_cmi;

    done += inBkt;
    bi++;
  }
  return gross - fees;
}

function dealsForNet(target: number, yearOfActivity: number, cmiRate: number) {
  let lo = 0.5;
  let hi = 300;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (netForDeals(mid, yearOfActivity, cmiRate) < target) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

const GLOBALS = { dias_uteis_mes: 22 };
const BENCH: Record<number, { racio_pot: number; racio_ang: number; taxa_venda_cmi: number; ref_mo: number; taxa_fecho: number; racio_vp: number; racio_lv: number }> = {
  1: { racio_pot: 0.04, racio_ang: 0.10, taxa_venda_cmi: 0.30, ref_mo: 0, taxa_fecho: 0.50, racio_vp: 0.10, racio_lv: 0.20 },
  2: { racio_pot: 0.05, racio_ang: 0.15, taxa_venda_cmi: 0.40, ref_mo: 0, taxa_fecho: 0.60, racio_vp: 0.12, racio_lv: 0.25 },
  3: { racio_pot: 0.06, racio_ang: 0.20, taxa_venda_cmi: 0.50, ref_mo: 0, taxa_fecho: 0.70, racio_vp: 0.17, racio_lv: 0.30 }
};
function bench(yearOfActivity: number) {
  return BENCH[yearOfActivity] || BENCH[3];
}

export interface SimResult {
  contacts_mo: number;
  contacts_day?: number;
  cmi_wins_mo: number;
  leads_mo: number;
  visitas_mo: number;
  propostas_mo: number;
  deals_yr: number;
  net_yr: number;
  contacts_needed?: number;
  mult?: number;
  ano?: number;
}

function calcNeeded(netAnual: number, yearOfActivity: number): SimResult {
  const r = bench(yearOfActivity);
  const cmiRate = 1 / r.taxa_venda_cmi;

  const dealsYr = dealsForNet(netAnual, yearOfActivity, cmiRate);
  const dealsMo = dealsYr / 12;

  const cmiMo = dealsMo * cmiRate;
  const totalPot = cmiMo / r.racio_ang;
  const potCold = Math.max(0, totalPot - r.ref_mo);
  const ccMo = potCold / r.racio_pot;
  const ccDay = ccMo / GLOBALS.dias_uteis_mes;

  const propMo = dealsMo / r.taxa_fecho;
  const visMo = propMo / r.racio_vp;
  const leadsMo = visMo / r.racio_lv;

  return {
    contacts_mo: ccMo,
    contacts_day: ccDay,
    cmi_wins_mo: cmiMo,
    leads_mo: leadsMo,
    visitas_mo: visMo,
    propostas_mo: propMo,
    deals_yr: dealsYr,
    net_yr: netForDeals(dealsYr, yearOfActivity, cmiRate)
  };
}

function calcForward(ccMoBase: number, yearOfActivity: number): SimResult {
  const r = bench(yearOfActivity);
  const cmiRate = 1 / r.taxa_venda_cmi;

  const potCold = ccMoBase * r.racio_pot;
  const totalPot = potCold + r.ref_mo;
  const cmiMo = totalPot * r.racio_ang;
  const dealsYr = (cmiMo / cmiRate) * 12;

  const netYr = netForDeals(dealsYr, yearOfActivity, cmiRate);
  const dealsMo = dealsYr / 12;

  const propMo = dealsMo / r.taxa_fecho;
  const visMo = propMo / r.racio_vp;
  const leadsMo = visMo / r.racio_lv;

  return {
    contacts_mo: ccMoBase,
    cmi_wins_mo: cmiMo,
    leads_mo: leadsMo,
    visitas_mo: visMo,
    propostas_mo: propMo,
    deals_yr: dealsYr,
    net_yr: netYr
  };
}

// Horas/semana estimadas a partir do esforço do funil (mesmos pesos do motor original)
const HOURS_WEIGHTS = { contactsPerMonth: 2 / 5, cmiWinsPerMonth: 4, visitsPerMonth: 2, dealsPerMonthEquivalent: 2 };
export const HOURS_GREEN_MAX = 40;
export const HOURS_YELLOW_MAX = 55;
export const INCOME_MIN = 12000;
export const INCOME_MAX = 120000;
export const INCOME_STEP = 1000;
export const INCOME_DEFAULT = 30000;

export function estimatedHoursPerWeek(result: SimResult) {
  const monthlyHours = result.contacts_mo * HOURS_WEIGHTS.contactsPerMonth + result.cmi_wins_mo * HOURS_WEIGHTS.cmiWinsPerMonth + result.visitas_mo * HOURS_WEIGHTS.visitsPerMonth + (result.deals_yr / 12) * HOURS_WEIGHTS.dealsPerMonthEquivalent;
  return Math.round(monthlyHours / 4.3);
}

export function calcAno1(netAnual: number): SimResult {
  return calcNeeded(netAnual, 1);
}

export function calc3anos(netAnual: number): Array<SimResult & { ano: number; contacts_needed: number; mult: number }> {
  const a1 = calcNeeded(netAnual, 1);
  const cc1 = a1.contacts_mo;
  let net1: number | null = null;
  return [1, 2, 3].map((year) => {
    const forward = calcForward(cc1, year);
    if (year === 1) net1 = forward.net_yr;
    const needed = calcNeeded(netAnual, year);
    return {
      ano: year,
      ...forward,
      contacts_needed: needed.contacts_mo,
      mult: net1 && net1 > 0 ? forward.net_yr / net1 : 1
    };
  });
}

export function fmt(v: number | null | undefined, decimals = 1) {
  if (v == null) return "—";
  return v.toFixed(decimals);
}

export function fmtE(v: number | null | undefined) {
  if (v == null) return "—";
  return `€ ${Math.round(v).toLocaleString("pt-PT")}`;
}

// ── Dados do gráfico "Salário mínimo vs. Simulação imobiliária" (5 anos) ──
export const MIN_WAGE_BY_YEAR = [920, 970, 1020, 1070, 1120];
export const SIMULATION_BY_YEAR_MONTH = [
  [0, 0, 0, 1000, 1200, 1400, 1550, 1650, 1750, 1850, 2200, 2400],
  [2405, 2428, 2452, 2475, 2499, 2522, 2546, 2569, 2593, 2616, 2640, 2668],
  [3725, 3841, 3957, 4073, 4189, 4305, 4421, 4537, 4653, 4769, 4885, 5000],
  [5002, 5021, 5041, 5060, 5079, 5098, 5118, 5137, 5156, 5175, 5195, 5211],
  [5250, 5412, 5574, 5736, 5898, 6060, 6222, 6384, 6546, 6708, 6870, 7034]
];
export const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
