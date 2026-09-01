import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";
import { createLead, getProperties, getPropertyBySlug } from "@/lib/properties";
import { formatArea, formatCurrency } from "@/lib/format";

export const maxDuration = 30;

const instructions = `És o assistente da Figueira Home, imobiliária licenciada AMI 7968 em Buarcos, Figueira da Foz.
Responde em português europeu, com tom claro e profissional.
Podes responder sobre compra, venda, arrendamento, trespasses, avaliação gratuita, zonas da Figueira da Foz e contactos.
Não inventes imóveis, preços, disponibilidade, horários ou promessas comerciais.
Quando falares de áreas usa sempre m² e recusa converter para outra unidade no contexto dos imóveis publicados.
Para recomendar imóveis, usa a ferramenta searchProperties e sugere apenas resultados devolvidos, com links /imoveis/[slug].
Antes de criar um lead por chat, confirma que tens nome e pelo menos email ou telefone.`;

export async function POST(req: Request) {
  let messages: UIMessage[];
  try {
    ({ messages } = await req.json());
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "messages must be a non-empty array" }, { status: 400 });
  }

  const result = streamText({
    model: process.env.AI_MODEL || "openai/gpt-5.4",
    system: instructions,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      searchProperties: tool({
        description: "Pesquisa imóveis publicados por filtros.",
        inputSchema: z.object({
          negocio: z.enum(["comprar", "arrendar", "trespassar"]).optional(),
          tipo: z.string().optional(),
          localizacao: z.string().optional(),
          preco_max: z.number().optional(),
          quartos_min: z.number().optional(),
          area_min: z.number().optional()
        }),
        execute: async (input) => {
          const rows = await getProperties({
            negocio: input.negocio,
            tipo: input.tipo,
            localizacao: input.localizacao,
            preco_max: input.preco_max ? String(input.preco_max) : undefined,
            quartos_min: input.quartos_min ? String(input.quartos_min) : undefined,
            area_min: input.area_min ? String(input.area_min) : undefined
          });
          return rows.slice(0, 6).map((property) => ({
            title: property.title,
            type: property.type,
            location: property.location,
            price: formatCurrency(property.price),
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: formatArea(property.area_sqm),
            url: `/imoveis/${property.slug}`
          }));
        }
      }),
      getPropertyBySlug: tool({
        description: "Obtém um imóvel publicado pelo slug.",
        inputSchema: z.object({ slug: z.string() }),
        execute: async ({ slug }) => {
          const property = await getPropertyBySlug(slug);
          if (!property) return null;
          return {
            title: property.title,
            type: property.type,
            location: property.location,
            price: formatCurrency(property.price),
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            area: formatArea(property.area_sqm),
            url: `/imoveis/${property.slug}`
          };
        }
      }),
      createLead: tool({
        description: "Cria lead depois de recolher nome e email ou telefone.",
        inputSchema: z.object({
          name: z.string().min(2),
          email: z.string().email().optional(),
          phone: z.string().min(6).optional(),
          message: z.string().min(8),
          request_type: z.string().min(2),
          property_slug: z.string().optional()
        }).refine((data) => Boolean(data.email || data.phone), { message: "email ou telefone obrigatório" }),
        execute: async (input) => {
          const property = input.property_slug ? await getPropertyBySlug(input.property_slug) : null;
          const lead = await createLead({
            source: "chat",
            name: input.name,
            email: input.email,
            phone: input.phone,
            message: input.message,
            request_type: input.request_type,
            property_id: property?.id
          });
          return { ok: true, leadId: lead.id };
        }
      })
    }
  });

  return result.toUIMessageStreamResponse();
}
