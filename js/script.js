const URL_USUARIOS = "http://localhost:3000/usuarios"
const URL_VAGAS = "http://localhost:3000/vagas"

const cadastrarAgora = document.getElementById("cadastrar-agora")
const acessarAgora = document.getElementById("acessar-agora")
const cadastroModal = document.getElementById("cadastro-modal")
const loginTela = document.getElementById("login-tela")

const loginEnviar = document.getElementById("login-enviar")
const cadastroEnviar = document.getElementById("cadastro-enviar")

// Telas candidato
const sectionCandUm = document.getElementById('section-1');
const sectionCandDois = document.getElementById('section-2');
const sectionCandTres = document.getElementById('section-3');
const sectionCandQuatro = document.getElementById('section-4');

// Telas recrutador
const sectionRecUm = document.getElementById('section-rec-1');
const sectionRecDois = document.getElementById('section-rec-2');
const sectionRecTres = document.getElementById('section-rec-3');

// MODAL
function mudarModalCadastro() {
    loginTela.classList.toggle("blur");
    cadastroModal.classList.toggle("hidden");
};

// CADASTRO
class Usuario {
    id;
    tipo;
    nomeCompleto;
    dataDeNascimento;
    email;
    senha;
    candidaturas = [];

    constructor(tipo, nomeCompleto, dataDeNascimento, email, senha) {
        this.tipo = tipo
        this.nomeCompleto = nomeCompleto
        this.dataDeNascimento = dataDeNascimento
        this.email = email
        this.senha = senha
    }
}

async function cadastrarUsuario(event){
    event.preventDefault();

    const tipoUsuario = document.getElementById("tipo-usuario");
    const cadastroNome = document.getElementById("cadastro-nome");
    const cadastroDate = document.getElementById("cadastro-date");
    const cadastroEmail = document.getElementById("cadastro-email");
    const cadastroSenha = document.getElementById("cadastro-senha");

    const dataFormatada = cadastroDate.value.split("-")

    const novoUsuario = new Usuario(
        tipoUsuario.value,
        cadastroNome.value,
        new Date(dataFormatada[0], dataFormatada[1], dataFormatada[2]),
        cadastroEmail.value,
        cadastroSenha.value
    );
 
    try {
        if(tipoUsuario.value == "" || cadastroNome.value == "" || cadastroDate.value == null || cadastroEmail.value == "" || cadastroSenha.value == "") throw "Preencha todos os campos"
        await axios.post(`${URL_USUARIOS}`, novoUsuario)
        alert("cadastrado com sucesso")
    } catch(err) {  
        alert(err)
    }

    mudarModalCadastro();
};

async function fazerLogin(event) {
  event.preventDefault();

  const loginEmail = document.getElementById("login-email")
  const loginSenha = document.getElementById("login-senha")

  let users;

  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  users.map((element) => {
    if(element.email === loginEmail.value && element.senha === loginSenha.value){
      if(element.tipo === 'recrutador'){
        window.location.href = `./home-recrutador.html?=${element.id}`
      } else {
        window.location.href = `./home-candidatos.html?=${element.id}`
      }
    }
  })
}