async function carregarDados() {
  const spreadsheetId =
    "2PACX-1vS585Q52aHp1uTwQS1QSAwax1piReJjcHfz-I4pGf3i1W9eRGgNw6QiAorAXUegWoo-8nQyuWqENedg";
  const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`;

  try {
    const response = await fetch(url);
    const csvText = await response.text();

    // Converte o CSV em um array de arrays começando a leitura da 2 linha em diante
    const linhas = csvText.split("\n").slice(3).map((row) => row.split(","));

    // Identifica a página atual para escolher as colunas apropriadas
    const paginaNome =
      window.location.pathname.split("/").pop().split(".")[0].toLowerCase() ||
      "index";

    // Filtra e mapeia as colunas específicas com base na página
    const dadosFiltrados = linhas
      .map((linha) => {
        if (paginaNome === "index") {
          return [linha[1], linha[2], linha[3]];
        } else if (paginaNome === "rib") {
          return [linha[5], linha[6], linha[7]];
        } else if (paginaNome === "twitch") {
          return [linha[9], linha[10], linha[11]];
        } else if (paginaNome === "apartamento") {
          return [linha[13], linha[14], linha[15]];
        } else if (paginaNome === "google") {
          return [linha[17], linha[18], linha[19]];
        } else if (paginaNome === "gov") {
          return [linha[21], linha[22], linha[23]];
        } else if (paginaNome === "bancos") {
          return [linha[25], linha[26], linha[27]];
        } else if (paginaNome === "games") {
          return [linha[29], linha[30], linha[31]];
        } else if (paginaNome === "store") {
          return [linha[33], linha[34], linha[35]];
        }
        return null;
      })
      .filter(Boolean) // Remove entradas nulas caso não haja correspondência
      .filter((linha) => linha.some((cell) => cell.trim() !== "")); // Remove linhas completamente vazias

    criarCards(dadosFiltrados);
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

function criarCards(linhas) {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";

  linhas.forEach((linha) => {
    const [nome, url, imagemUrl] = linha;

    const card = document.createElement("div");
    card.classList.add("card");
    card.title = nome;

    const bgUwu = document.createElement("div");
    bgUwu.classList.add("bg", "uwu");

    const bg = document.createElement("div");
    bg.classList.add("bg");

    const bgBorder = document.createElement("div");
    bgBorder.classList.add("bgBorder");

    const content = document.createElement("div");
    content.classList.add("content");

    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const img = document.createElement("img");
    img.classList.add("iconImage");
    img.src = imagemUrl;
    img.alt = `Ícone ${nome || "Link"}`;

    link.appendChild(img);
    content.appendChild(link);
    card.appendChild(bgUwu);
    card.appendChild(bg);
    card.appendChild(bgBorder);
    card.appendChild(content);
    conteudo.appendChild(card);
  });
}

carregarDados();

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}