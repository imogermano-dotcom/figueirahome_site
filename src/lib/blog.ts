export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
    items?: string[];
  }>;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "como-preparar-imovel-para-venda",
    category: "Vender",
    title: "Como preparar o seu imóvel para venda",
    description: "Documentação, apresentação e preço de mercado: os pontos a preparar antes de anunciar o seu imóvel.",
    readTime: "4 min de leitura",
    sections: [
      {
        title: "Comece pela informação essencial",
        paragraphs: [
          "Uma venda mais segura começa com informação completa e coerente. Antes de publicar o imóvel, reúna os elementos que ajudam a explicá-lo com rigor e permitem responder rapidamente às dúvidas de quem visita.",
          "A caderneta predial, a certidão do registo predial, a licença de utilização quando aplicável e o certificado energético são documentos que vale a pena confirmar atempadamente."
        ],
        items: [
          "Áreas, tipologia, ano de construção e estado de conservação.",
          "Custos associados relevantes, como condomínio ou IMI.",
          "Informação sobre obras, equipamentos e melhorias recentes."
        ]
      },
      {
        title: "Prepare a apresentação",
        paragraphs: [
          "A apresentação não muda o imóvel, mas torna mais fácil perceber o seu potencial. Espaços arrumados, luminosos e com circulação desimpedida ajudam as fotografias e tornam a visita mais objetiva.",
          "Fotografias atuais, uma descrição honesta e, quando fizer sentido, plantas ou vídeo permitem que cada contacto chegue já informado."
        ]
      },
      {
        title: "Defina um preço sustentado pelo mercado",
        paragraphs: [
          "O valor de anúncio deve considerar as características do imóvel e a procura na sua zona. Comparar imóveis semelhantes ajuda, mas não substitui uma análise que tenha em conta estado, localização, áreas e momento do mercado.",
          "Uma avaliação bem fundamentada cria expectativas realistas e melhora a qualidade das propostas recebidas."
        ]
      }
    ]
  },
  {
    slug: "comprar-casa-na-figueira-da-foz",
    category: "Comprar",
    title: "Comprar casa na Figueira da Foz",
    description: "O que avaliar por zona, tipologia e objetivo de utilização antes de tomar uma decisão.",
    readTime: "5 min de leitura",
    sections: [
      {
        title: "Comece pelo uso que vai dar à casa",
        paragraphs: [
          "A escolha de uma casa muda consoante procura residência permanente, uma segunda habitação ou um imóvel para investimento. Definir essa prioridade ajuda a estabelecer critérios claros de localização, dimensão e orçamento.",
          "Também é útil pensar no horizonte de utilização: as necessidades de hoje podem ser diferentes daqui a alguns anos."
        ]
      },
      {
        title: "Compare zonas com tempo",
        paragraphs: [
          "O centro da Figueira da Foz, Buarcos, Quiaios e as localidades envolventes oferecem contextos distintos. A proximidade à praia, serviços, escolas, acessos e rotina diária deve ser observada no local e em diferentes horários.",
          "Uma visita à zona é tão importante como a visita ao imóvel: permite perceber ruído, estacionamento, exposição solar e a envolvente real."
        ]
      },
      {
        title: "Analise o imóvel antes da proposta",
        paragraphs: [
          "Na visita, confirme áreas, estado de conservação, orientação, arrumação e funcionamento dos principais equipamentos. Peça a documentação disponível e esclareça os custos regulares antes de decidir.",
          "Se precisar de apoio, uma equipa local pode ajudar a organizar a informação e a acompanhar cada etapa da compra."
        ],
        items: [
          "Verifique o certificado energético e as condições de conforto.",
          "Confirme custos de condomínio, IMI e eventuais obras previstas.",
          "Tenha em conta os prazos de financiamento e de escritura."
        ]
      }
    ]
  }
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
