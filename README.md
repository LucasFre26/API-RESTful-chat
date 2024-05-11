# Chat API

Esta é uma API para gerenciamento de salas de bate-papo e mensagens diretas entre usuários.

## Instalação

1. Certifique-se de ter o Node.js instalado em sua máquina. Você pode baixá-lo [aqui](https://nodejs.org/).
2. Instale as dependências executando o seguinte comando:

```bash
npm install
```

## Uso

1. Inicie o servidor executando o seguinte comando:

```bash
npm start
```

2. Após iniciar o servidor, você poderá acessar a API em `http://localhost:3000`.

## Rotas Disponíveis

### Gerenciamento de Usuários

- **POST /users**: Registra um novo usuário.
- **POST /users/login**: Autentica um usuário.
- **GET /users/:userId**: Obtém informações de um usuário específico.

### Gerenciamento de Salas de Chat

- **POST /rooms**: Cria uma nova sala de chat.
- **DELETE /rooms/:roomId**: Remove uma sala de chat.
- **POST /rooms/:roomId/enter**: Permite que um usuário entre em uma sala de chat.
- **POST /rooms/:roomId/leave**: Permite que um usuário saia de uma sala de chat.
- **DELETE /rooms/:roomId/users/:userId**: Remove um usuário de uma sala específica.
- **GET /rooms/active**: Lista todas as salas ativas.

### Gerenciamento de Mensagens

- **POST /rooms/:roomId/messages**: Envia uma mensagem para uma sala de chat.
- **GET /rooms/:roomId/messages**: Recebe mensagens de uma sala de chat.
- **POST /messages/direct**: Envia uma mensagem direta para outro usuário.
- **GET /messages/direct/:userId**: Recebe mensagens diretas de um usuário específico.
