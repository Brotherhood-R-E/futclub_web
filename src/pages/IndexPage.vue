<template>
  <q-page class="q-pa-lg">
    <div class="app-container q-mx-auto">
      <q-card class="elevated-card shadow-2">
        <q-card-section class="text-center">
          <div class="text-h4 text-weight-bold q-mb-xs">Fut-App</div>
          <div class="text-subtitle1 text-grey-7">Organize seu futebol com facilidade!</div>
        </q-card-section>

        <q-separator />
        <q-card-section>
          <div class="q-gutter-md">
            <q-btn label="Sortear Times" icon="sports_soccer" color="primary" size="lg" class="full-width-btn" to="/sortear" />
            <q-btn label="Lista do Fut" icon="list" color="secondary" size="lg" class="full-width-btn" to="/lista-fut" />
            <q-btn label="Regras do jogo" icon="rule" color="accent" size="lg" class="full-width-btn" to="/regras-do-jogo" />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
