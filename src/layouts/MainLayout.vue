<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>Fut-Pagglo</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Menu</q-item-label>

        <q-item clickable v-ripple to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>Início</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/sortear">
          <q-item-section avatar>
            <q-icon name="shuffle" />
          </q-item-section>
          <q-item-section>Sortear Times</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/lista-fut">
          <q-item-section avatar>
            <q-icon name="list" />
          </q-item-section>
          <q-item-section>Lista do Fut</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/regras-do-jogo">
          <q-item-section avatar>
            <q-icon name="rule" />
          </q-item-section>
          <q-item-section>Regras do Jogo</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Regras do Jogo no rodapé -->
    <!-- <q-footer elevated class="bg-grey-2 text-black">
      <q-card flat bordered class="q-pa-md full-width">
        <q-card-section>
          <div class="text-h6">Regras do Jogo</div>
          <q-input v-model="regrasJogo" type="textarea" filled placeholder="Digite as regras do jogo aqui..." />
          <q-btn label="Salvar Regras" @click="salvarRegras" color="primary" class="q-mt-md" />
        </q-card-section>
      </q-card>
    </q-footer> -->
  </q-layout>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const regrasJogo = ref("");

    onMounted(() => {
      const regrasSalvas = localStorage.getItem("regrasJogo");
      if (regrasSalvas) {
        regrasJogo.value = regrasSalvas;
      }
    });

    const salvarRegras = () => {
      localStorage.setItem("regrasJogo", regrasJogo.value);
      alert("Regras salvas!");
    };

    return {
      leftDrawerOpen,
      regrasJogo,
      salvarRegras,
    };
  },
};
</script>
