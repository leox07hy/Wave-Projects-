# PROMPT DE CONTEXTO PARA O CLAUDE — CONTINUIDADE DO NFC MANAGER

Você está recebendo um projeto inicial funcional chamado **NFC Manager**, feito em Next.js App Router + TypeScript + Supabase. Leia primeiro o `README.md`, percorra todos os arquivos e entenda a arquitetura antes de alterar qualquer coisa.

## Objetivo do sistema

Gerenciar plaquinhas NFC e QR Code para estabelecimentos. O administrador cadastra um PIX ou Wi-Fi. O sistema guarda os dados e gera um link público aleatório e exclusivo para o cadastro. Esse link será gravado na tag NFC e transformado em QR Code físico.

### Fluxo PIX

- Cadastro: nome do estabelecimento; nome do titular opcional; chave PIX opcional; tipo de chave opcional; campo obrigatório PIX Copia e Cola.
- Página pública `/p/[slug]`: nome do estabelecimento, apresentação simples, código PIX Copia e Cola e botão grande **COPIAR PIX**.
- O botão deve copiar exatamente o conteúdo salvo no banco, sem editar, formatar ou truncar o valor copiado.

### Fluxo Wi-Fi

- Cadastro enxuto: nome do estabelecimento, nome da rede/SSID e senha.
- Página pública `/w/[slug]`: nome do estabelecimento, mensagem “Acesse já nosso Wi-Fi!”, nome da rede, senha e botão **COPIAR SENHA**.
- Não complicar a página pública com campos ou informações desnecessárias.

## REQUISITO INEGOCIÁVEL — NÃO QUEBRAR

**O LINK DE CADA PLAQUINHA PRECISA SER PERMANENTE.**

Quando um cadastro for editado (troca do código PIX, senha Wi-Fi, nome do estabelecimento ou qualquer outro dado), o `slug` e o link público precisam permanecer rigorosamente iguais. A página aberta pelo link antigo deve passar a exibir os dados atualizados.

Isso significa:

1. Criar o slug apenas uma vez, durante a inserção do cadastro.
2. Nunca gerar slug novo no fluxo de edição.
3. Nunca incluir `slug` no objeto de atualização do formulário.
4. Nunca exigir que o usuário regrave a tag NFC ou gere outro QR Code ao editar dados.
5. O QR Code deve codificar o mesmo link permanente.
6. Manter testes que comprovem que editar o cadastro não altera o slug.
7. Não substituir o registro por outro ao editar.

Essa regra é a principal promessa operacional do produto. Antes de qualquer refatoração, confirme que ela continua preservada.

## O que já existe no projeto

- Login com Supabase Auth em `/login`.
- Área administrativa protegida em `/admin`.
- Dashboard com contadores e listagem.
- Cadastro em `/admin/novo`.
- Detalhe com link, QR Code e informações em `/admin/[id]`.
- Edição em `/admin/[id]/editar`.
- Exclusão com confirmação.
- Páginas públicas PIX e Wi-Fi.
- Botões de copiar.
- SQL de tabela e RLS em `supabase/schema.sql`.
- Variáveis de ambiente de exemplo em `.env.example`.
- Instruções de setup e deploy em `README.md`.

## Stack e decisões técnicas

- Next.js 15 App Router, React 19, TypeScript.
- Supabase Auth e Postgres.
- RLS: o administrador autenticado só pode consultar/alterar os próprios cadastros.
- As páginas públicas consultam o registro no servidor por meio da service role key. Essa chave é secreta e jamais pode ir para o browser, Client Components, logs, repositório ou variável `NEXT_PUBLIC_`.
- O público não tem permissão de escrita.
- `slug` é único, aleatório e independente do UUID interno.
- URLs: `/p/[slug]` para PIX e `/w/[slug]` para Wi-Fi.
- O domínio final vem de `NEXT_PUBLIC_SITE_URL`.

## Sua primeira tarefa

1. Audite o projeto inteiro e identifique erros de compilação, incompatibilidades de versão, erros de TypeScript, problemas de autenticação, problemas de RLS e falhas de responsividade.
2. Instale dependências e rode o projeto. Execute `npm run build` e corrija os erros encontrados.
3. Verifique os fluxos completos: login, cadastro PIX, cadastro Wi-Fi, detalhes/QR Code, edição e exclusão.
4. Verifique especificamente que o slug não muda após editar. Faça um teste real com um registro de teste e compare a URL antes/depois.
5. Corrija qualquer problema sem remover funcionalidades já implementadas.
6. Atualize o README com as etapas reais que forem necessárias.

## Melhorias recomendadas depois da auditoria

- Busca por nome do estabelecimento e filtro PIX/Wi-Fi no painel.
- Paginação quando houver muitos registros.
- Mostrar confirmação visual ao copiar link, PIX ou senha (sem depender apenas de alertas).
- Ação para copiar link no dashboard.
- Validação de campos e mensagens de erro amigáveis em português.
- Tela de confirmação/recuperação de senha administrativa.
- Registro de status ativo/inativo sem apagar o cadastro, preservando o slug. Se implementar, deixar claro que desativar interrompe o acesso público, mas reativar recupera o mesmo link.
- Testes automatizados para garantir a permanência do link.
- Melhorias de acessibilidade e aparência mobile.

## Regras de trabalho

- Não reescreva tudo do zero sem necessidade.
- Não altere a stack sem justificar.
- Não invente credenciais ou valores de ambiente. Peça ao usuário para preencher `.env.local`.
- Não exponha `SUPABASE_SERVICE_ROLE_KEY`.
- Não habilite cadastro público de administradores.
- Não adicione acesso público direto à tabela no RLS só para facilitar a página pública.
- Nunca mude o slug ao editar.
- Se precisar alterar o schema, entregue SQL de migração seguro e explique onde executar.
- Preserve o idioma português do Brasil na interface.
- Ao terminar, entregue uma lista do que foi corrigido, comandos para rodar, variáveis que faltam configurar e passos exatos para publicar.

Comece pela auditoria e build, depois corrija os problemas encontrados. Não considere o projeto pronto para produção antes de testar a regra do link permanente.
