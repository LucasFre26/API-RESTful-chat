// index.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para processar payloads JSON
app.use(bodyParser.json());

// Simulação de banco de dados
let users = [];
let rooms = [];
let messages = {};

// Rotas para gerenciamento de usuários
// Registrar um novo usuário
app.post('/users', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ erro: 'Nome de usuário é obrigatório' });
    }
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ erro: 'Nome de usuário já está em uso' });
    }
    const userId = Math.floor(Math.random() * 1000).toString(); // Simples geração de userId
    users.push({ userId, username });
    res.status(201).json({ userId });
});

// Autenticar um usuário
app.post('/users/login', (req, res) => {
    const { username } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json({ userId: user.userId });
});

// Obter informações de um usuário específico
app.get('/users/:userId', (req, res) => {
    const { userId } = req.params;
    const user = users.find(user => user.userId === userId);
    if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    res.json(user);
});

// Rotas para gerenciamento de salas de chat
// Criar uma nova sala de chat
app.post('/rooms', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ erro: 'Nome da sala é obrigatório' });
    }
    const roomId = Math.floor(Math.random() * 1000).toString(); // Simples geração de roomId
    rooms.push({ roomId, name, users: [] });
    res.status(201).json({ roomId });
});

// Remover uma sala de chat
app.delete('/rooms/:roomId', (req, res) => {
    const { roomId } = req.params;
    const initialRoomLength = rooms.length; // Salva o comprimento inicial do array de salas

    rooms = rooms.filter(room => room.roomId !== roomId);

    // Verifica se o comprimento do array de salas diminuiu após a remoção
    if (rooms.length < initialRoomLength) {
        // Se sim, significa que a sala foi deletada com sucesso
        res.status(200).json({ success: 'Sala removida com sucesso'});
    } else {
        // Se não, significa que a sala com o ID especificado não foi encontrada
        res.status(404).json({ error: 'Sala não encontrada'});
    }
});

// Entrar em uma sala de chat
app.post('/rooms/:roomId/enter', (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    const room = rooms.find(room => room.roomId === roomId);
    
    if (!room) {
        return res.status(404).json({ erro: 'Sala não encontrada' });
    }

    const user = users.find(user => user.userId === userId);
    if (!user) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (!room.users.includes(userId)) {
        room.users.push(userId);
    }

    res.status(200).json({ success: `Usuário entrou na sala ${roomId} com sucesso` });
});


// Sair de uma sala de chat
app.post('/rooms/:roomId/leave', (req, res) => {
    const { roomId } = req.params;
    const { userId } = req.body;
    const room = rooms.find(room => room.roomId === roomId);
    if (!room) {
        return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    room.users = room.users.filter(user => user !== userId);
    res.status(200).json({ success: `Usuário saiu da sala ${roomId} com sucesso` });
});

// Remover um usuário de uma sala específica
app.delete('/rooms/:roomId/users/:userId', (req, res) => {
    const { roomId, userId } = req.params;
    const room = rooms.find(room => room.roomId === roomId);
    if (!room) {
        return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    room.users = room.users.filter(user => user !== userId);
    res.status(200).json({ success: `Usuário ${userId} foi removido da sala ${roomId} com sucesso` });
});

// Lista todas as salas ativas na secao
app.get('/rooms/active', (req, res) => {
    if (rooms.length === 0) {
        return res.status(404).json({ erro: 'Nenhuma sala ativa encontrada' });
    }

    res.status(200).json(rooms);
});


// Rotas para gerenciamento de mensagens
// Enviar uma mensagem para uma sala de chat
app.post('/rooms/:roomId/messages', (req, res) => {
    const { roomId } = req.params;
    const { userId, message } = req.body;
    if (!message) {
        return res.status(400).json({ erro: 'Conteúdo da mensagem é obrigatório' });
    }
    if (!rooms.find(room => room.roomId === roomId)) {
        return res.status(404).json({ erro: 'Sala não encontrada' });
    }
    if (!users.find(user => user.userId === userId)) {
        return res.status(404).json({ erro: 'Usuário não encontrado' });
    }
    if (!messages[roomId]) {
        messages[roomId] = [];
    }
    messages[roomId].push({ userId, message });
    res.sendStatus(204);
});


// Receber mensagens de uma sala de chat
app.get('/rooms/:roomId/messages', (req, res) => {
    const { roomId } = req.params;
    const roomMessages = messages[roomId] || [];
    res.json(roomMessages);
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`O servidor está rodando em http://localhost:${PORT}`);
});
