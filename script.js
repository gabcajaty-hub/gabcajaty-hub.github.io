"use strict";

/* ====== EDITE AQUI: seus projetos ======
   categoria: "web" ou "app" | link: deixe "" se ainda não existe */
const projetos = [
  {
    titulo: "Controle financeiro para motoqueiros",
    descricao: "App para entregadores acompanharem ganhos, gastos e lucro do dia.",
    categoria: "app",
    tecnologias: ["JavaScript", "HTML", "CSS"],
    status: "Em desenvolvimento",
    link: ""
  },
  {
    titulo: "Sistema de gestão Pet Cajaty",
    descricao: "Painel para organizar clientes, agendamentos e serviços de banho e tosa.",
    categoria: "web",
    tecnologias: ["JavaScript", "HTML", "CSS"],
    status: "Em desenvolvimento",
    link: ""
  },
  {
    titulo: "Meu portfólio",
    descricao: "Este site, feito do zero para apresentar meu trabalho.",
    categoria: "web",
    tecnologias: ["HTML", "CSS", "JavaScript"],
    status: "",
    link: "#inicio"
  }
];

const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== Projetos e filtros ===== */
const lista = document.getElementById("listaProjetos");
const botoesFiltro = document.querySelectorAll(".filtro");

function criarCard(p) {
  const card = document.createElement("article");
  card.className = "card";

  const titulo = document.createElement("h3");
  titulo.textContent = p.titulo;
  card.appendChild(titulo);

  if (p.status) {
    const status = document.createElement("span");
    status.className = "status";
    status.textContent = p.status;
    card.appendChild(status);
  }

  const desc = document.createElement("p");
  desc.textContent = p.descricao;
  card.appendChild(desc);

  const tags = document.createElement("ul");
  tags.className = "tags";
  p.tecnologias.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    tags.appendChild(li);
  });
  card.appendChild(tags);

  if (p.link) {
    const a = document.createElement("a");
    a.href = p.link;
    a.textContent = "Ver projeto";
    if (p.link.startsWith("http")) { a.target = "_blank"; a.rel = "noopener"; }
    card.appendChild(a);
  }
  return card;
}

function mostrarProjetos(filtro = "todos") {
  lista.replaceChildren();
  const filtrados = projetos.filter((p) => filtro === "todos" || p.categoria === filtro);
  if (filtrados.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum projeto nesta categoria ainda.";
    lista.appendChild(vazio);
    return;
  }
  filtrados.forEach((p) => lista.appendChild(criarCard(p)));
}

botoesFiltro.forEach((btn) => {
  btn.addEventListener("click", () => {
    botoesFiltro.forEach((b) => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    mostrarProjetos(btn.dataset.filtro);
  });
});

/* ===== Menu no celular ===== */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", String(aberto));
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("aberto");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

/* ===== Tema claro/escuro ===== */
const raiz = document.documentElement;
const temaBtn = document.getElementById("temaBtn");

function aplicarTema(tema) {
  raiz.dataset.theme = tema;
  temaBtn.textContent = tema === "dark" ? "☀️" : "🌙";
  try { localStorage.setItem("tema", tema); } catch {}
}
let temaSalvo = null;
try { temaSalvo = localStorage.getItem("tema"); } catch {}
aplicarTema(temaSalvo || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
temaBtn.addEventListener("click", () => {
  aplicarTema(raiz.dataset.theme === "dark" ? "light" : "dark");
});

/* ===== Frase digitando ===== */
const frases = ["desenvolvedor web.", "criador de sistemas.", "apaixonado por front-end."];
const alvoDigitar = document.getElementById("digitando");
let f = 0, c = 0, apagando = false;

function digitar() {
  const frase = frases[f];
  c += apagando ? -1 : 1;
  alvoDigitar.textContent = frase.slice(0, c);
  let atraso = apagando ? 40 : 90;
  if (!apagando && c === frase.length) { apagando = true; atraso = 1400; }
  else if (apagando && c === 0) { apagando = false; f = (f + 1) % frases.length; atraso = 400; }
  setTimeout(digitar, atraso);
}
if (reduz) alvoDigitar.textContent = frases[0]; else digitar();

/* ===== Foto: inclina com o mouse e brilho que segue ===== */
const heroFoto = document.getElementById("heroFoto");
if (!reduz && matchMedia("(hover: hover)").matches) {
  heroFoto.addEventListener("mousemove", (e) => {
    const r = heroFoto.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    heroFoto.style.setProperty("--gx", (x - 0.5) * 16 + "deg");
    heroFoto.style.setProperty("--gy", (0.5 - y) * 16 + "deg");
    heroFoto.style.setProperty("--mx", x * 100 + "%");
    heroFoto.style.setProperty("--my", y * 100 + "%");
  });
  heroFoto.addEventListener("mouseleave", () => {
    heroFoto.style.setProperty("--gx", "0deg");
    heroFoto.style.setProperty("--gy", "0deg");
  });
}

/* ===== Seções aparecem ao rolar ===== */
if (!reduz && "IntersectionObserver" in window) {
  const observador = new IntersectionObserver((itens) => {
    itens.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add("visivel");
        observador.unobserve(item.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".secao").forEach((secao) => {
    secao.classList.add("revelar");
    observador.observe(secao);
  });
}

/* ===== Barra de progresso da rolagem ===== */
const barra = document.getElementById("progresso");
function atualizarBarra() {
  const max = document.documentElement.scrollHeight - innerHeight;
  barra.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}
addEventListener("scroll", atualizarBarra, { passive: true });
atualizarBarra();

/* ===== Rodapé ===== */
document.getElementById("ano").textContent = new Date().getFullYear();
mostrarProjetos();