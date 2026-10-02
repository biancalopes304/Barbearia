async function agendar() {
    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;

    if (nome.trim() === "" || data.trim() === "" || horario.trim() === "") {
        alert("Preencha o campo vázio!");
        return;
    }

    const respostaAgendamentos = await fetch("http://localhost:3333/agendamentos");
    const agendamentosExistentes = await respostaAgendamentos.json();

    const jaExiste = agendamentosExistentes.some(agendamento => {
        return agendamento.data.slice(0, 10) === data &&
            agendamento.horario.slice(0, 5) === horario;
    });

    if (jaExiste) {
        alert("⚠️ Ops! Esse horário já está preenchido.");
        return;
    }

    const agendamento = {
        nome,
        data,
        horario
    }

    const resposta = await fetch("http://localhost:3333/agendamentos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(agendamento)
    });

    const dados = await resposta.json();

    alert(dados.mensagem);
    await carregarAgendamentos();

    document.getElementById("nome").value = "";
    document.getElementById("data").value = "";
    document.getElementById("horario").value = "";
}

async function carregarAgendamentos() {
    const resposta = await fetch("http://localhost:3333/agendamentos");
    const agendamentos = await resposta.json();
    console.log(agendamentos)

    const horarioClientes = document.getElementById("horarioClientes");
    horarioClientes.innerHTML = "";

    for (let i = 0; i < agendamentos.length; i++) {
        const agendamento = agendamentos[i];

        const div = document.createElement("div");

        const pNome = document.createElement("p");
        pNome.textContent = agendamento.nome;

        const pData = document.createElement("p");

        const data = new Date(agendamento.data);

        pData.textContent = data.toLocaleDateString("pt-BR");
        
        const pHorario = document.createElement("p");
        pHorario.textContent = agendamento.horario;

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.id= "agendar"

        botaoExcluir.addEventListener("click", async () => {

            await fetch(`http://localhost:3333/agendamento/${agendamento.id}`, {
                method: "DELETE"
            });

            await carregarAgendamentos();
        });



        div.append(pNome);
        div.append(pData);
        div.append(pHorario);
        div.append(botaoExcluir);

        horarioClientes.append(div);

    }
}

carregarAgendamentos();