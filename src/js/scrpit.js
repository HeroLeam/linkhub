async function carregarDados() {
  const spreadsheetId = "2PACX-1vS585Q52aHp1uTwQS1QSAwax1piReJjcHfz-I4pGf3i1W9eRGgNw6QiAorAXUegWoo-8nQyuWqENedg";
  const url = `https://docs.google.com/spreadsheets/d/e/${spreadsheetId}/pub?output=csv`;

  try {
    const response = await fetch(url);
    const csvText = await response.text();
    const linhas = csvText.split("\n").slice(4).map((row) => row.split(","));
    const paginaNome = window.location.pathname.split("/").pop().split(".")[0].toLowerCase() || "index";

    const dadosFiltrados = linhas
      .map((linha) => {
        if (paginaNome === "index") {
          return [linha[2], linha[3], linha[4]];
        } else if (paginaNome === "rib") {
          return [linha[7], linha[8], linha[9]];
        } else if (paginaNome === "apartamento") {
          return [linha[12], linha[13], linha[14]];
        } else if (paginaNome === "bancos") {
          return [linha[17], linha[18], linha[19]];
        } else if (paginaNome === "games") {
          return [linha[22], linha[23], linha[24]];
        } else if (paginaNome === "google") {
          return [linha[27], linha[28], linha[29]];
        } else if (paginaNome === "store") {
          return [linha[32], linha[33], linha[34]];
        } else if (paginaNome === "stream") {
          return [linha[37], linha[38], linha[39]];
        }
        return null;
      })
      .filter(Boolean)
      .filter((linha) => linha.some((cell) => cell.trim() !== ""));

    criarCards(dadosFiltrados);
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

async function obterFavicon(url) {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch (error) {
    console.error("Erro ao obter favicon para", url, error);
    return null;
  }
}

async function criarCards(linhas) {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";

  for (const linha of linhas) {
    const [nome, url, imagemUrl] = linha;
    let imagemFinal = imagemUrl && imagemUrl.trim() !== "" ? imagemUrl : await obterFavicon(url);

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
    img.src = imagemFinal;
    img.alt = `Ícone ${nome || "Link"}`;
    img.style.width = "75%"; 
    img.style.height = "75%"; 
    img.style.objectFit = "contain"; 

    link.appendChild(img);
    content.appendChild(link);
    card.appendChild(bgUwu);
    card.appendChild(bg);
    card.appendChild(bgBorder);
    card.appendChild(content);
    conteudo.appendChild(card);
  }
}

carregarDados();

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}