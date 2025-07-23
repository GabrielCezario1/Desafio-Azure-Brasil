📦 Template Base - Arquitetura DDD com .NET
Este repositório é um template robusto e reutilizável para projetos .NET utilizando a arquitetura DDD (Domain-Driven Design) com separação em múltiplas camadas. Foi desenvolvido com o objetivo de acelerar o início de novos projetos, evitando a necessidade de configurar uma solução do zero toda vez.

🔧 Tecnologias e Recursos Implementados
✅ .NET 8 com estrutura modular e escalável

✅ Entity Framework Core com configuração para MySQL

✅ Injeção de Dependência com boas práticas

✅ AutoMapper configurado para mapeamento de objetos

✅ CRUD completo de Usuário (Create, Read, Update, Delete)

✅ Separação clara entre camadas:

API: camada de apresentação (controllers)

Aplicacao: orquestração e lógica de aplicação

DataTransfer: objetos de transporte (DTOs)

Dominio: regras de negócio e entidades

Infra: acesso e persistência de dados

Ioc: camada de configuração de injeção de dependencia

🚀 Objetivo
Este projeto serve como base para iniciar novas aplicações que sigam boas práticas de arquitetura limpa, promovendo escalabilidade, manutenibilidade e organização. Ideal para desenvolvedores que buscam agilidade no início de projetos sem abrir mão da qualidade e estruturação do código.

🧱 Como usar
Clone este repositório e utilize como ponto de partida para seus projetos:

https://github.com/GabrielCezario1/App-api.git

📁 Estrutura da Solution

/src
  ├── API
  ├── Aplicacao
  ├── DataTransfer
  ├── Dominio
  ├── Infra
  └── Ioc
  
✨ Contribuições
Sinta-se à vontade para abrir issues, propor melhorias ou enviar pull requests. Toda contribuição é bem-vinda para tornar esse template ainda mais completo!
