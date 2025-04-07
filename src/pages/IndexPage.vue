<template>
  <q-page class="flex flex-center q-pa-lg">
    <div class="text-center">
      <div class="text-h4 text-bold q-mb-md">Fut-Pagglo</div>
      <div class="text-subtitle1 q-mb-xl">Organize seu futebol com facilidade!</div>

      <div class="q-gutter-md">
        <q-btn label="Sortear Times" icon="sports_soccer" color="primary" size="lg" class="full-width"
          @click="$router.push('/sorteio')" to="/sortear" />
        <q-btn label="Lista do Fut" icon="list" color="secondary" size="lg" class="full-width"
          @click="$router.push('/lista')" to="/lista-fut" />
        <q-btn label="Regras do jogo" icon="rule" color="accent" size="lg" class="full-width"
          @click="$router.push('/regras')" to="/regras-do-jogo" />
      </div>
    </div>
  </q-page>
</template>
