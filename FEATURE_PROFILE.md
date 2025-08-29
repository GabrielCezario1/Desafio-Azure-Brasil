# 👤 Feature: Perfil do Usuário Azure AD

## 📋 Descrição

Nova funcionalidade que exibe informações detalhadas do usuário autenticado e dados relacionados ao tenant do Azure Active Directory (Entra ID).

## 🎯 Funcionalidades Implementadas

### 📊 **Aba "Visão Geral"**
- **Informações Pessoais:**
  - Nome e cargo do usuário
  - ID único do usuário
  - Email principal e alternativo
  - Departamento e localização
  - Status da conta (Ativo/Inativo)
  - Data de criação da conta

- **Informações de Contato:**
  - Telefone comercial
  - Celular
  - Idioma preferido

- **Atividade de Login:**
  - Último login realizado
  - Último login bem-sucedido
  - Último login não interativo

### 🏢 **Aba "Tenant"**
- **Informações do Tenant:**
  - ID do tenant (com botão de cópia)
  - Nome do tenant
  - Tipo de tenant
  - País do tenant
  - Data de criação
  - Domínios verificados (destacando o padrão e inicial)

### 👥 **Aba "Meus Grupos"**
- Lista de grupos dos quais o usuário é membro
- Tipo de grupo (Microsoft 365 ou Segurança)
- Descrição dos grupos
- Data de criação dos grupos

### 🌐 **Aba "Usuários do Tenant"**
- Lista de usuários do tenant (limitado a 50)
- Nome, email e cargo
- Status da conta
- Data de criação da conta

## 🔧 Implementação Técnica

### **Serviços Criados:**

#### `GraphService` (`src/app/services/graph.service.ts`)
- Integração com Microsoft Graph API
- Métodos para buscar dados do usuário, tenant, grupos e usuários
- Tratamento de erros e permissões
- Cache local dos dados do perfil

#### `UserProfileComponent` (`src/app/features/user-profile/`)
- Componente standalone com interface responsiva
- Sistema de abas para organização das informações
- Loading states e tratamento de erros
- Navegação rápida entre páginas

### **Endpoints do Microsoft Graph Utilizados:**
- `GET /me` - Informações do usuário atual
- `GET /me/memberOf` - Grupos do usuário
- `GET /organization` - Informações do tenant
- `GET /users` - Usuários do tenant
- `GET /groups` - Grupos do tenant
- `GET /me?$select=signInActivity` (Beta) - Atividade de login

### **Permissões Necessárias:**
```typescript
scopes: [
  'User.Read',          // Ler perfil do usuário atual
  'User.Read.All',      // Ler todos os usuários do tenant
  'Directory.Read.All', // Ler informações do diretório
  'Group.Read.All',     // Ler grupos do tenant
  'profile',            // Perfil básico
  'email',              // Email
  'openid'              // OpenID Connect
]
```

## 🚀 Como Usar

### **1. Acessar a Feature:**
- Navegue até `/profile` ou clique no botão "Meu Perfil Azure" na home
- O usuário deve estar autenticado via Azure AD

### **2. Navegar pelas Abas:**
- **Visão Geral:** Informações pessoais e atividade
- **Tenant:** Dados da organização
- **Meus Grupos:** Grupos do usuário
- **Usuários do Tenant:** Lista de usuários (se tiver permissão)

### **3. Funcionalidades Interativas:**
- Botão "Atualizar" para recarregar os dados
- Botões de cópia para IDs
- Navegação rápida entre páginas

## 📱 Design Responsivo

- Interface adaptada para desktop, tablet e mobile
- Cards com hover effects
- Sistema de cores consistente
- Navegação por abas otimizada

## 🔐 Segurança e Permissões

- Dados carregados apenas com permissões adequadas
- Tratamento graceful quando permissões são negadas
- Informações sensíveis protegidas
- Cache local limpo ao fazer logout

## 🎨 Interface

- Design moderno com gradientes e sombras
- Ícones Bootstrap para melhor UX
- Badges e status coloridos
- Loading states com spinners
- Mensagens de erro amigáveis

## 🔄 Estados da Aplicação

- **Loading:** Spinner durante carregamento
- **Success:** Dados exibidos com sucesso
- **Error:** Mensagens de erro específicas
- **Empty:** Estados vazios informativos

## 📋 Exemplo de Uso

```typescript
// No componente
this.graphService.getUserProfile().subscribe({
  next: (profile) => {
    this.userProfile = profile;
  },
  error: (error) => {
    console.error('Erro ao carregar:', error);
    this.error = 'Erro ao carregar perfil';
  }
});
```

## 🚧 Limitações e Considerações

1. **Permissões:** Algumas informações podem não estar disponíveis dependendo das permissões concedidas
2. **Tenant:** Informações do tenant requerem permissões administrativas
3. **Rate Limits:** Microsoft Graph tem limites de requisições
4. **Beta APIs:** Algumas funcionalidades usam APIs em beta que podem mudar

## 🔮 Futuras Melhorias

- [ ] Cache mais inteligente com TTL
- [ ] Filtros e busca na lista de usuários
- [ ] Exportação de dados
- [ ] Integração com Microsoft Teams
- [ ] Histórico de atividades mais detalhado
- [ ] Configurações de perfil editáveis

---

✨ **Feature desenvolvida com foco em experiência do usuário e boas práticas de desenvolvimento Angular!**
