
let nomeUsuario = localStorage.getItem('nick').replace('"', '').replace('"', '')
let token = localStorage.getItem('token').replace('"', '').replace('"', '')
let idUser = localStorage.getItem('id').replace('"', '').replace('"', '')
document.getElementById('nomeUser').innerText = nomeUsuario
console.log(nomeUsuario)

let salaNenhuma = document.getElementById('nenhumaSala')
let abertaSala = document.getElementById('salaAberta')
let modalCriaraSala = document.getElementById('modalSala')
let salas = document.getElementById('salas')
let abaMensagens = document.getElementById('mensagens')
let menuLateral = document.getElementById('menuLateral')
let cont = 2;
let salasInfo;
let salaId;
let timestamp;

function selecionarSala(id, nome) {
    abaMensagens.innerHTML = '';
    console.log(id)
    salaId = id
    let salaEscolhida = document.getElementById('nomeSalaEscolhida')
    salaEscolhida.innerText = nome
    fetch(`https://chat-crng.onrender.com/sala/entrar?idsala=${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'token': token,
            'idUser': idUser,
            'nick': nomeUsuario
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erro')
        }
        return response.json();
    }).then(function (response) {
        console.log(response)
        timestamp = response.timestamp
        listarMensagens();
    }).catch(error => {
        console.log(error)
    })
    salaNenhuma.style.display = 'none'
    abertaSala.style.display = 'flex'
    toggleMenu();
}

function criarSala() {
    modalCriaraSala.style.display = 'flex'
}

function adicionarSala() {
    let semSala = document.getElementById('mensagemSemSala')
    let inputS = document.getElementById('inputSala')
    let nomeSala = inputS.value
    let sala = document.createElement('div')
    salas.appendChild(sala)
    let nomeDaSala = document.createElement('p')
    sala.appendChild(nomeDaSala)
    nomeDaSala.textContent = salasInfo.nome
    nomeDaSala.style.width = '100%'
    nomeDaSala.style.display = 'flex'
    nomeDaSala.style.justifyContent = 'center'
    nomeDaSala.style.padding = '10px'
    nomeDaSala.style.fontSize = '25px'
    nomeDaSala.style.borderBottom = 'white 1px solid'
    nomeDaSala.style.cursor = 'pointer'
    sala.style.width = "75%"
    semSala.style.display = 'none'
    modalCriaraSala.style.display = 'none'
    sala.addEventListener('click', selecionarSala)
    inputS.value = ""
}

function mandarMensagem() {
    console.log('oi')
    let inputMens = document.getElementById('inputMensagens')
    let contMensagem = inputMens.value

    if (!contMensagem.trim()) {
        return; // Não envia mensagens vazias
    }
    
    const data = {
        msg: contMensagem,
        idSala: salaId
    }

    const novaMensagem = {
        nick: nomeUsuario,
        msg: contMensagem
    };
    adicionarMensagemNaInterface(novaMensagem);
    inputMens.value = ""
    fetch(`https://chat-crng.onrender.com/sala/mensagem?idsala=${salaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'token': token,
            'nick': nomeUsuario,
            'idUser': idUser
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Erro')
        }
        return response.json();
    }).then(function (parametro) {
        console.log(parametro)
        listarMensagens()
    }).catch(error => {
        console.log(error)
    })
}


fetch('https://chat-crng.onrender.com/salas', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'token': token,
        'nick': nomeUsuario,
        'idUser': idUser
    }
}).then(response => {
    if (!response.ok) {
        throw new Error('Erro')
    }
    return response.json();
}).then(function (salasI) {
    console.log(salasI)
    salasInfo = salasI;
    let semSala = document.getElementById('mensagemSemSala')
    for (let i = 0; i < salasInfo.length; i++) {
        let sala = document.createElement('div')
        salas.appendChild(sala)
        let nomeDaSala = document.createElement('p')
        sala.appendChild(nomeDaSala)
        nomeDaSala.textContent = salasInfo[i].nome
        nomeDaSala.style.width = '100%'
        nomeDaSala.style.display = 'flex'
        nomeDaSala.style.justifyContent = 'center'
        nomeDaSala.style.padding = '10px'
        nomeDaSala.style.fontSize = '25px'
        nomeDaSala.style.borderBottom = '#00A507 1px solid'
        nomeDaSala.style.cursor = 'pointer'
        nomeDaSala.style.textAlign = 'center'
        sala.style.width = "90%"
        semSala.style.display = 'none'
        sala.addEventListener('click', function () {
            selecionarSala(salasInfo[i]._id, salasInfo[i].nome);
        })
    }
})

function adicionarMensagemNaInterface(mensagem) {
    const teste = document.createElement('div');
    const mensagemDiv = document.createElement('div');
    abaMensagens.appendChild(teste);
    teste.appendChild(mensagemDiv);
    teste.style.width = '100%';

    const nick = document.createElement('div');
    mensagemDiv.appendChild(nick);
    nick.innerText = mensagem.nick;
    nick.style.fontSize = '20px';
    nick.style.borderBottom = 'solid 1px white';
    nick.style.width = '90%';
    nick.style.textAlign = 'left';

    const conteudo = document.createElement('div');
    mensagemDiv.appendChild(conteudo);
    conteudo.innerText = mensagem.msg;
    conteudo.style.paddingLeft = '15px';
    conteudo.style.paddingRight = '15px';
    mensagemDiv.style.backgroundColor = '#828482';
    mensagemDiv.style.outline = 'solid 1px #00FF0A';
    mensagemDiv.style.width = 'fit-content';
    mensagemDiv.style.borderRadius = '10px';
    mensagemDiv.style.display = 'flex';
    mensagemDiv.style.flexWrap = 'wrap';
    mensagemDiv.style.justifyContent = 'center';
    mensagemDiv.style.marginTop = '15px';
    teste.style.display = 'flex';
    abaMensagens.style.display = 'flex';
    abaMensagens.style.flexWrap = 'wrap';

    if (mensagem.nick === nomeUsuario) {
        teste.style.justifyContent = 'flex-end';
    } else {
        teste.style.justifyContent = 'flex-start';
    }
}


function listarMensagens() {
    fetch(`https://chat-crng.onrender.com/sala/mensagens?idSala=${salaId}&timestamp=${timestamp}`, {
        method: 'GET',
        headers: {
            'token': token,
            'nick': nomeUsuario,
            'idUser': idUser
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(response)
        }
        return response.json();
    }).then(function (mensagens) {
        abaMensagens.innerHTML = '';
        console.log(mensagens)
        console.log(mensagens.msgs.length)
        let tamanho = mensagens.msgs.length
        for (let i = 0; i < tamanho; i++) {
            let teste = document.createElement('div')
            let mensagem = document.createElement('div')
            abaMensagens.appendChild(teste)
            teste.appendChild(mensagem)
            teste.style.width='100%'
            let nick = document.createElement('div')
            mensagem.appendChild(nick)
            nick.innerText = mensagens.msgs[i].nick
            nick.style.fontSize = '20px'
            nick.style.borderBottom = 'solid 1px white'
            nick.style.width = '90%'
            nick.style.textAlign = 'left'
            let conteudo = document.createElement('div')
            mensagem.appendChild(conteudo)
            conteudo.innerText = mensagens.msgs[i].msg
            conteudo.style.paddingLeft = '15px'
            conteudo.style.paddingRight = '15px'
            mensagem.style.backgroundColor = '#828482'
            mensagem.style.outline = 'solid 1px #00FF0A'
            mensagem.style.width = 'fit-content'
            mensagem.style.borderRadius = '10px'
            mensagem.style.display = 'flex'
            mensagem.style.flexWrap = 'wrap'
            mensagem.style.justifyContent = 'center'
            mensagem.style.marginTop = '15px'
            teste.style.display = 'flex'
            abaMensagens.style.display = 'flex'
            abaMensagens.style.flexWrap = 'wrap'
            if (mensagens.msgs[i].nick == nomeUsuario) {
                teste.style.justifyContent = 'flex-end'
            } else {
                teste.style.justifyContent = 'flex-start'
            }
        }
    }).catch(error => [
        console.log(error)
    ])
}


function toggleMenu() {
    menuLateral.classList.toggle('active');
    cont++;
}

function iniciarAtualizacaoAutomatica() {
       setInterval(() => {
           listarMensagens(); 
       }, 1000); 
}

iniciarAtualizacaoAutomatica()
