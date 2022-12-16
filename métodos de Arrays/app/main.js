let livros = []
const endPointDaAPI = `https://guilhermeonrails.github.io/casadocodigo/livros.json`
const elementoParaInserirLivros = document.getElementById('livros')
const btn = document.querySelectorAll('.btn')
const valor_total_livros_disponiveis = document.getElementById('valor_total_livros_disponiveis')

buscarLivrosDaAPI();

async function buscarLivrosDaAPI() {
    const res = await fetch(endPointDaAPI);
    livros = await res.json()
    console.table(livros)
    let livrosComDesconto = AplicaDesconto(livros);
    ExibirLivros(livrosComDesconto)
}

function ExibirLivros(listaDeLivros) {
    valor_total_livros_disponiveis.innerHTML = ''
    elementoParaInserirLivros.innerHTML = ''
    listaDeLivros.forEach(livro => {
        // let disponibilidade = VerificarDisponibilidade(livro);
        let disponibilidade = livro.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel'
        
        elementoParaInserirLivros.innerHTML += 
        `<div class="livro">
        <img class="${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
        <h2 class="livro__titulo">
          ${livro.titulo}
        </h2>
        <p class="livro__descricao">${livro.autor}</p>
        <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
        <div class="tags">
          <span class="tag">${livro.categoria}</span>
        </div>
      </div>
      `
    });
}

// function VerificarDisponibilidade(livro){
//     if (livro.quantidade > 0){
//         return 'livro__imagens'
//     }else{
//         return 'livro__imagens indisponivel'
//     }
// }

function AplicaDesconto(livros) {
    const desconto = 0.3
    livrosComDesconto = livros.map(livro => {
        return {...livro, preco: livro.preco - (livro.preco*desconto)}
    })
    return livrosComDesconto
}

btn.forEach(btn => btn.addEventListener('click', e => {
    const idBotao = (e.path[0]).value

    
    let livrosFiltrados = idBotao == 'disponivel'? livros.filter(livro => livro.quantidade > 0) : livros.filter(livro => livro.categoria == idBotao)
    ExibirLivros(livrosFiltrados)
    if (idBotao == 'disponivel') {
        const SomaValores = cacularValor(livrosFiltrados)
        ExibirValorTotal(SomaValores)
    }
}))


btnOrdenarPorPreco.addEventListener('click', OrdenarLivros)

function OrdenarLivros(){
    let livrosOrdenados = livros.sort((a,b)=> a.preco - b.preco)
    ExibirLivros(livrosOrdenados)
}

function ExibirValorTotal(SomaValores){
    valor_total_livros_disponiveis.innerHTML = `
    <div class="livros__disponiveis">
      <p>Todos os livros disponíveis por R$ <span id="valor">${SomaValores}</span></p>
    </div>
    `
}

function cacularValor(livros){
    return livros.reduce((acc, livro) => acc + livro.preco, 0).toFixed(2)
}

