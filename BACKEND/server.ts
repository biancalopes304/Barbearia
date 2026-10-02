import Fastify from "fastify";
import cors from "@fastify/cors";
import mysql from "mysql2/promise";
import "dotenv/config";

const banco = await mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
});

const server = Fastify({
    logger: true,
});

await server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
});

interface AgendamentoBody {
    nome: string;
    data: string;
    horario: string;
}

server.post<{ Body: AgendamentoBody }>("/agendamentos", async (request, reply) => {
    const { nome, data, horario } = request.body;

    await banco.query(
        "INSERT INTO agendamento (nome, data, horario) VALUES (?, ?, ?)",
        [nome, data, horario]
    );

    reply.code(201);

    return {
    mensagem: "Agendamento criado com sucesso!"
};
});

server.get("/", async (request, reply) => {
    return {mensagem : "Servidor Barbearia funcionando!"}
});


server.get("/agendamentos", async (request, reply) => {
    const [agendamentos] = await banco.query(
    "SELECT * FROM agendamento"
    );

     return agendamentos;
})



interface AgendamentoParams {
    id: number;
}

server.delete<{ Params: AgendamentoParams }>("/agendamento/:id", async (request, reply) => {

    const { id } = request.params;

    const resultado = await banco.query(
        "DELETE FROM agendamento WHERE id = ?",
        [id]
    );

    return {
        mensagem: "Agendamento excluído com sucesso!"
    };
});




server.listen({ port:  3333}, ()=>{
    console.log("Servidor iniciado!");
});

