# NFC Manager — plaquinhas PIX e Wi-Fi

Aplicação web para cadastrar plaquinhas de estabelecimentos, gerar um link público individual e usar esse mesmo link na tag NFC e no QR Code físico.

## Regra essencial: link permanente

**O `slug` é criado somente no cadastro. A edição nunca gera ou altera o slug.** Assim, quando o cliente trocar a senha do Wi-Fi ou atualizar o PIX, o endereço gravado na tag NFC e impresso no QR Code continua funcionando. O formulário de edição atualiza somente os dados do cadastro. Não altere essa regra em futuras melhorias.

## Funcionalidades incluídas

- Login administrativo via Supabase Auth (sem cadastro público de usuários).
- Painel com total de plaquinhas, PIX e Wi-Fi.
- Cadastro, edição e exclusão de cadastros.
- PIX: estabelecimento, titular opcional, chave opcional, tipo de chave opcional e PIX Copia e Cola obrigatório.
- Página pública PIX com botão para copiar exatamente o código cadastrado.
- Wi-Fi: estabelecimento, nome da rede (SSID) e senha.
- Página pública Wi-Fi com mensagem “Acesse já nosso Wi-Fi!”, nome da rede e botão para copiar a senha.
- Slug aleatório individual e URL permanente.
- QR Code do link no detalhe administrativo.
- Layout responsivo para celular.
- RLS no Supabase: administrador autenticado só acessa seus próprios registros.
- Consulta pública feita no servidor; a chave `service_role` nunca é enviada ao navegador.

## Rotas

- `/login` — autenticação administrativa.
- `/admin` — painel/listagem.
- `/admin/novo` — novo cadastro.
- `/admin/[id]` — detalhes, URL e QR Code.
- `/admin/[id]/editar` — editar dados sem alterar o link.
- `/p/[slug]` — página pública PIX.
- `/w/[slug]` — página pública Wi-Fi.

## 1. Pré-requisitos

- Node.js 20 ou superior.
- Conta/projeto no Supabase.
- Conta no Vercel (opcional, recomendado para publicar).
- Domínio próprio (recomendado para links definitivos).

## 2. Configurar o Supabase

1. Crie um projeto no Supabase.
2. Abra **SQL Editor** e execute todo o conteúdo de `supabase/schema.sql`.
3. Em **Authentication > Users**, crie manualmente o usuário administrador (e-mail e senha). Não habilite cadastro público.
4. Em **Project Settings > API**, copie a Project URL, a chave `anon/public` e a chave `service_role`.
5. Não compartilhe a `service_role` e nunca coloque essa chave em variável `NEXT_PUBLIC_`.

A tabela não tem política pública de leitura. As páginas públicas consultam o registro pelo slug no servidor, usando a chave privilegiada guardada exclusivamente no ambiente do servidor.

## 3. Rodar localmente

Na pasta do projeto:

```bash
npm install
```

Copie `.env.example` para `.env.local` e preencha:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA
SUPABASE_SERVICE_ROLE_KEY=SUA_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Depois:

```bash
npm run dev
```

Abra `http://localhost:3000` e entre com o usuário administrador criado no Supabase.

## 4. Publicar na Vercel

1. Envie a pasta do projeto para um repositório privado no GitHub.
2. Importe o repositório na Vercel.
3. Cadastre na Vercel as quatro variáveis de ambiente listadas acima.
4. Em `NEXT_PUBLIC_SITE_URL`, informe o domínio final, por exemplo `https://links.suaempresa.com.br` (sem barra no final).
5. Faça o deploy.
6. Configure o domínio na Vercel e aguarde a propagação do DNS/SSL.
7. Teste login, criação, edição, página pública e QR Code.

**Atenção:** defina o domínio definitivo antes de gravar as primeiras tags e imprimir QR Codes. Trocar o domínio depois altera o endereço-base dos links, mesmo mantendo os slugs. Se precisar trocar de domínio no futuro, configure redirecionamento permanente do domínio antigo para o novo.

## 5. Teste obrigatório de permanência do link

1. Cadastre uma plaquinha de teste.
2. Copie o link e abra em janela anônima.
3. Edite o cadastro e troque o PIX Copia e Cola ou a senha Wi-Fi.
4. Abra novamente o **mesmo link antigo**.
5. Confirme que a página mostra os dados novos e que o endereço não mudou.
6. Confirme que o QR Code exibido no painel continua codificando exatamente o mesmo endereço.

## Segurança e operação

- Qualquer pessoa que possua o link público poderá ver/copiar os dados necessários para a ação. No Wi-Fi, isso inclui a senha da rede — é o propósito da plaquinha.
- Os slugs são aleatórios e não sequenciais, mas isso não substitui autorização quando dados precisarem ser privados.
- A exclusão desativa o link. Para manter um link ativo, prefira editar o cadastro em vez de excluir e criar outro.
- Faça backup periódico do banco.
- Não registre senhas reais de clientes em ambientes de teste.
- O botão de copiar usa a Clipboard API, que requer HTTPS em produção (localhost também é aceito pelos navegadores).
- O código PIX é exibido/copiado como texto; a aplicação não valida se o código pertence ao estabelecimento. Confira o código antes de publicar.

## Observações técnicas para continuidade

- Stack: Next.js App Router + TypeScript + Supabase + CSS próprio.
- Não existe API pública de escrita.
- O CRUD administrativo usa sessão Supabase e RLS.
- A leitura pública usa `src/lib/supabase/admin.ts`, exclusivamente em Server Components.
- A URL é formada por `NEXT_PUBLIC_SITE_URL` + `/p/slug` ou `/w/slug`.
- `src/components/CardForm.tsx` contém comentário explícito e lógica de edição que não atualiza `slug`.
