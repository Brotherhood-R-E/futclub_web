<template>
    <q-page class="q-pa-md">
        <q-card class="q-pa-md shadow-2 rounded-borders">
            <!-- Adicionar Jogador -->
            <q-card-section class="q-gutter-sm">
                <q-input v-model="novoJogador" label="Adicionar Jogador" @keyup.enter="adicionarJogador" filled dense />
                <q-btn label="Adicionar" @click="adicionarJogador" color="primary" />
            </q-card-section>

            <!-- Lista de Jogadores Adicionados -->
            <q-slide-transition>
                <q-card-section v-if="jogadores.length">
                    <div class="text-subtitle1">Jogadores</div>
                    <q-list bordered class="rounded-borders q-mb-md">
                        <q-item v-for="(jogador, index) in jogadores" :key="'jogador-adicionado-' + index">
                            <q-item-section>{{ jogador }}</q-item-section>
                            <q-item-section side>
                                <q-btn flat dense icon="delete" color="negative" @click="removerJogador(index)" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-slide-transition>

            <!-- Sortear Times -->
            <q-card-section>
                <q-btn label="Sortear Times" @click="sortearTimes" color="primary" class="full-width" />
            </q-card-section>

            <!-- Lista de Times -->
            <q-slide-transition>
                <q-card-section v-for="(time, index) in times" :key="'time-' + index">
                    <div class="text-h6 q-mt-md">Time {{ index + 1 }} ({{ time.length }}/7)</div>
                    <q-list bordered separator class="rounded-borders">
                        <q-item v-for="(jogador, jIndex) in time" :key="'jogador-' + jIndex">
                            <q-item-section>
                                <q-input v-model="times[index][jIndex]" dense />
                            </q-item-section>
                            <q-item-section side>
                                <q-btn flat icon="delete" dense color="negative"
                                    @click="removerJogadorDoTime(index, jIndex)" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-slide-transition>

            <!-- Reservas -->
            <q-slide-transition>
                <q-card-section v-if="reservas.length">
                    <div class="text-h6 q-mt-md">Reservas</div>
                    <q-list bordered separator class="rounded-borders">
                        <q-item v-for="(reserva, index) in reservas" :key="'reserva-' + index">
                            <q-item-section>
                                <q-input v-model="reservas[index]" dense />
                            </q-item-section>
                            <q-item-section side>
                                <q-btn flat icon="add" dense color="primary" @click="adicionarReservaAoTime(index)" />
                                <q-btn flat icon="delete" dense color="negative" @click="removerReserva(index)" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </q-card-section>
            </q-slide-transition>

            <!-- Botão Salvar -->
            <q-card-section v-if="times.length">
                <q-btn label="Salvar Times" @click="salvarTimes" color="secondary" class="full-width q-mt-md" />
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const jogadores = ref([]);
        const reservas = ref([]);
        const novoJogador = ref("");
        const times = ref([]);
        const router = useRouter();

        const adicionarJogador = () => {
            if (novoJogador.value.trim()) {
                jogadores.value.push(novoJogador.value.trim());
                novoJogador.value = "";
            }
        };

        const removerJogador = (index) => {
            jogadores.value.splice(index, 1);
        };

        const sortearTimes = () => {
            if (jogadores.value.length < 14) {
                alert("Adicione pelo menos 14 jogadores para sortear.");
                return;
            }

            const embaralhados = [...jogadores.value].sort(() => Math.random() - 0.5);
            times.value = [];
            reservas.value = [];

            while (embaralhados.length >= 7) {
                times.value.push(embaralhados.splice(0, 7));
            }

            if (embaralhados.length > 0) {
                reservas.value = embaralhados;
            }

            jogadores.value = [];
        };

        const adicionarReservaAoTime = (reservaIndex) => {
            if (times.value.length === 0) return;
            const jogador = reservas.value.splice(reservaIndex, 1)[0];

            let menorTimeIndex = 0;
            for (let i = 1; i < times.value.length; i++) {
                if (times.value[i].length < times.value[menorTimeIndex].length) {
                    menorTimeIndex = i;
                }
            }

            times.value[menorTimeIndex].push(jogador);
        };

        const removerJogadorDoTime = (timeIndex, jogadorIndex) => {
            const jogador = times.value[timeIndex].splice(jogadorIndex, 1)[0];
            reservas.value.push(jogador);
        };

        const removerReserva = (index) => {
            reservas.value.splice(index, 1);
        };

        const salvarTimes = () => {
            localStorage.setItem("timesSalvos", JSON.stringify({
                times: times.value,
                reservas: reservas.value
            }));
            router.push("/lista-fut");
        };

        return {
            jogadores,
            reservas,
            novoJogador,
            times,
            adicionarJogador,
            removerJogador,
            sortearTimes,
            adicionarReservaAoTime,
            removerJogadorDoTime,
            removerReserva,
            salvarTimes,
        };
    },
};
</script>

<style scoped>
.full-width {
    width: 100%;
}
</style>