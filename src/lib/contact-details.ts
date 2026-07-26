export const fixedPhone = "+351 233 408 130";
export const mobilePhone = "+351 913 702 002";

export function phoneCallCost(phone: string | null | undefined) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.endsWith("233408130")) return "(custo de uma chamada para a rede fixa nacional)";
  if (digits.endsWith("913702002")) return "(custo de uma chamada para a rede móvel nacional)";
  return null;
}
