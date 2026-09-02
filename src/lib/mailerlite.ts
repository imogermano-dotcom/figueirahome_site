export async function upsertMailerLiteSubscriber(input: { email: string; groupId?: string; fields: Record<string, string> }) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey || !input.groupId) return { status: "pendente" as const, error: "Configuração MailerLite em falta" };
  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email, groups: [input.groupId], fields: input.fields })
    });
    return response.ok
      ? { status: "sincronizado" as const, error: null }
      : { status: "erro" as const, error: `MailerLite respondeu ${response.status}` };
  } catch (error) {
    console.error("MailerLite request failed", error);
    return { status: "erro" as const, error: "Não foi possível contactar o MailerLite" };
  }
}
