<template>
    <q-page padding>
        <h2>Gerenciar Times</h2>

        <div v-if="timesSalvos.length">
            <div v-for="(time, index) in timesSalvos" :key="index" class="q-mb-md">
                <h4>Time {{ index + 1 }}</h4>
                <q-list bordered>
                    <q-item v-for="(jogador, jIndex) in time.jogadores" :key="jIndex" clickable>
                        <q-item-section>{{ jogador }}</q-item-section>
                        <q-item-section side>
                            <q-btn @click="removerJogador(index, jIndex)" color="negative" icon="delete" flat />
                        </q-item-section>
                    </q-item>
                </q-list>

                <h5>Reservas</h5>
                <q-list bordered>
                    <q-item v-for="(reserva, rIndex) in time.reservas" :key="rIndex" clickable>
                        <q-item-section>{{ reserva }}</q-item-section>
                        <q-item-section side>
                            <q-btn @click="removerReserva(index, rIndex)" color="negative" icon="delete" flat />
                        </q-item-section>
                    </q-item>
                </q-list>

                <q-btn @click="deletarTime(index)" color="negative" label="Excluir Time" class="q-mt-sm" />
            </div>
        </div>
        <q-btn @click="criarNovoTime" color="primary" label="Criar Novo Time" />
    </q-page>
</template>

<script>
export default {
    data() {
        return {
            timesSalvos: []
        };
    },
    mounted() {
        this.carregarTimes();
    },
    methods: {
        carregarTimes() {
            const data = localStorage.getItem("timesSalvos");
            if (data) {
                const { times, reservas } = JSON.parse(data);
                this.timesSalvos = times.map((t, index) => ({ jogadores: t, reservas: reservas[index] || [] }));
            }
        },
        removerJogador(timeIndex, jogadorIndex) {
            this.timesSalvos[timeIndex].jogadores.splice(jogadorIndex, 1);
            this.salvarEdicao();
        },
        removerReserva(timeIndex, reservaIndex) {
            this.timesSalvos[timeIndex].reservas.splice(reservaIndex, 1);
            this.salvarEdicao();
        },
        deletarTime(index) {
            this.timesSalvos.splice(index, 1);
            this.salvarEdicao();
        },
        criarNovoTime() {
            this.timesSalvos.push({ jogadores: [], reservas: [] });
            this.salvarEdicao();
        },
        salvarEdicao() {
            localStorage.setItem("timesSalvos", JSON.stringify({ times: this.timesSalvos.map(t => t.jogadores), reservas: this.timesSalvos.map(t => t.reservas) }));
        }
    }
};
</script>