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
  { text: "Imaginas-te na tua profissão atual daqui a 5 ou 10 anos?", measures: "Desejo real de mudança", options: [
    { label: "Não. Sinto claramente que preciso de uma mudança de carreira", points: 3 },
    { label: "Tenho muitas dúvidas e acredito que vou mudar", points: 2 },
    { label: "Talvez, mas ainda não tenho a certeza", points: 1 },
    { label: "Sim. Vejo-me perfeitamente a continuar onde estou", points: 0 }
  ] },
  { text: "O que mais te faria mudar de profissão neste momento?", measures: "Motivação dominante", options: [
    { label: "Mais rendimento, maior crescimento e mais autonomia", points: 3 },
    { label: "Mais perspetiva de evolução e um trabalho com mais sentido", points: 2 },
    { label: "Mais tempo e menos stress, mesmo sem grande ambição de crescimento", points: 1 },
    { label: "Procurar algo mais previsível e com menos exigência", points: 0 }
  ] },
  { text: "Até que ponto valorizas autonomia no teu dia a dia profissional?", measures: "Encaixe com o modelo de trabalho", options: [
    { label: "Valorizo muito trabalhar com autonomia e responsabilidade", points: 3 },
    { label: "Gosto de alguma autonomia, desde que exista orientação", points: 2 },
    { label: "Prefiro funções muito estruturadas e definidas", points: 1 },
    { label: "Não gosto de autonomia; prefiro instruções constantes", points: 0 }
  ] },
  { text: "Como reages quando tens de aprender algo completamente novo?", measures: "Abertura à aprendizagem", options: [
    { label: "Entusiasma-me e gosto de aprender rapidamente", points: 3 },
    { label: "Adapto-me bem, mesmo que precise de algum tempo", points: 2 },
    { label: "Sinto resistência inicial, mas tento adaptar-me", points: 1 },
    { label: "Evito sair da minha zona de conforto", points: 0 }
  ] },
  { text: "Como te descreves na relação com outras pessoas?", measures: "Conforto relacional", options: [
    { label: "Gosto de comunicar, criar relações e lidar com pessoas diferentes", points: 3 },
    { label: "Sinto-me confortável a comunicar e a conhecer novas pessoas", points: 2 },
    { label: "Comunico bem, mas só em contextos mais familiares", points: 1 },
    { label: "Não gosto muito de contacto frequente com pessoas", points: 0 }
  ] },
  { text: "Como lidas com objetivos e desempenho?", measures: "Orientação para resultados", options: [
    { label: "Gosto de trabalhar com objetivos e isso motiva-me", points: 3 },
    { label: "Consigo trabalhar com objetivos, desde que haja acompanhamento", points: 2 },
    { label: "Prefiro funções onde não exista pressão por resultados", points: 1 },
    { label: "Não gosto de trabalhar com metas nem avaliação de desempenho", points: 0 }
  ] },
  { text: "Se tivesses uma semana difícil ou ouvisses vários “nãos”, como reagias?", measures: "Resiliência", options: [
    { label: "Mantinha o foco, aprendia com a situação e continuava", points: 3 },
    { label: "Ficava afetado, mas recuperava e voltava a tentar", points: 2 },
    { label: "Desmotivava-me facilmente e precisaria de tempo para recuperar", points: 1 },
    { label: "Perdia rapidamente a vontade e questionava se valia a pena continuar", points: 0 }
  ] },
  { text: "Que importância dás à formação e ao desenvolvimento pessoal?", measures: "Valorização da formação", options: [
    { label: "Muito alta; procuro aprender continuamente", points: 3 },
    { label: "Considero importante e valorizo quando existe boa formação", points: 2 },
    { label: "Acho útil, mas não procuro isso ativamente", points: 1 },
    { label: "Não valorizo muito formação nem desenvolvimento contínuo", points: 0 }
  ] },
  { text: "Até que ponto sentes que o teu rendimento atual limita a vida que queres construir?", measures: "Ambição financeira", options: [
    { label: "Limita bastante e quero claramente aumentar o meu potencial de rendimento", points: 3 },
    { label: "Limita em parte e gostava de ter mais margem de crescimento", points: 2 },
    { label: "Não é ideal, mas não é uma prioridade forte para mim", points: 1 },
    { label: "Estou confortável e não valorizo especialmente aumentar rendimento", points: 0 }
  ] },
  { text: "Acreditas que poderias ter um desempenho forte se tivesses a formação, o acompanhamento e as ferramentas certas?", measures: "Crença no próprio potencial", options: [
    { label: "Sim, acredito muito no meu potencial quando tenho estrutura para crescer", points: 3 },
    { label: "Sim, acredito que me poderia adaptar bem", points: 2 },
    { label: "Talvez, mas tenho algumas dúvidas sobre mim próprio", points: 1 },
    { label: "Não. Acho que provavelmente não seria uma área para mim", points: 0 }
  ] }
] as const;

export const mailerliteGroupEnvByLevel: Record<RecruitmentLevel, string> = {
  muito_alinhado: "MAILERLITE_RECRUTAMENTO_GRUPO_MUITO_ALINHADO",
  bom_potencial: "MAILERLITE_RECRUTAMENTO_GRUPO_BOM_POTENCIAL",
  potencial_com_reservas: "MAILERLITE_RECRUTAMENTO_GRUPO_COM_RESERVAS",
  menos_alinhado: "MAILERLITE_RECRUTAMENTO_GRUPO_MENOS_ALINHADO"
};

export function getRecruitmentLevel(score: number): RecruitmentLevel {
  if (score >= 24) return "muito_alinhado";
  if (score >= 18) return "bom_potencial";
  if (score >= 12) return "potencial_com_reservas";
  return "menos_alinhado";
}

export function scoreRecruitmentAnswers(answers: number[]) {
  if (answers.length !== recruitmentQuestions.length || answers.some((answer, index) => !Number.isInteger(answer) || answer < 0 || answer >= recruitmentQuestions[index].options.length)) {
    throw new Error("Respostas de triagem inválidas");
  }
  const score = answers.reduce((total, answer, index) => total + recruitmentQuestions[index].options[answer].points, 0);
  return { score, level: getRecruitmentLevel(score) };
}
