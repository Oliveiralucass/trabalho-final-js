
// Projeto Final do Módulo JavaScript Vem Ser 10

const cadastrarAgora = document.getElementById("cadastrarAgora")
const acessarAgora = document.getElementById("acessarAgora")
const cadastroModal = document.getElementById("cadastroModal")
const loginTela = document.getElementById("loginTela")

const loginEmail = document.getElementById("loginEmail")
const loginSenha = document.getElementById("loginSenha")
const loginEnviar = document.getElementById("loginEnviar")
const cadastroEnviar = document.getElementById("cadastroEnviar")

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
    const tipoUsuario = document.getElementById("tipoUsuario");
    const cadastroNome = document.getElementById("cadastroNome");
    const cadastroDate = document.getElementById("cadastroDate");
    const cadastroEmail = document.getElementById("cadastroEmail");
    const cadastroSenha = document.getElementById("cadastroSenha");

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