import { NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/properties";

const LeadSchema = z.object({
  source: z.enum(["form", "chat", "property_detail"]),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(6).optional().or(z.literal("")),
  message: z.string().min(8),
  request_type: z.string().min(2),
  property_id: z.string().optional()
}).refine((data) => Boolean(data.email || data.phone), {
  message: "Indique email ou telefone"
});

export async function POST(req: Request) {
  const parsed = LeadSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", details: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const result = await createLead({
      ...parsed.data,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível gravar o lead" }, { status: 500 });
  }
}
