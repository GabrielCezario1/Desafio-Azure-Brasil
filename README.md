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

## Como Usar

1.  Clone este repositório.
2.  Abra a solução (`app.sln`) no Visual Studio ou em sua IDE de preferência.
3.  Restaure as dependências do NuGet(npm install).
4.  Configure a string de conexão com o banco de dados no arquivo `appsettings.json`.
5.  Execute as migrações do Entity Framework para criar o banco de dados.
6.  Inicie o projeto.

## Link do repositório do Front end: https://github.com/GabrielCezario1/App-site.git

### ✨ Contribuições
 Sinta-se à vontade para abrir issues, propor melhorias ou enviar pull requests. Toda contribuição é bem-vinda para tornar esse template ainda mais completo!
