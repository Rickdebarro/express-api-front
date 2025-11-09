# Simple TaskList

Um aplicativo simples de lista de tarefas (To-Do list) full-stack com autenticação de usuário.


---

## ✨ Funcionalidades

* **Autenticação de Usuários:** Registo e Login com JWT.
* **CRUD de Tarefas:** Crie, leia, atualize e apague tarefas.
* **Gestão de Status:** Marque tarefas como concluídas.
* **Design Responsivo:** Layout adaptável com tema escuro e detalhes em roxo.
* **Painel de Detalhes:** Clique numa tarefa para ver detalhes (datas de criação/atualização) e editar a descrição.
* **Tratamento de Erros:** Feedback visual (toasts) e redirecionamento automático em caso de sessão expirada (401).

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React (Vite), CSS
* **Backend:** Node.js, Express
* **Banco de Dados:** MongoDB (com Mongoose) / PostgreSQL (com Prisma/Sequelize)
* **Autenticação:** JWT (Tokens)

---

## 🚀 Como Executar o Projeto

Este projeto é dividido em duas partes: `frontend` (cliente) e `backend` (API), que está disponível nos repositórios abaixo, com duas opções de banco.

#### [Postgres](https://github.com/Rickdebarro/postgres-express-api)

#### [MongoDB](https://github.com/Rickdebarro/mongoDB-express-api)


### 1. Backend (API)

1.  Acesse à pasta do backend:
    ```bash
    cd pasta-do-backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` baseado no `.env.example`. Preencha as variáveis de ambiente, especialmente:
    * `DATABASE_URL` (a string de conexão do seu Mongo ou Postgres)
    * `JWT_SECRET` (uma chave secreta para os tokens)
    * `PORT` (ex: 5000)
4.  Execute o servidor:
    ```bash
    npm run dev
    ```

### 2. Frontend (Cliente)

1.  Acesse à pasta do frontend (num novo terminal):
    ```bash
    cd pasta-do-frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env` e defina a URL da sua API:
    ```
    VITE_API_URL=http://localhost:5000
    ```
    *(Use a porta que definiu no `.env` do backend)*
4.  Execute o cliente:
    ```bash
    npm run dev
    ```