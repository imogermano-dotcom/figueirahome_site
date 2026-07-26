export const recruitmentLevels = [
  "muito_alinhado",
  "bom_potencial",
  "potencial_com_reservas",
  "menos_alinhado"
] as const;

export type RecruitmentLevel = (typeof recruitmentLevels)[number];

export const recruitmentLevelLabels: Record<RecruitmentLevel, string> = {
  muito_alinhado: "Perfil muito alinhado",
  bom_potencial: "Bom potencial",
  potencial_com_reservas: "Potencial com reservas",
  menos_alinhado: "Menos alinhado nesta fase"
};

export const recruitmentQuestions = [
  { question: "O que o motiva a procurar uma nova fase profissional?", options: ["Quero construir uma carreira com autonomia e objetivos claros", "Procuro uma mudança, mas ainda estou a explorar opções", "Estou apenas a conhecer a oportunidade"] },
  { question: "Como se sente perante objetivos comerciais?", options: ["Motivam-me e ajudam-me a manter o foco", "Consigo trabalhar com objetivos quando tenho orientação", "Prefiro funções sem objetivos comerciais"] },
  { question: "Qual é a sua disponibilidade para aprender uma nova profissão?", options: ["Tenho disponibilidade para investir tempo e aplicar o que aprendo", "Consigo reservar algum tempo todas as semanas", "Neste momento tenho pouca disponibilidade"] },
  { question: "Como reage quando uma conversa ou negociação não corre como esperava?", options: ["Analiso, ajusto e volto a tentar", "Preciso de apoio, mas procuro aprender com a situação", "Tendo a desmotivar-me e a evitar repetir a situação"] },
  { question: "Que importância tem para si acompanhar pessoas numa decisão relevante?", options: ["É um tipo de trabalho que me realiza", "Interessa-me, desde que tenha método", "Não é algo que procure ativamente"] },
  { question: "Como organiza o seu trabalho diário?", options: ["Defino prioridades e acompanho os meus compromissos", "Organizo-me melhor com ferramentas e orientação", "Prefiro lidar com as tarefas à medida que surgem"] },
  { question: "Que relação tem com ferramentas digitais?", options: ["Uso-as com facilidade e estou disponível para aprender novas", "Consigo aprender com acompanhamento", "Prefiro evitar novas ferramentas sempre que possível"] },
  { question: "Como se sente a iniciar conversas com pessoas novas?", options: ["Sinto-me à vontade e gosto de criar relações", "Consigo fazê-lo depois de ganhar confiança", "É algo que evito sempre que possível"] },
  { question: "Quando recebe orientação, como costuma agir?", options: ["Aplico rapidamente e peço feedback", "Preciso de algum tempo para ganhar confiança", "Prefiro encontrar sempre o meu próprio método"] },
  { question: "O que espera encontrar numa equipa?", options: ["Acompanhamento, exigência e oportunidade de crescer", "Um ambiente estável onde possa aprender", "Principalmente flexibilidade, sem acompanhamento próximo"] }
] as const;

export function getRecruitmentLevel(score: number): RecruitmentLevel {
  if (score >= 25) return "muito_alinhado";
  if (score >= 20) return "bom_potencial";
  if (score >= 15) return "potencial_com_reservas";
  return "menos_alinhado";
}

export function scoreRecruitmentAnswers(answers: number[]) {
  if (answers.length !== recruitmentQuestions.length || answers.some((answer) => !Number.isInteger(answer) || answer < 0 || answer > 2)) {
    throw new Error("Respostas de triagem inválidas");
  }
  const score = answers.reduce((total, answer) => total + (3 - answer), 0);
  return { score, level: getRecruitmentLevel(score) };
}
