const URL_USUARIOS = "http://localhost:3000/usuarios";
const URL_VAGAS = "http://localhost:3000/vagas";

// if(usuario.id === usuarioAtivoId && usuario.tipo === "recrutador"){

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
const usuarioAtivoId = Number(ParamDoUsuarioAtivo.get("user"))

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

function mudarModalCandidatadoNaVaga(){
  sectionCandTres.classList.toggle('hidden');
  sectionRecTres.classList.toggle('blur');
}

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
  reprovado; // booleano

  constructor(idVaga, idCandidato, reprovado){
    this.idVaga = idVaga;
    this.idCandidato = idCandidato;
    this.reprovado = reprovado;
  }
}

// LOGIN
async function fazerLogin(event) {
  event.preventDefault();

  const loginEmail = document.getElementById("login-email");
  const loginSenha = document.getElementById("login-senha");

  let users;
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  users.map((element) => {  
    if(element.email === loginEmail.value && element.senha === loginSenha.value){
      if(element.tipo === 'recrutador'){
        window.location.href = `./pages/home-recrutador.html?user=${element.id}`
      } else {
        window.location.href = `./pages/home-candidatos.html?user=${element.id}`
      }
    };
  });

};

//CADASTROS
async function cadastrarUsuario(event){
  event.preventDefault();

  const tipoUsuario = document.getElementById("tipo-usuario");
  const cadastroNome = document.getElementById("cadastro-nome");
  const cadastroDate = document.getElementById("cadastro-date");
  const cadastroEmail = document.getElementById("cadastro-email");
  const cadastroSenha = document.getElementById("cadastro-senha");

  const dataFormatada = cadastroDate.value.split("-");

  const novoUsuario = new Usuario(
    tipoUsuario.value,
    cadastroNome.value,
    new Date(dataFormatada[0], dataFormatada[1], dataFormatada[2]),
    cadastroEmail.value,
    cadastroSenha.value
  );
 
  let users;
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});
  let verificaEmail = users.map((user) => { if(user.email === cadastroEmail.value) return true });

  try {
    if(tipoUsuario.value == "" || cadastroNome.value == "" || cadastroDate.value == null || cadastroEmail.value == "" || cadastroSenha.value == "") throw "Preencha todos os campos";
    if(verificaEmail.includes(true)) throw "Email já está cadastrado";
    await axios.post(`${URL_USUARIOS}`, novoUsuario);
    alert("Cadastrado com sucesso");
  } catch(err) {
    alert(err);
  }

  mudarModalCadastro();
};

const cadastrarNovaVaga = async (event) => {
  event.preventDefault();

  const tituloDaVaga = document.getElementById("titulo-vaga");
  const descricaoDaVaga = document.getElementById("vaga-descricao");
  const remuneracaoDaVaga = document.getElementById("vaga-remuneracao");

  const novaVaga = new Vaga(tituloDaVaga.value, descricaoDaVaga.value, remuneracaoDaVaga.value);
  
  try {
    if(tituloDaVaga.value == "" || descricaoDaVaga.value == "" || remuneracaoDaVaga.value == "") throw "Preencha todos os campos";
    await axios.post(`${URL_VAGAS}`, novaVaga);
    alert("Vaga cadastrada com sucesso!");
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
    divButtonVagas.setAttribute('onclick', `detalhesVaga(${vaga.id}); exibeDetalhesRecrutador(${vaga.id})`);
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
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  const idVaga = document.getElementById('id-vaga');
  const salarioVaga = document.getElementById('salario-vaga');
  const tituloVaga = document.getElementById('titulo-vaga-recrutador');
  const descricaoVaga = document.getElementById('descricao-vaga-recrutador');

  users.map((user) => {
    if(user.id === usuarioAtivoId){
      if(user.tipo === "candidato") {
        const candidatar = document.getElementById("candidatar")
        candidatar.setAttribute("onclick", `candidatarVaga(${idDaVaga})`)
      }
    }
  })

  users.map((user) => { 
    if(user.id === usuarioAtivoId){ 
      if(user.tipo === "recrutador"){ 
        const buttonDeletar = document.getElementById('deletar-vaga');
        buttonDeletar.setAttribute('onclick', `deletarVaga(${idDaVaga})`)
    }}
  })

  let vagaFiltrada = vagas.filter((detalhes) => {
    if(detalhes.id === idDaVaga){
      if(detalhes.candidatos.includes(usuarioAtivoId)) return exibeTelaCadastradoNaVaga(idDaVaga);
      buscarCandidatos(idDaVaga)
      idVaga.innerHTML = `<b>ID da Vaga:</b> ${idDaVaga}`;
      salarioVaga.innerHTML = `<b>Remuneração:</b> R$ ${detalhes.remuneracao}`;
      tituloVaga.innerHTML = `<b>Título:</b> ${detalhes.titulo}`;
      descricaoVaga.innerHTML = `<b>Descrição da vaga:</b> ${detalhes.descricao}`;
      return detalhes;
    };
  });

  if(vagaFiltrada[0].candidatos.includes(usuarioAtivoId)) return
  mudarModalDetalhesVagas();
};

// Candidatar vaga
async function candidatarVaga(idDaVaga){
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  let conteudo = vagas.filter((vaga) => {
    if(vaga.id === idDaVaga) {
      if(!vaga.candidatos.includes(usuarioAtivoId)){
        vaga.candidatos.push(usuarioAtivoId)
        return vaga.candidatos
      }
    }
  })


  let users;
  await axios.get(URL_USUARIOS).then((response) => { users = response.data });

  let candidaturaUsuario = users.filter((user) => {
    if(user.id === usuarioAtivoId) {
      user.candidaturas.push(new Candidatura (idDaVaga, usuarioAtivoId, false))
      return user.candidaturas
    }
  })

  await axios.put(`${URL_USUARIOS}/${usuarioAtivoId}`, candidaturaUsuario[0])

  await axios.put(`${URL_VAGAS}/${idDaVaga}`, conteudo[0])
};
// Usuario está candidatado
async function exibeTelaCadastradoNaVaga(idDaVaga){
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  const idVaga = document.getElementById('id-vaga-candidatado');
  const salarioVaga = document.getElementById('salario-vaga-candidatado');
  const tituloVaga = document.getElementById('titulo-vaga-candidatado');
  const descricaoVaga = document.getElementById('descricao-candidato-candidatado');

  vagas.filter((detalhes) => {
    if(detalhes.id === idDaVaga){
      idVaga.innerHTML = `<b>ID da Vaga:</b> ${idDaVaga}`;
      salarioVaga.innerHTML = `<b>Remuneração:</b> R$ ${detalhes.remuneracao}`;
      tituloVaga.innerHTML = `<b>Título:</b> ${detalhes.titulo}`;
      descricaoVaga.innerHTML = `<b>Descrição da vaga:</b> ${detalhes.descricao}`;
    };
  });

  buscarCandidatos(idDaVaga)
  mudarModalCandidatadoNaVaga()
}

async function buscarCandidatos(idDaVaga) {
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  let users;
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  users.map((tipoUser) => {
    if(tipoUser.id === usuarioAtivoId && tipoUser.tipo === "candidato"){
      vagas.map((vaga) => {
        if(vaga.id === idDaVaga){
          users.map((user) => {
            if(vaga.candidatos.includes(user.id)){
              const container = document.getElementById('container-candidatos');
              const divPai = document.createElement('div');
              divPai.classList.add('barra-nome-data-candidato-nao-cadastrado');
              const nomeUsuario = document.createElement('div');
              nomeUsuario.classList.add('nome-tela-recrutador'); 
              const nascimento = document.createElement('div');
              nascimento.classList.add('data-de-nascimento');
              divPai.appendChild(nomeUsuario);
              divPai.appendChild(nascimento);
              container.appendChild(divPai);
    
              nomeUsuario.innerText = user.nomeCompleto;
              nascimento.innerText = user.dataDeNascimento;
    
              const containerCandidatos = document.getElementById('container-candidatados');
              const divPaiDois = document.createElement('div');
              divPaiDois.classList.add('barra-nome-data-candidato-nao-cadastrado');
              const nomeUsuarioDois = document.createElement('div');
              nomeUsuarioDois.classList.add('nome-tela-recrutador'); 
              const nascimentoDois = document.createElement('div');
              nascimentoDois.classList.add('data-de-nascimento');
              divPaiDois.appendChild(nomeUsuarioDois);
              divPaiDois.appendChild(nascimentoDois);
              containerCandidatos.appendChild(divPaiDois);
    
              nomeUsuarioDois.innerText = user.nomeCompleto;
              nascimentoDois.innerText = user.dataDeNascimento;
            };
          });
        };
      });
    };
  });
};

async function exibeDetalhesRecrutador(idDaVaga){
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  let users;
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  users.map((usuario) => {
    if(usuario.id === usuarioAtivoId && usuario.tipo === "recrutador"){
      vagas.map((vaga) => {
        if(vaga.id === idDaVaga){
          users.map((user) => {
              if(vaga.candidatos.includes(user.id)){
                const containerRecrutador = document.getElementById('container-recrutador');
                const divPaiTres = document.createElement('div');
                divPaiTres.classList.add('barra-nome-data');
      
                const nomeUsuarioTres = document.createElement('div');
                nomeUsuarioTres.classList.add('nome-tela-recrutador');
                const nascimentoTres = document.createElement('div');
                nascimentoTres.classList.add('data-de-nascimento');
                const buttonReprovar = document.createElement('button');
                buttonReprovar.classList.add('button-aprovado-cadastrar-vaga');
                buttonReprovar.setAttribute('onclick', `reprovarCandidato("${user.id}", ${user.id})`);
                buttonReprovar.innerText = "Reprovar";

                divPaiTres.appendChild(nomeUsuarioTres);
                divPaiTres.appendChild(nascimentoTres);
                divPaiTres.appendChild(buttonReprovar);
                containerRecrutador.appendChild(divPaiTres);
              
                nomeUsuarioTres.innerText = user.nomeCompleto;
                nascimentoTres.innerText = user.dataDeNascimento;
            }
          });
        };
      });
    }
  })
}

async function reprovarCandidato(userNomeCompleto, idDaVaga) {
  let vagas;
  await axios.get(URL_VAGAS).then((response) => { vagas = response.data });

  let users;
  await axios.get(URL_USUARIOS).then((response) => {users = response.data});

  console.log(userNomeCompleto, idDaVaga);
  
  users.filter((user) => {
    
  })


}

const deletarVaga = async (idDaVaga) => {
  try {
    await axios.delete(`${URL_VAGAS}/${idDaVaga}`);
    alert("Vaga deletada com sucesso!");
  }
  catch (error) {
    alert("Deu ruim!");
  }
}

if(window.location.pathname === "/pages/home-candidatos.html" || window.location.pathname === "/pages/home-recrutador.html"){
  exibirTodasAsVagas();
}