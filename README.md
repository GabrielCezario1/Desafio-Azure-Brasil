# 🚀 Desafio Azure Brasil Cloud

<div align="center">

![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

**Projeto FullStack demonstrando integração completa com Azure Entra ID e Microsoft Graph API**

[🌐 Demo](#-funcionalidades) • [📚 Documentação](#-estrutura-do-projeto) • [🚀 Como Rodar](#-como-rodar-o-projeto) • [🔗 Links](#-links-úteis)

</div>

---

## 📖 Sobre o Projeto

Este projeto foi desenvolvido especificamente para demonstrar competências técnicas em **desenvolvimento FullStack com integração Azure**, atendendo aos requisitos da vaga de **Desenvolvedor FullStack – Pleno .NET (Azure) / Vue.js** na **Azure Brasil Cloud**.

### 🎯 **Objetivo Principal**
Demonstrar proficiência em desenvolvimento .NET moderno, e criação de SPAs com autenticação robusta e integração com serviços cloud.

---

## ✨ Funcionalidades

### 🔐 **Autenticação e Segurança**
- **OAuth 2.0 / OpenID Connect** com Azure Entra ID
- **MSAL (Microsoft Authentication Library)** para Angular
- **JWT Token Validation** no backend
- **Microsoft Identity Web** para .NET 8
- Interceptadores automáticos para anexar tokens

### 👤 **Gestão de Usuários e Perfis**
- **Perfil completo do usuário** com dados do Azure AD
- **Informações do Tenant** (domínios, configurações)
- **Grupos e memberships** do usuário
- **CRUD de usuários** com validação robusta
- **Listagem de usuários** do diretório

### 🛠️ **Ferramentas de Desenvolvimento**
- **Dashboard de testes MSAL** para debug
- **Endpoints de diagnóstico** da API
- **Validação de tokens** em tempo real
- **Logs estruturados** para troubleshooting

### 🎨 **Interface e UX**
- **SPA moderna** com Angular 19
- **Design responsivo** com Bootstrap 5
- **Tema consistente** em todo o sistema
- **Feedback visual** para todas as ações

---

## 🏗️ Estrutura do Projeto

### 📁 **Organização dos Diretórios**

```
Desafio-Azure-Brasil/
├── App-api/                    # Backend .NET 8
│   ├── app.Api/               # Camada de Apresentação
│   │   ├── Controllers/       # Controllers da API
│   │   ├── Properties/        # Configurações do projeto
│   │   └── Program.cs         # Entry point da aplicação
│   ├── app.Aplicacao/         # Camada de Aplicação
│   │   └── Usuarios/          # Services e mapeamentos
│   ├── app.DataTransfer/      # DTOs e objetos de transferência
│   │   └── Usuarios/          # Requests e Responses
│   ├── app.Dominio/           # Camada de Domínio
│   │   └── Usuarios/          # Entidades e repositórios
│   ├── app.Infra/             # Camada de Infraestrutura
│   │   ├── Data/              # Contexto do EF Core
│   │   ├── Migrations/        # Migrações do banco
│   │   └── Repositorios/      # Implementações dos repositórios
│   └── app.Ioc/               # Injeção de Dependências
│
├── App-site/                   # Frontend Angular 19
│   ├── src/app/               # Código fonte da aplicação
│   │   ├── core/              # Interceptadores e guards
│   │   ├── features/          # Módulos de funcionalidades
│   │   │   ├── home/          # Página inicial
│   │   │   ├── usuarios/      # Gestão de usuários
│   │   │   ├── user-profile/  # Perfil do usuário
│   │   │   ├── test/          # Dashboard de testes
│   │   │   └── login/         # Página de login
│   │   ├── services/          # Serviços da aplicação
│   │   ├── shared/            # Componentes compartilhados
│   │   │   ├── components/    # Componentes reutilizáveis
│   │   │   └── models/        # Modelos de dados
│   │   └── environments/      # Configurações de ambiente
│   └── public/                # Assets estáticos
│
└── FEATURE_PROFILE.md          # Documentação da feature de perfil
```

---

## 🛠️ Stack Tecnológico

### 🔧 **Backend (.NET 8)**

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **.NET 8** | 8.0 | Framework principal |
| **Entity Framework Core** | 8.0.13 | ORM para acesso a dados |
| **Microsoft Identity Web** | 3.8.2 | Autenticação Azure AD |
| **AutoMapper** | - | Mapeamento de objetos |
| **MySQL** | - | Banco de dados |
| **Swagger/OpenAPI** | 9.0.3 | Documentação da API |
| **JWT Bearer** | 8.* | Autenticação por token |

#### 📐 **Arquitetura DDD**
- **Domain**: Entidades de negócio e regras
- **Application**: Orquestração e casos de uso
- **Infrastructure**: Acesso a dados e serviços externos
- **API**: Camada de apresentação
- **IoC**: Injeção de dependências

### 🎨 **Frontend (Angular 19)**

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **Angular** | 19.0.0 | Framework SPA |
| **TypeScript** | 5.6.2 | Linguagem tipada |
| **MSAL Angular** | 3.0.16 | Autenticação Microsoft |
| **Bootstrap** | 5.x | Framework CSS |
| **Bootstrap Icons** | 1.13.1 | Iconografia |
| **ngx-toastr** | 19.0.0 | Notificações |
| **RxJS** | 7.8.0 | Programação reativa |

#### 🏛️ **Arquitetura Moderna**
- **Standalone Components** (sem NgModules)
- **Reactive Forms** para validação
- **Guards** para proteção de rotas
- **Interceptors** para requests automáticos
- **Services** para lógica de negócio

---

## 🚀 Como Rodar o Projeto

### ✅ **Pré-requisitos**

Certifique-se de ter instalado:

- **[.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)** (versão 8.0 ou superior)
- **[Node.js](https://nodejs.org/)** (versão 18 ou superior)
- **[Angular CLI](https://angular.io/cli)** (`npm install -g @angular/cli`)
- **[MySQL](https://dev.mysql.com/downloads/installer/)** (versão 8.0 ou superior)
- **[Git](https://git-scm.com/downloads)** para versionamento

### 📥 **1. Clone o Repositório**

```bash
git clone https://github.com/GabrielCezario1/Desafio-Azure-Brasil.git
cd Desafio-Azure-Brasil
```

### 🔧 **2. Configuração do Backend**

#### 📝 **2.1. Configure o Banco de Dados**

Edite o arquivo `App-api/app.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=appdb;User=root;Password=SUA_SENHA_MYSQL;"
  }
}
```

#### 🔑 **2.2. Configure Azure AD (Opcional)**

Para testar a autenticação, configure suas credenciais Azure AD:

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "SEU_DOMINIO.onmicrosoft.com",
    "TenantId": "SEU_TENANT_ID",
    "ClientId": "SEU_CLIENT_ID",
    "Audience": "SEU_CLIENT_ID"
  }
}
```

#### 🔄 **2.3. Restaurar Dependências e Executar**

```bash
cd App-api

# Restaurar pacotes NuGet
dotnet restore

# Aplicar migrações do banco
dotnet ef database update --project app.Infra --startup-project app.Api

# Executar a API
dotnet run --project app.Api
```

A API estará disponível em: `http://localhost:5001`
Swagger UI: `http://localhost:5001/swagger`

### 🎨 **3. Configuração do Frontend**

#### 📝 **3.1. Configure as Variáveis de Ambiente**

Edite o arquivo `App-site/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5001/api',
  
  msalConfig: {
    auth: {
      clientId: 'SEU_CLIENT_ID_AZURE',
      authority: 'https://login.microsoftonline.com/SEU_TENANT_ID',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: 'http://localhost:4200'
    }
  }
};
```

#### 🔄 **3.2. Instalar Dependências e Executar**

```bash
cd App-site

# Instalar dependências
npm install

# Executar em modo desenvolvimento
ng serve

# Ou executar e abrir automaticamente no navegador
ng serve --open
```

A aplicação estará disponível em: `http://localhost:4200`

### 🎯 **4. Teste a Aplicação**

1. **Acesse** `http://localhost:4200`
2. **Navegue** pelas diferentes seções usando a navbar
3. **Teste** o login com Azure AD (se configurado)
4. **Explore** as funcionalidades de CRUD de usuários
5. **Use** o dashboard de testes para validar integrações

---

## 📊 Endpoints da API

### 🔓 **Endpoints Públicos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/auth/public` | Teste de conectividade |
| `GET` | `/api/auth/debug/headers` | Debug de headers e tokens |

### 🔒 **Endpoints Protegidos**

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/auth/me` | Informações do usuário autenticado |
| `GET` | `/api/usuarios` | Listar usuários |
| `POST` | `/api/usuarios` | Criar usuário |
| `PUT` | `/api/usuarios` | Atualizar usuário |
| `DELETE` | `/api/usuarios/{id}` | Excluir usuário |

---

## 🔐 Configuração Azure AD

### 📋 **Passos para Configurar**

1. **Acesse** o [Portal Azure](https://portal.azure.com)
2. **Navegue** para Azure Active Directory
3. **Registre** uma nova aplicação
4. **Configure** URLs de redirecionamento
5. **Gere** Client ID e Tenant ID
6. **Configure** escopos da API

### 🔑 **Configurações Necessárias**

```json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "Domain": "[SEU_DOMINIO].onmicrosoft.com",
    "TenantId": "[GUID_DO_TENANT]",
    "ClientId": "[GUID_DO_CLIENT]",
    "Audience": "[GUID_DO_CLIENT]"
  }
}
```

---

## 🧪 Testes e Debugging

### 🔍 **Dashboard de Testes**

A aplicação inclui um dashboard completo para testar integrações:

- **Status de Autenticação**: Verifica se o usuário está logado
- **Informações do Token**: Mostra detalhes do JWT
- **Testes de API**: Valida endpoints públicos e protegidos
- **Debug de Headers**: Analisa headers HTTP enviados

### 📝 **Logs Estruturados**

O backend implementa logging detalhado para facilitar debugging:

```csharp
// Exemplo de logs da aplicação
Console.WriteLine("✅ JWT Token Validated Successfully");
Console.WriteLine($"✅ User: {context.Principal?.Identity?.Name}");
Console.WriteLine($"✅ Claims Count: {context.Principal?.Claims?.Count()}");
```

---

## 🎨 Funcionalidades de UI/UX

### 🧭 **Navegação Consistente**
- **Navbar componentizada** presente em todas as telas
- **Destaque visual** da página ativa
- **Design responsivo** para mobile e desktop

### 🎭 **Design System**
- **Cores primárias**: Azure Blue (#0078D4)
- **Tipografia**: Bootstrap 5 system fonts
- **Iconografia**: Bootstrap Icons
- **Sombras**: Elevação consistente
- **Border radius**: 6px padrão

### 📱 **Responsividade**
- **Mobile-first** approach
- **Breakpoints** do Bootstrap 5
- **Grid flexível** em todas as telas
- **Navegação adaptativa**

---

## 🔧 Scripts Úteis

### 🖥️ **Backend**

```bash
# Executar apenas a API
dotnet run --project App-api/app.Api

# Gerar nova migração
dotnet ef migrations add NomeDaMigracao --project App-api/app.Infra --startup-project App-api/app.Api

# Aplicar migrações
dotnet ef database update --project App-api/app.Infra --startup-project App-api/app.Api

# Build para produção
dotnet build --configuration Release
```

### 🎨 **Frontend**

```bash
# Executar em desenvolvimento
npm start
# ou
ng serve

# Build para produção
ng build --prod

# Executar testes
ng test

# Linting
ng lint

# Gerar novo componente
ng generate component features/nome-do-componente --standalone
```

---

## 📚 Documentação Adicional

### 📄 **Arquivos de Documentação**

- **[App-api/README.md](./App-api/README.md)**: Documentação específica do backend
- **[App-site/README.md](./App-site/README.md)**: Documentação específica do frontend

### 🔗 **Links Úteis**

| Recurso | Link |
|---------|------|
| **Swagger UI** | `http://localhost:5001/swagger` |
| **Angular DevTools** | [Chrome Extension](https://chrome.google.com/webstore/detail/angular-devtools/ienfalfjdbdpebioblfackkekamfmbnh) |
| **Azure Portal** | [portal.azure.com](https://portal.azure.com) |
| **MSAL Documentation** | [docs.microsoft.com](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview) |

---

## 🤝 Contribuição

### 📋 **Como Contribuir**

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### 🐛 **Reportar Bugs**

Use as [Issues do GitHub](https://github.com/GabrielCezario1/Desafio-Azure-Brasil/issues) para reportar bugs ou solicitar features.

---

## 👨‍💻 Autor

**Gabriel Cezário**

- **GitHub**: [@GabrielCezario1](https://github.com/GabrielCezario1)
- **LinkedIn**: [Gabriel Vieira](https://www.linkedin.com/in/gabriel-vieira-cezario)
- **Email**: gabriel.vieira2025@hotmail.com

### 🥋 **Sobre o Desenvolvedor**

Desenvolvedor FullStack com 2 anos de experiência em .NET, especializado em desenvolvimento de APIs modernas e SPAs. Faixa azul 2° grau em Jiu-Jitsu, aplicando os mesmos princípios de disciplina e melhoria contínua no desenvolvimento de software.

---

## 📄 Licença

Este projeto foi desenvolvido para fins de demonstração técnica e portfólio profissional.

---

<div align="center">

**🚀 Desenvolvido especificamente para a Azure Brasil Cloud**

*Demonstrando competências em desenvolvimento FullStack com Azure*

---

![Azure](https://img.shields.io/badge/Azure_Ready-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![Production](https://img.shields.io/badge/Production_Ready-00C851?style=for-the-badge&logo=checkmarx&logoColor=white)
![Modern](https://img.shields.io/badge/Modern_Stack-FF6900?style=for-the-badge&logo=stack-overflow&logoColor=white)

</div>
