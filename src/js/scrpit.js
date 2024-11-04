async function carregarDados() {
    const spreadsheetId = '2PACX-1vS585Q52aHp1uTwQS1QSAwax1piReJjcHfz-I4pGf3i1W9eRGgNw6QiAorAXUegWoo-8nQyuWqENedg';
    const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`;

    try {
        const response = await fetch(url);
        const csvText = await response.text();

        // Converte o CSV em um array de arrays e ignora a primeira linha (cabeçalho)
        const linhas = csvText.split('\n').slice(1).map(row => row.split(','));

        // Identifica a página atual para escolher as colunas apropriadas
        const paginaNome = window.location.pathname.split('/').pop().split('.')[0].toLowerCase();
        
        // Filtra e mapeia as colunas específicas com base na página
        const dadosFiltrados = linhas.map((linha) => {
            if (paginaNome === 'index') {
                return [linha[0], linha[1], linha[2]]; // Colunas A, B, C para index.html
            } else if (paginaNome === 'twitch') {
                return [linha[4], linha[5], linha[6]]; // Colunas E, F para twitch.html
            }
            return null;
        }).filter(Boolean) // Remove entradas nulas caso não haja correspondência
          .filter((linha) => linha.every(cell => cell)); // Remove linhas com células vazias

        criarCards(dadosFiltrados);
    } catch (error) {
        console.error('Erro ao carregar os dados:', error);
    }
}

function criarCards(linhas) {
    const conteudo = document.getElementById('conteudo');
    conteudo.innerHTML = '';

    linhas.forEach((linha) => {
        const [nome, url, imagemUrl] = linha; // Para `index.html`, teremos nome, url, imagem. Para `twitch.html`, apenas url e imagem.

        const card = document.createElement('div');
        card.classList.add('card');

        const bgUwu = document.createElement('div');
        bgUwu.classList.add('bg', 'uwu');

        const bg = document.createElement('div');
        bg.classList.add('bg');

        const bgBorder = document.createElement('div');
        bgBorder.classList.add('bgBorder');

        const content = document.createElement('div');
        content.classList.add('content');

        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';

        const img = document.createElement('img');
        img.classList.add('iconImage');
        img.src = imagemUrl;
        img.alt = `Ícone ${nome || 'Link'}`; // Se `nome` for indefinido (como no caso de `twitch.html`), define um texto padrão.

        link.appendChild(img);
        content.appendChild(link);
        card.appendChild(bgUwu);
        card.appendChild(bg);
        card.appendChild(bgBorder);
        card.appendChild(content);
        conteudo.appendChild(card);
    });
}

// Chama a função para carregar os dados
carregarDados();