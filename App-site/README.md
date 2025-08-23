# Repositório Base para Projetos Angular

Este repositório é um ponto de partida robusto e moderno para iniciar novas aplicações com Angular. Ele foi cuidadosamente estruturado para seguir as melhores práticas de desenvolvimento, garantindo escalabilidade, manutenibilidade e uma excelente experiência para o desenvolvedor.

## Funcionalidades Implementadas

*   **CRUD de Usuários Completo:** Uma funcionalidade de gerenciamento de usuários totalmente implementada, incluindo criação, leitura, atualização e exclusão.
*   **Sistema de Temas Híbrido:**
    *   **Tema Escuro** na página de apresentação (Home).
    *   **Tema Claro** na página de gerenciamento de usuários.
*   **Componente de Paginação:** Um componente de UI reutilizável para a paginação de dados, demonstrado na lista de usuários.
*   **Feedback ao Usuário:** Notificações claras e consistentes para todas as ações do usuário (sucesso, erro, confirmação) utilizando `ngx-toastr`.

## Padrões e Boas Práticas

*   **Arquitetura com Standalone Components:** Utiliza a abordagem moderna de componentes independentes do Angular, simplificando o gerenciamento de dependências.
*   **Formulários Reativos (Reactive Forms):** A funcionalidade de CRUD de usuários foi implementada com Formulários Reativos, centralizando a lógica de validação e controle no componente TypeScript para maior robustez e testabilidade.
*   **Serviço de API Centralizado:** A comunicação com o backend é abstraída em um serviço (`UsuariosService`), mantendo os componentes limpos e focados na interface.
*   **Validação Avançada:** Implementação de validação em tempo real, mensagens de erro contextuais e controle de estado do formulário (ex: desabilitar campos e botões condicionalmente).

## Tecnologias Utilizadas

*   **Angular 19**
*   **TypeScript**
*   **Bootstrap 5 & Bootstrap Icons**
*   **SCSS** para estilização avançada
*   **ngx-toastr** para notificações e feedback ao usuário

## Como Executar o Projeto

1.  **Clone o Repositório do Backend:**
    ```bash
    git clone https://github.com/GabrielCezario1/App-api.git
    ```
    *Siga as instruções no README do backend para executá-lo. A API precisa estar rodando em `https://localhost:5000`.*

2.  **Clone este Repositório (Frontend):**
    ```bash
    git clone <URL_DESTE_REPOSITORIO>
    ```

3.  **Instale as Dependências:**
    ```bash
    npm install
    ```

4.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    ng serve
    ```

5.  Abra seu navegador e acesse `http://localhost:4200/`.

---

*Link para o repositório do Backend: [App-api](https://github.com/GabrielCezario1/App-api.git)*
