import type { Agent } from "./types";

export type TeamMember = Omit<Agent, "photo_url"> & {
  photo_url: string;
  bio: string;
};

export const figueiraTeam: TeamMember[] = [
  {
    id: "sofia-monteiro",
    name: "Sofia Monteiro",
    role: "Sócia e Gerente",
    phone: null,
    email: null,
    photo_url: "/equipa/sofia-monteiro.png",
    bio: "Responsável pelo acompanhamento processual, documentação e preparação das escrituras."
  },
  {
    id: "miguel-germano",
    name: "Miguel Germano",
    role: "Diretor Comercial",
    phone: "+351 913 702 002",
    email: "geral.figueirahome@gmail.com",
    photo_url: "/equipa/miguel-germano.png",
    bio: "Ligado à mediação imobiliária desde 2006, com experiência comercial e de gestão de agências."
  },
  {
    id: "alexandra",
    name: "Alexandra",
    role: "Consultora",
    phone: null,
    email: null,
    photo_url: "/equipa/alexandra.png",
    bio: "Com formação em Design de Comunicação e Produção Audiovisual, cria conteúdo para a apresentação dos imóveis."
  },
  {
    id: "giulia-almeida",
    name: "Giulia Almeida",
    role: "Editora de Vídeo",
    phone: null,
    email: null,
    photo_url: "/equipa/giulia-almeida.png",
    bio: "Editora de vídeo com experiência em produção audiovisual para marcas e projetos tecnológicos."
  },
  {
    id: "alexsandra-ferreira",
    name: "Alexsandra Ferreira",
    role: "Consultora",
    phone: null,
    email: null,
    photo_url: "/equipa/alexsandra-ferreira.png",
    bio: "Com um percurso no comércio e vendas, acompanha clientes na procura e escolha do imóvel certo."
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
