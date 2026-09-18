export async function sendEmail(input: { to: string; subject: string; html: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const remetente = process.env.RESEND_REMETENTE;
  if (!apiKey || !remetente) return { status: "erro" as const, error: "Configuração Resend em falta" };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: `Figueira Home <${remetente}>`, to: input.to, subject: input.subject, html: input.html })
    });
    return response.ok
      ? { status: "enviado" as const, error: null }
      : { status: "erro" as const, error: `Resend respondeu ${response.status}` };
  } catch (error) {
    console.error("Resend request failed", error);
    return { status: "erro" as const, error: "Não foi possível contactar o Resend" };
  }
}
