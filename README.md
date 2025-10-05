# Carlach Detailing - Sistema de Agendamentos

Sistema completo de gerenciamento de agendamentos para serviços de estética automotiva.

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm (vem com Node.js)

### Passos para instalação

1. **Clone o repositório**
\`\`\`bash
git clone <url-do-repositorio>
cd carlach-detailing
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
\`\`\`

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_supabase
\`\`\`

4. **Execute o projeto em desenvolvimento**
\`\`\`bash
npm run dev
\`\`\`

O sistema estará disponível em `http://localhost:3000`

### Scripts disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar o código

## Funcionalidades

### Para Clientes
- Formulário de agendamento intuitivo
- Seleção de pacotes de serviço (Básica, Premium, Detalhada)
- Seleção de tamanho do veículo (Sedan, SUV, Caminhonete)
- Serviço adicional de Aplicação de Cera
- Cálculo automático de preço baseado no serviço e tamanho
- Seleção de data e horário (Segunda a Sábado, 08:00-18:00)
- Verificação de disponibilidade de horários
- Campo para observações adicionais

### Para Administradores
- Dashboard protegido por senha
- Visualização de todos os agendamentos em cards
- Filtros por status (Pendente, Confirmado, Finalizado, Cancelado)
- Busca por nome, telefone ou modelo do veículo
- Alteração de status dos agendamentos
- Exclusão de agendamentos
- Integração automática com WhatsApp

### Integração WhatsApp
- Envio automático de mensagem ao confirmar agendamento
- Envio automático de mensagem ao finalizar serviço
- Botão para reenvio manual de mensagens
- Mensagens personalizadas com todos os detalhes do agendamento

## Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Supabase** - Banco de dados PostgreSQL
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI
- **localStorage** - Backup local dos dados

## Estrutura de Preços

### Pacotes de Serviço

**Sedan:**
- Básica: R$ 60,00
- Premium: R$ 90,00
- Detalhada: R$ 250,00

**SUV:**
- Básica: R$ 70,00
- Premium: R$ 110,00
- Detalhada: R$ 300,00

**Caminhonete:**
- Básica: R$ 80,00
- Premium: R$ 140,00
- Detalhada: R$ 400,00

### Serviço Adicional - Aplicação de Cera
- Sedan: R$ 40,00
- SUV: R$ 50,00
- Caminhonete: R$ 60,00

## Horário de Funcionamento

- **Dias:** Segunda a Sábado
- **Horário:** 08:00 às 18:00
- **Intervalo de almoço:** 12:00 às 13:00 (não disponível para agendamento)
- **Horários disponíveis:** 08:00, 09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00, 17:00

## Configuração do Banco de Dados

### 1. Criar conta no Supabase

Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.

### 2. Criar novo projeto

Crie um novo projeto no Supabase e anote a URL e a chave anônima.

### 3. Executar scripts SQL

Execute os seguintes scripts na ordem, através do SQL Editor do Supabase:

1. `scripts/01-create-appointments-table.sql` - Cria a tabela de agendamentos
2. `scripts/02-update-service-types.sql` - Atualiza os tipos de serviço
3. `scripts/03-add-wax-service.sql` - Adiciona o serviço de cera

### 4. Configurar variáveis de ambiente

Adicione as credenciais do Supabase no arquivo `.env.local`:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
\`\`\`

## Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

Ou use o botão "Publish" no v0.dev para deploy direto.

## Rotas

- `/` - Página de agendamento para clientes
- `/admin` - Dashboard administrativo (senha: carlachrodrigojoinville)

## Funcionalidades Técnicas

- **Sincronização Supabase + localStorage**: Dados salvos no Supabase com backup automático no localStorage
- **Fallback automático**: Se o Supabase falhar, o sistema usa localStorage
- **Verificação de disponibilidade**: Impede agendamentos duplicados no mesmo horário
- **Revalidação automática**: Dados atualizados em tempo real
- **Responsivo**: Interface adaptada para mobile, tablet e desktop
- **Acessibilidade**: Componentes com suporte a leitores de tela
- **Performance**: Otimizado com Server Components e Client Components
- **Tema personalizado**: Esquema de cores preto, amarelo e branco

## Suporte

Para suporte, entre em contato através do WhatsApp configurado no sistema.
