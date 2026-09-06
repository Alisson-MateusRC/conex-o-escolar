let perfilSelecionado = "";


function selecionarPerfil(perfil) {

    perfilSelecionado = perfil;

    const btnProfessor = document.getElementById("btnProfessor");
    const btnEscola = document.getElementById("btnEscola");

    btnProfessor.classList.remove("selecionado");
    btnEscola.classList.remove("selecionado");


    if (perfil === "Professor") {

        btnProfessor.classList.add("selecionado");

    } else if (perfil === "Escola") {

        btnEscola.classList.add("selecionado");

    }

}


function entrar() {

    const cpf = document.getElementById("cpf").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");


    if (cpf === "" || senha === "") {

        mensagem.textContent = "Preencha o CPF e a senha.";

        return;
    }


    if (perfilSelecionado === "") {

        mensagem.textContent = "Selecione Professor ou Escola.";

        return;
    }


    mensagem.textContent =
        "Login realizado como " + perfilSelecionado + "!";

}