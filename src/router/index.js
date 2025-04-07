import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes"; // ✅ Certifique-se de que está importando o array corretamente

const router = createRouter({
  history: createWebHistory(),
  routes, // ✅ Aqui deve ser um array
});

export default router;
