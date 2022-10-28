
// Projeto Final do Módulo JavaScript Vem Ser 10

const cadastrarAgora = document.getElementById("cadastrar-agora")
const acessarAgora = document.getElementById("acessar-agora")
const cadastroModal = document.getElementById("cadastro-modal")
const loginTela = document.getElementById("login-tela")

const loginEmail = document.getElementById("login-email")
const loginSenha = document.getElementById("login-senha")
const loginEnviar = document.getElementById("login-enviar")
const cadastroEnviar = document.getElementById("cadastro-enviar")

const baseDeUsuarios = []


// MODAL
function mudarModalCadastro() {
    loginTela.classList.toggle("blur");
    cadastroModal.classList.toggle("hidden");
};
cadastrarAgora.addEventListener("click", () => {
    mudarModalCadastro();
});
acessarAgora.addEventListener("click", () => {
    mudarModalCadastro();
});

// CADASTRO
function dataStringParaDate(dateString) {
    let dataArray = dateString.split("-");
    const data = new Date (dataArray[0], dataArray[1] - 1, dataArray[2]);
    
    return data;
};
function cadastrarUsuario(){
    const tipoUsuario = document.getElementById("tipo-usuario");
    const cadastroNome = document.getElementById("cadastro-nome");
    const cadastroDate = document.getElementById("cadastro-date");
    const cadastroEmail = document.getElementById("cadastro-email");
    const cadastroSenha = document.getElementById("cadastro-senha");

    baseDeUsuarios.push({
        tipo: tipoUsuario.value,
        nome: cadastroNome.value,
        nascimento: dataStringParaDate(cadastroDate.value),
        email: cadastroEmail.value,
        senha: cadastroSenha.value
    });
};
cadastroEnviar.addEventListener("click", () =>{
    cadastrarUsuario();
    mudarModalCadastro();
});