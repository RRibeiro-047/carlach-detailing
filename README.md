# Carlach Detailing - Sistema de Agendamentos

Sistema completo de gerenciamento de agendamentos para serviços de estética automotiva.

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


## Rotas

- `/` - Página de agendamento para clientes
- `/admin` - Dashboard administrativo

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
