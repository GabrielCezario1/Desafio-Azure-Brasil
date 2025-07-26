# Repositório Base para Projetos .NET API

Este repositório serve como um ponto de partida para novos projetos que utilizam .NET 8 para a construção de APIs. Ele inclui uma estrutura de projeto organizada e funcionalidades essenciais prontas para uso.

Arquitetura DDD com .NET Este repositório é um template robusto e reutilizável para projetos .NET utilizando a arquitetura DDD (Domain-Driven Design) com separação em múltiplas camadas. Foi desenvolvido com o objetivo de acelerar o início de novos projetos, evitando a necessidade de configurar uma solução do zero toda vez.

## Tecnologias e Recursos Implementados 

✅ .NET 8 com estrutura modular e escalável

✅ Entity Framework Core com configuração para MySQL

✅ Injeção de Dependência com boas práticas

✅ AutoMapper configurado para mapeamento de objetos

✅ CRUD completo de Usuário (Create, Read, Update, Delete)

✅ Separação clara entre camadas:
    * API: camada de apresentação (controllers)

    * Aplicacao: orquestração e lógica de aplicação

    * DataTransfer: objetos de transporte (DTOs)

    * Dominio: regras de negócio e entidades

    * Infra: acesso e persistência de dados

    * Ioc: camada de configuração de injeção de dependencia

## Funcionalidades Inclusas

O projeto base vem com as seguintes funcionalidades pré-configuradas:

*   **Gerenciamento de Usuários (Usuarios):**
    *   `POST /api/usuarios` - Inserir um novo usuário.
    *   `GET /api/usuarios` - Listar todos os usuários.
    *   `GET /api/usuarios/{id}` - Recuperar um usuário por ID.
    *   `PUT /api/usuarios` - Editar um usuário existente.
    *   `DELETE /api/usuarios/{id}` - Excluir um usuário por ID.
*   **Estrutura de Projeto em Camadas:** O código é organizado em camadas de Domínio, Aplicação, Infraestrutura e Injeção de Dependência (IoC) para melhor manutenibilidade.
*   **Swagger/OpenAPI:** Documentação da API gerada automaticamente e disponível em `/swagger`.

## 🚀 Objetivo Este projeto 
É servir como base para iniciar novas aplicações que sigam boas práticas de arquitetura limpa, promovendo escalabilidade, manutenibilidade e organização. Ideal para desenvolvedores que buscam agilidade no início de projetos sem abrir mão da qualidade e estruturação do código.

## Como Rodar o Projeto

Siga os passos abaixo para configurar e executar a aplicação em seu ambiente de desenvolvimento.

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [MySQL](https://dev.mysql.com/downloads/installer/) (ou outro servidor de banco de dados MySQL)
- Uma IDE de sua preferência (Visual Studio, VS Code com C# Dev Kit, etc.)

### 1. Clone o Repositório

```bash
git clone https://github.com/GabrielCezario1/App-api.git
cd App-api
```

### 2. Configure a String de Conexão

Abra o arquivo `app.Api/appsettings.json` e atualize a `DefaultConnection` com as suas credenciais do MySQL.

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=appdb;User=root;Password=root;"
}
```

### 3. Restaure as Dependências

Restaure os pacotes NuGet necessários para o projeto.

```bash
dotnet restore
```

### 4. Aplique as Migrações do Banco de Dados

Execute o comando a seguir para criar o banco de dados e aplicar as migrações do Entity Framework.

```bash
dotnet ef database update --project app.Infra --startup-project app.Api
```

### 5. Execute a Aplicação

Inicie a API.

```bash
dotnet run --project app.Api
```

A aplicação estará disponível em `http://localhost:5000` (ou a porta configurada no seu ambiente). A documentação da API, gerada pelo Swagger, pode ser acessada em `http://localhost:5000/swagger`.

## Link do repositório do Front end: https://github.com/GabrielCezario1/App-site.git
  
### ✨ Contribuições
Sinta-se à vontade para abrir issues, propor melhorias ou enviar pull requests. Toda contribuição é bem-vinda para tornar esse template ainda mais completo!
