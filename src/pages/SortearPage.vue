<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <q-input v-model="novoJogador" label="Adicionar Jogador" />
                <q-btn label="Adicionar" @click="adicionarJogador" class="q-mt-md" />
            </q-card-section>
            <q-card-section>
                <q-input v-model="novoReserva" label="Adicionar Reserva" />
                <q-btn label="Adicionar Reserva" @click="adicionarReserva" class="q-mt-md" />
            </q-card-section>
            <q-card-section>
                <q-btn label="Sortear Times" @click="sortearTimes" color="primary" class="q-mb-md" />
            </q-card-section>
            <q-card-section>
                <q-list bordered separator>
                    <q-item v-for="(jogador, index) in jogadores" :key="index">
                        <q-item-section>{{ jogador }}</q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <q-card-section>
                <q-btn label="Salvar Times" @click="salvarTimes" color="secondary" />
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
        const novoReserva = ref("");
        const router = useRouter();

        const adicionarJogador = () => {
            if (novoJogador.value.trim() !== "") {
                jogadores.value.push(novoJogador.value);
                novoJogador.value = "";
            }
        };

        const adicionarReserva = () => {
            if (novoReserva.value.trim() !== "") {
                reservas.value.push(novoReserva.value);
                novoReserva.value = "";
            }
        };

        const sortearTimes = () => {
            if (jogadores.value.length < 14) {
                alert("Adicione pelo menos 14 jogadores para sortear.");
                return;
            }

            jogadores.value = jogadores.value.sort(() => Math.random() - 0.5);
        };

        const salvarTimes = () => {
            localStorage.setItem("timesSalvos", JSON.stringify({ jogadores: jogadores.value, reservas: reservas.value }));
            router.push("/lista-fut");
        };

        return {
            jogadores,
            reservas,
            novoJogador,
            novoReserva,
            adicionarJogador,
            adicionarReserva,
            sortearTimes,
            salvarTimes,
        };
    },
};
</script>