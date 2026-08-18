import type { Agent } from "./types";

export type TeamMember = Omit<Agent, "photo_url"> & {
  photo_url: string;
  bio: string;
  profile_bio?: string[];
  aliases?: string[];
};

export const figueiraTeam: TeamMember[] = [
  {
    id: "sofia-monteiro",
    name: "Sofia Monteiro",
    role: "Sócia e Gerente",
    phone: null,
    email: null,
    photo_url: "/equipa/SOFIA%20MONTEIRO.png",
    bio: "Responsável pelo acompanhamento processual, documentação e preparação das escrituras."
  },
  {
    id: "miguel-germano",
    name: "Miguel Germano",
    role: "Diretor Comercial",
    phone: "+351 913 702 002",
    email: "geral.figueirahome@gmail.com",
    photo_url: "/equipa/MIGUEL%20GERMANO.png",
    bio: "Ligado à mediação imobiliária desde 2006, com experiência comercial e de gestão de agências."
  },
  {
    id: "alexandra-santos",
    name: "Alexandra Santos",
    role: "Consultora",
    phone: null,
    email: null,
    photo_url: "/equipa/ALEXANDRA%20SANTOS.png",
    bio: "Consultora com formação em Design de Comunicação e Produção Audiovisual, alia proximidade, escuta e comunicação clara.",
    aliases: ["Alexandra"],
    profile_bio: [
      "Natural de Castelo Branco, foi na Figueira da Foz que encontrou o seu lugar e construiu a sua vida. Mãe de gémeos, conhece de perto o significado de procurar um lar: um espaço onde nascem memórias, a família cresce em segurança e cada sonho encontra lugar.",
      "A formação em Design de Comunicação e Produção Audiovisual levou-a a contar histórias através de imagens. Hoje, abraça um novo desafio como consultora imobiliária, colocando essa sensibilidade ao serviço de cada cliente.",
      "Para a Alexandra, comprar ou vender uma casa é muito mais do que uma transação: é uma decisão que muda vidas, marca novos começos e concretiza sonhos. Por isso, acompanha cada processo com dedicação, empatia e o compromisso de ouvir e compreender.",
      "Com transparência, profissionalismo e proximidade, ajuda cada pessoa a encontrar o lugar onde poderá escrever os próximos capítulos da sua vida."
    ]
  },
  {
    id: "giulia-almeida",
    name: "Giulia Almeida",
    role: "Editora de Vídeo",
    phone: null,
    email: null,
    photo_url: "/equipa/GIULIA%20ALMEIDA.png",
    bio: "Editora de vídeo com experiência em produção audiovisual para marcas e projetos tecnológicos."
  },
  {
    id: "alexsandra-ferreira",
    name: "Alexsandra Ferreira",
    role: "Consultora",
    phone: null,
    email: null,
    photo_url: "/equipa/ALEXSANDRA%20FERREIRA.png",
    bio: "Com experiência em vendas, acompanha cada cliente com transparência, honestidade e dedicação.",
    profile_bio: [
      "Mãe de duas crianças e imigrante brasileira em Portugal, a Alexsandra Ferreira recomeçou a sua vida com o objetivo de dar o melhor à sua família.",
      "Com oito anos de experiência em vendas no setor de equipamentos para construção civil e dois anos em televendas, decidiu abraçar o imobiliário como um novo desafio: uma área onde pode crescer e apoiar pessoas em momentos decisivos.",
      "Para a Alexsandra, vender um imóvel é mais do que um processo comercial. É muitas vezes o fim de um capítulo e o início de um novo caminho. Por isso, atua com transparência, honestidade e foco total na satisfação de cada cliente.",
      "Se procura um acompanhamento humano, sério e dedicado, está pronta para o acompanhar."
    ]
  },
  {
    id: "sandra-silva",
    name: "Sandra Silva",
    role: "Consultora",
    phone: null,
    email: null,
    photo_url: "/equipa/SANDRA%20SILVA.png",
    bio: "Consultora imobiliária dedicada a simplificar cada decisão com proximidade, confiança e transparência.",
    profile_bio: [
      "Mãe de dois rapazes, consultora imobiliária e apaixonada por ajudar pessoas a encontrar o lugar onde novas histórias começam.",
      "Para a Sandra, comprar ou vender um imóvel é uma decisão importante. Por isso, está presente em cada etapa, ouvindo, compreendendo e encontrando as melhores soluções para cada cliente.",
      "A sua missão é tornar todo o processo mais simples, transparente e tranquilo, com um acompanhamento personalizado baseado na confiança, dedicação e compromisso.",
      "Mais do que imóveis, acompanha pessoas na concretização dos seus sonhos."
    ]
  }
];

export const sampleAgents: Agent[] = figueiraTeam.map((member) => ({
  id: member.id,
  name: member.name,
  role: member.role,
  phone: member.phone,
  email: member.email,
  photo_url: member.photo_url
}));
