<template>
    <q-page class="q-pa-md">
        <div class="app-container">
            <q-card class="q-pa-md elevated-card shadow-2">
                <q-card-section>
                    <div class="text-h6 section-title">Sortear Times</div>
                    <div class="row items-center q-gutter-sm">
                        <q-input v-model="novoJogador" label="Adicionar jogador" outlined dense class="col-grow" @keyup.enter="adicionarJogador" />
                        <q-btn @click="adicionarJogador" color="primary" dense>Adicionar</q-btn>
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section>
                    <q-list bordered separator>
                        <q-item v-for="(jogador, index) in jogadores" :key="index">
                            <q-item-section>{{ jogador }}</q-item-section>
                            <q-item-section side>
                                <q-btn flat icon="delete" color="negative" @click="removerJogador(index)" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>

                <q-card-section class="q-gutter-sm">
                    <q-btn @click="sortearTimes" color="green">Sortear</q-btn>
                    <q-btn @click="salvarTimes" color="primary">Salvar Times</q-btn>
                </q-card-section>

                <q-separator v-if="times.length" />

                <q-card-section v-if="times.length">
                    <div class="text-subtitle1 q-mb-sm">Times Sorteados</div>
                    <div v-for="(time, index) in times" :key="index" class="q-mb-md">
                        <div class="text-subtitle2 q-mb-xs">Time {{ index + 1 }}</div>
                        <q-list bordered separator>
                            <q-item v-for="(jogador, jIndex) in time" :key="jIndex">
                                <q-item-section>{{ jogador }}</q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script>
export default {
    data() {
        return {
            novoJogador: "",
            jogadores: [],
            times: [],
            reservas: []
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
            if (this.jogadores.length < 14) {
                alert("Adicione pelo menos 14 jogadores para sortear dois times de 7.");
                return;
            }
            const embaralhado = [...this.jogadores].sort(() => Math.random() - 0.5);
            this.times = [];
            this.reservas = [];

            while (embaralhado.length >= 7) {
                this.times.push(embaralhado.splice(0, 7));
            }
            if (embaralhado.length) {
                this.reservas = embaralhado;
            }
        },
        salvarTimes() {
            localStorage.setItem("timesSalvos", JSON.stringify({
                times: this.times,
                reservas: this.reservas
            }));
            if (this.$q) {
                this.$q.notify({ type: 'positive', message: 'Times salvos!', position: 'top' });
            }
            this.$router.push('/lista-fut');
        }
    }
};
</script>