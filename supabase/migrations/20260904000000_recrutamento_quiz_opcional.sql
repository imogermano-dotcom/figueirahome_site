-- Migration — permitir candidatura sem quiz em `recrutamento`
--
-- RecruitmentLeadForm deixa de fabricar respostas fictícias quando a
-- pessoa se candidata sem ter feito o questionário (havia 3 caminhos no
-- /recrutamento que levam direto ao formulário, sem passar pelo quiz).
-- O fallback anterior (Array(10).fill(0)) dava sempre pontuação 30/30
-- "muito_alinhado" — não zero, porque a opção de índice 0 é sempre a de
-- mais pontos em cada pergunta. Passa a gravar-se `null` nestes três
-- campos em vez de um resultado fabricado.
--
-- CHECK constraints existentes (recrutamento_pontuacao_check,
-- recrutamento_nivel_check) já toleram NULL automaticamente — só é
-- preciso remover o NOT NULL.

alter table recrutamento alter column pontuacao drop not null;
alter table recrutamento alter column nivel drop not null;
alter table recrutamento alter column quiz_respostas drop not null;
