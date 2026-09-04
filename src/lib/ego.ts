const EGO_LEAD_URL = "http://websiteapi.egorealestate.com/v1/Lead";

export async function sendLeadToEgo(input: { egoId: number; name: string; email?: string; phone?: string; message: string }) {
  const token = process.env.EGO_LEAD_API_TOKEN;
  if (!token) return { status: "pendente" as const, error: "Configuração eGO em falta" };
  try {
    const params = new URLSearchParams({
      CTY: "4",
      RID: String(input.egoId),
      NAM: input.name,
      EML: input.email || "",
      PHO: input.phone || "",
      OBS: input.message
    });
    const response = await fetch(`${EGO_LEAD_URL}?${params.toString()}`, {
      method: "PUT",
      headers: { AuthorizationToken: token }
    });
    return response.ok
      ? { status: "sincronizado" as const, error: null }
      : { status: "erro" as const, error: `eGO respondeu ${response.status}` };
  } catch (error) {
    console.error("eGO lead request failed", error);
    return { status: "erro" as const, error: "Não foi possível contactar o eGO" };
  }
}
