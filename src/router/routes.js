import MainLayout from "layouts/MainLayout.vue";
import IndexPage from "pages/IndexPage.vue";
import SortearPage from "pages/SortearPage.vue";
import AdicionarJogadorPage from "pages/AdicionarJogadorPage.vue";
import RegrasJogopage from "pages/RegrasJogoPage.vue";
import ListaFutPage from "pages/ListaFutPage.vue";
import GerenciarTimesPage from "pages/GerenciarTimesPage.vue";

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      { path: "", component: IndexPage },
      { path: "sortear", component: SortearPage },
      { path: "adicionar-jogador", component: AdicionarJogadorPage },
      { path: "regras-do-jogo", component: RegrasJogopage },
      { path: "lista-fut", component: ListaFutPage },
      { path: "gerenciar-times", component: GerenciarTimesPage },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
