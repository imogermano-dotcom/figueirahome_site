insert into agents (name, role, phone, email)
values
  ('Sofia Monteiro', 'Sócia e Gerente', '+351 233 408 130', 'geral.figueirahome@gmail.com'),
  ('Miguel Germano', 'Diretor Comercial', '+351 913 702 002', 'geral.figueirahome@gmail.com'),
  ('Maria José Boia', 'Consultora', '+351 233 408 130', 'geral.figueirahome@gmail.com'),
  ('Alexandra Santos', 'Consultora', '+351 233 408 130', 'geral.figueirahome@gmail.com')
on conflict do nothing;

insert into properties (
  slug, title, description, business, type, location, price, bedrooms, bathrooms, area_sqm, status, featured, published
)
values
  ('apartamento-t2-terraco-piscina-buarcos', 'Terraço com piscina panorâmica e vista mar', 'Apartamento T2 em Buarcos com terraço, piscina panorâmica e vista sobre o mar.', 'comprar', 'Apartamento T2', 'Figueira da Foz - Buarcos', 420000, 2, 2, 120, 'Em Destaque', true, true),
  ('moradia-t3-quiaios-conforto', 'Tranquilidade e conforto em Quiaios', 'Moradia T3+1 em Quiaios, com áreas equilibradas e envolvente tranquila.', 'comprar', 'Moradia T3+1', 'Quiaios - Figueira da Foz', 299000, 4, 3, 137, 'Moradia', true, true),
  ('moradia-t7-luxo-vista-mar-serra', 'O Refúgio Perfeito - Vista sobre mar e serra', 'Moradia T7 de luxo na Figueira da Foz com vista ampla sobre mar e serra.', 'comprar', 'Moradia T7 de Luxo', 'Figueira da Foz', 1200000, 7, 5, 325, 'Vista Mar', true, true),
  ('apartamento-t2-buarcos-ate-300-mil', 'Apartamento T2 em Buarcos perto da marginal', 'Apartamento T2 em Buarcos com boa exposição solar e acesso rápido a serviços.', 'comprar', 'Apartamento T2', 'Buarcos', 285000, 2, 1, 92, 'Disponível', false, true)
on conflict (slug) do nothing;
