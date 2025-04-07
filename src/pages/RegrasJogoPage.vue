<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="text-h5">Regras do Jogo</div>
                <q-input v-model="regras" type="textarea" filled placeholder="Digite aqui as regras do jogo" autogrow />
                <q-btn label="Salvar Regras" @click="salvar" color="primary" class="q-mt-md" />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const regras = ref('');

onMounted(() => {
    const salvas = localStorage.getItem('regrasJogo');
    if (salvas) {
        regras.value = salvas;
    }
});

function salvar() {
    localStorage.setItem('regrasJogo', regras.value);
    alert('Regras salvas!');
}
</script>