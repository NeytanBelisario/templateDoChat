
async function entrar() {
    let nome_ = document.getElementById('inputNome').value
    console.log(nome_)

    const data = {
        nick: nome_
    } 
    document.getElementById('inputNome').value = "";
    await fetch('https://chat-crng.onrender.com/entrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro')
        }
        return response.json();
    }).then(function(informacoes){
        console.log(informacoes.idUser, informacoes.nick, informacoes.token)
        let id = informacoes.idUser
        let nick = informacoes.nick
        let token = informacoes.token
        localStorage.setItem("id" , JSON.stringify(id));
        localStorage.setItem("token" , JSON.stringify(token));
        localStorage.setItem("nick" , JSON.stringify(nick));
        window.location.href = "chat.html"
    })
    .catch(error => console.log(error))
}


function modalON() {
    let modal = document.getElementById('modalNome')
    modal.style.display = 'flex'
}

