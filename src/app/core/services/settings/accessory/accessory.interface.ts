import { Product } from "@core/services/settings/product/product.interface";
import { Endorsment } from "../endorsement/endorsement.interface";

export class Accessory {
  id: string;
  dateEffective: Date;
  actType: Endorsment;
  accessoryAmount: number;
  accessoryRisk: number;
  day: Date;
  hour: number;
  minute: number;
  effectiveDate?: string;
  product: Product;
  managementEntity: string;

  constructor(data: any = {}) {
    this.id = data.id ?? '';

    // dateEffective & day : toujours des Date
    this.dateEffective = toDate(data.dateEffective) ?? new Date();
    this.day = toDate(data.day) ?? new Date();

    // actType : l'objet d’avenant tel que renvoyé par l’API (si absent -> null)
    this.actType = data.actType ?? null;

    // montants & time
    this.accessoryRisk = toNumber(data.accessoryRisk, 0);
    this.accessoryAmount = toNumber(data.accessoryAmount, 0);
    this.hour = clampInt(toNumber(data.hour, 0), 0, 23);
    this.minute = clampInt(toNumber(data.minute, 0), 0, 59);

    // product : objet tel que renvoyé par l’API
    this.product = data.product ?? null;

    // managementEntity peut s'appeler managementEntityId côté API
    this.managementEntity = data.managementEntity ?? data.managementEntityId ?? '';

    // effectiveDate : chaîne lisible "le dd/MM à HH:MM"
    this.effectiveDate = formatDayHourMinute(this.day, this.hour, this.minute);
  }
}

/* ===== helpers internes (pas de changement de structure) ===== */

function toDate(v: any): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function toNumber(v: any, fallback = 0): number {
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

function clampInt(n: number, min: number, max: number): number {
  const x = Math.trunc(n);
  return Math.min(max, Math.max(min, isNaN(x) ? min : x));
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function formatDayHourMinute(day: Date, hour: number, minute: number): string {
  const dd = pad2(day.getDate());
  const mm = pad2(day.getMonth() + 1);
  const hh = pad2(hour);
  const mi = pad2(minute);
  return `le ${dd}/${mm} à ${hh}:${mi}`;
}
