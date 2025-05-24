
**Prompt para Agente de IA Dev:**

Crie um scaffolding de backend moderno utilizando **NestJS** com **TypeScript**, integrado ao **Supabase** como backend-as-a-service (incluindo autenticação e banco de dados). O projeto deve conter as seguintes features e requisitos:

- **Autenticação completa** (login, registro, recuperação de senha) usando Supabase Auth.
- **Módulo de Dashboard** para exibir informações resumidas do sistema.
- **Módulo de Usuários** com CRUD completo.
- **Módulo de Catálogo** (CRUD de itens/produtos).
- **Módulo de Detalhe** para exibir informações detalhadas de um item do catálogo.
- **Documentação automática** com **Swagger** (OpenAPI), cobrindo todos os endpoints.
- Projeto totalmente em **TypeScript**.
- Estrutura de pastas organizada seguindo boas práticas do NestJS (modules, controllers, services, dtos, etc).
- Utilizar **princípios SOLID** e padrões modernos de desenvolvimento.
- **Arquivo `.env`** com as seguintes variáveis de ambiente (com valores de exemplo):
    - `SUPABASE_URL=https://your-supabase-url.supabase.co`
    - `SUPABASE_ANON_KEY=your-supabase-anon-key`
    - `SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key`
- Incluir exemplos de testes unitários para pelo menos um controller e um service.
- Instruções básicas de setup no README, incluindo como configurar as variáveis de ambiente.

**Observações:**
- Utilize as melhores práticas de segurança e organização de código.
- O código deve ser facilmente extensível para novos módulos.
- Utilize decorators e middlewares do NestJS quando apropriado.
- O projeto deve utilizar as variáveis de ambiente do arquivo `.env` para configurar a conexão com o Supabase.

---

Este prompt agora inclui a especificação do arquivo `.env` com as variáveis necessárias para a conexão com o Supabase.
