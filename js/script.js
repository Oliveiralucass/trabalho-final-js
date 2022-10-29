const URL_USUARIOS = "http://localhost:3000/usuarios";
const URL_VAGAS = "http://localhost:3000/vagas";

const cadastrarAgora = document.getElementById("cadastrar-agora");
const acessarAgora = document.getElementById("acessar-agora");
const cadastroModal = document.getElementById("cadastro-modal");
const loginTela = document.getElementById("login-tela");

const loginEnviar = document.getElementById("login-enviar");
const cadastroEnviar = document.getElementById("cadastro-enviar");

// Telas candidato
const sectionCandUm = document.getElementById('section-1');
const sectionCandDois = document.getElementById('section-2');
const sectionCandTres = document.getElementById('section-3');
const sectionCandQuatro = document.getElementById('section-4');

// Telas recrutador
const sectionRecUm = document.getElementById('section-rec-1');
const sectionRecDois = document.getElementById('section-rec-2');
const sectionRecTres = document.getElementById('section-rec-3');

// TRACKING DO USUARIO ATIVO
const URLSearchString = window.location.search
const ParamDoUsuarioAtivo = new URLSearchParams(URLSearchString)
let usuarioAtivoId = Number(ParamDoUsuarioAtivo.get("user"))
console.log(usuarioAtivoId)

// MODAL
function mudarModalCadastro() {
  loginTela.classList.toggle("blur");
  cadastroModal.classList.toggle("hidden");
};

function mudarModalCadastrarVagas() {
  sectionRecUm.classList.toggle("blur");
  sectionRecDois.classList.toggle("hidden");
};

function mudarModalDetalhesVagas() {
  sectionRecUm.classList.toggle("blur");
  sectionRecTres.classList.toggle('hidden');
};

// CLASSES DE CADASTROS
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
};

class Vaga {
  id;
  titulo;
  descricao;
  remuneracao;
  candidatos = [];

  constructor(titulo, descricao, remuneracao) {
      this.titulo = titulo;
      this.descricao = descricao;
      this.remuneracao = remuneracao;
  }
};

class Candidatura {
  idVaga;
  idCandidato;
  reprovado;

  constructor(reprovado){
    this.reprovado = reprovado;
    idVaga = Vaga.id;
    idCandidato = Usuario.id;
  };
};

// LOGIN
async function fazerLogin(event) {
  event.preventDefault();

  const loginEmail = document.getElementById("login-email")
  const loginSenha = document.getElementById("login-senha")

  let users;
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  users.map((element) => {  
    if(element.email === loginEmail.value && element.senha === loginSenha.value){
      if(element.tipo === 'recrutador'){
        window.location.href = `./pages/home-recrutador.html?user=${element.id}`
      } else {
        window.location.href = `./pages/home-candidatos.html?user=${element.id}`
      }
    }
  })
}


//CADASTROS
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

const cadastrarNovaVaga = async (event) => {
  event.preventDefault();

  const tituloDaVaga = document.getElementById("titulo-vaga");
  const descricaoDaVaga = document.getElementById("vaga-descricao");
  const remuneracaoDaVaga = document.getElementById("vaga-remuneracao");

  const novaVaga = new Vaga(
    tituloDaVaga.value,
    descricaoDaVaga.value,
    remuneracaoDaVaga.value
  );
  
  try {
    if(tituloDaVaga.value == "" || descricaoDaVaga.value == "" || remuneracaoDaVaga.value == "") throw "Preencha todos os campos";
    await axios.post(`${URL_VAGAS}`, novaVaga);
    console.log("Vaga Cadastrada com sucesso!");
  }
  catch (error) {
   alert(error);
  };

  mudarModalCadastrarVagas();
};

//EXIBIR VAGAS
const exibirTodasAsVagas = async () => {
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  vagas.map((vaga) => {
    const divPai = document.querySelector('.button-vagas-home-recrutador');
    const divButtonVagas = document.createElement('div');
    divButtonVagas.setAttribute('class', 'button-vagas');
    divButtonVagas.setAttribute('onclick', `detalhesVaga(${vaga.id}); buscarCandidatos(${vaga.id})`);
    const divFilhaUm = document.createElement('div');
    const divFilhaDois = document.createElement('div');
  
    divButtonVagas.appendChild(divFilhaUm);
    divButtonVagas.appendChild(divFilhaDois);
    divPai.appendChild(divButtonVagas);

    divFilhaUm.innerText = vaga.titulo;
    divFilhaDois.innerText = vaga.remuneracao;
  });
};

const detalhesVaga = async (idDaVaga) => {
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  let users;
  await axios.get(URL_VAGAS).then((response) => { users = response.data });

  const idVaga = document.getElementById('id-vaga');
  const salarioVaga = document.getElementById('salario-vaga');
  const tituloVaga = document.getElementById('titulo-vaga-recrutador');
  const descricaoVaga = document.getElementById('descricao-vaga-recrutador');
  const candidatar = document.getElementById("candidatar")
  candidatar.setAttribute("onclick", `candidatarVaga(${idDaVaga})`)

  vagas.filter((detalhes) => {
    if(detalhes.id === idDaVaga){
      idVaga.innerHTML = `<b>ID da Vaga:</b> ${idDaVaga}`;
      salarioVaga.innerHTML = `<b>Remuneração:</b> R$ ${detalhes.remuneracao}`;
      tituloVaga.innerHTML = `<b>Título:</b> ${detalhes.titulo}`
      descricaoVaga.innerHTML = `<b>Descrição da vaga:</b> ${detalhes.descricao}`;
    
    };
  });

  mudarModalDetalhesVagas();
};

// Candidatar vaga


async function candidatarVaga(idDaVaga){
  
  let users;
  await axios.get(URL_USUARIOS).then((response) => { users = response.data });

  let userTodosDados = users.filter((user) => {
    if(user.id === usuarioAtivoId){
      return user;
    };
  });


  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  let vagaAtiva = vagas.filter((vaga) => {
    if(vaga.id === idDaVaga){
      return vaga;
    };
  });

  let userDadosCadastrais = {
    nomeCompleto: userTodosDados[0].nomeCompleto,
    dataDeNascimento: userTodosDados[0].dataDeNascimento
  }

  axios.patch(URL_VAGAS,
  { "candidatos":  vagaAtiva[0].candidatos.push(userDadosCadastrais)},
  { headers: { 'Content-Type': 'application/json'}, }
)


const res = await axios.put(URL_VAGAS, {: 'world' });

res.data.headers['Content-Type'];
}

async function buscarCandidatos(id) {
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  vagas.filter((vaga) => {
    if(vaga.id === id){
    };
  });
};


if(window.location.pathname === "/pages/home-candidatos.html" || window.location.pathname === "/pages/home-recrutador.html"){
  exibirTodasAsVagas();
}


/*
const deletarVaga = async (event) => {
  event.preventDefault();

  const tituloDaVaga = document.getElementById("titulo-vaga");
  const descricaoDaVaga = document.getElementById("vaga-descricao");
  const remuneracaoDaVaga = document.getElementById("vaga-remuneracao");

  const vaga = (
      tituloDaVaga.value,
      descricaoDaVaga.value,
      remuneracaoDaVaga.value
  )
  
  try {
      await axios.delete(`${URL_VAGAS}`, vaga);
      console.log("Vaga Deletada com sucesso!");
  }
  catch (error) {
      console.log("Deu ruim! ", error);
  }
} */