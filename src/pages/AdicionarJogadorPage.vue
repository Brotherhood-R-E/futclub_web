<template>
    <q-page class="q-pa-md">
        <h2>Sortear Times</h2>

        <q-input v-model="novoJogador" label="Adicionar jogador" outlined />
        <q-btn @click="adicionarJogador" color="primary" class="q-ml-sm">Adicionar</q-btn>

        <q-list bordered separator class="q-mt-md">
            <q-item v-for="(jogador, index) in jogadores" :key="index">
                <q-item-section>{{ jogador }}</q-item-section>
                <q-item-section side>
                    <q-btn flat icon="delete" color="negative" @click="removerJogador(index)" />
                </q-item-section>
            </q-item>
        </q-list>

        <q-btn @click="sortearTimes" color="green" class="q-mt-md">Sortear</q-btn>
        <q-btn @click="salvarTimes" color="blue" class="q-ml-md">Salvar Times</q-btn>

        <div v-if="times.length">
            <h3 class="q-mt-md">Times Sorteados</h3>
            <div v-for="(time, index) in times" :key="index" class="q-mb-md">
                <h4>Time {{ index + 1 }}</h4>
                <q-list bordered separator>
                    <q-item v-for="(jogador, jIndex) in time" :key="jIndex">
                        <q-item-section>{{ jogador }}</q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>
    </q-page>
</template>

<script>
export default {
    data() {
        return {
            novoJogador: "",
            jogadores: [],
            times: []
        };
    },
    methods: {
        adicionarJogador() {
            if (this.novoJogador.trim()) {
                this.jogadores.push(this.novoJogador.trim());
                this.novoJogador = "";
            }
        },
        removerJogador(index) {
            this.jogadores.splice(index, 1);
        },
        sortearTimes() {
            let embaralhado = [...this.jogadores].sort(() => Math.random() - 0.5);
            this.times = [
                embaralhado.slice(0, Math.ceil(embaralhado.length / 2)),
                embaralhado.slice(Math.ceil(embaralhado.length / 2))
            ];
        },
        salvarTimes() {
            localStorage.setItem("times", JSON.stringify(this.times));
            alert("Times salvos com sucesso!");
        }
    }
};
</script>