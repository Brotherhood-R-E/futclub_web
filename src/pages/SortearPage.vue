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
                <h4>Time 1</h4>
                <q-list bordered separator>
                    <q-item v-for="(jogador, index) in time1" :key="index">
                        <q-item-section>
                            <div>{{ jogador.nome }}</div>
                            <q-input v-model="jogador.comentario" label="Comentário" dense />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <q-card-section>
                <h4>Time 2</h4>
                <q-list bordered separator>
                    <q-item v-for="(jogador, index) in time2" :key="index">
                        <q-item-section>
                            <div>{{ jogador.nome }}</div>
                            <q-input v-model="jogador.comentario" label="Comentário" dense />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <q-card-section>
                <h4>Reservas</h4>
                <q-list bordered separator>
                    <q-item v-for="(reserva, index) in reservas" :key="index">
                        <q-item-section>{{ reserva.nome }}</q-item-section>
                        <q-item-section side>
                            <q-btn icon="arrow_back" color="primary" flat @click="moverParaJogadores(index)" />
                            <q-btn icon="delete" color="negative" flat @click="removerReserva(index)" />
                        </q-item-section>
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

export default {
    setup() {
        const jogadores = ref([]);
        const reservas = ref([]);
        const time1 = ref([]);
        const time2 = ref([]);
        const novoJogador = ref("");
        const novoReserva = ref("");

        const adicionarJogador = () => {
            if (novoJogador.value.trim() !== "") {
                jogadores.value.push({ nome: novoJogador.value, comentario: "" });
                novoJogador.value = "";
            }
        };

        const adicionarReserva = () => {
            if (novoReserva.value.trim() !== "") {
                reservas.value.push({ nome: novoReserva.value, comentario: "" });
                novoReserva.value = "";
            }
        };

        const removerJogador = (index) => {
            jogadores.value.splice(index, 1);
        };

        const removerReserva = (index) => {
            reservas.value.splice(index, 1);
        };

        const moverParaReserva = (index) => {
            const jogador = jogadores.value.splice(index, 1)[0];
            reservas.value.push(jogador);
        };

        const moverParaJogadores = (index) => {
            const reserva = reservas.value.splice(index, 1)[0];
            jogadores.value.push(reserva);
        };

        const sortearTimes = () => {
            if (jogadores.value.length < 14) {
                alert("Adicione pelo menos 14 jogadores para sortear.");
                return;
            }

            // Embaralha os jogadores
            const jogadoresSorteados = [...jogadores.value].sort(() => Math.random() - 0.5);

            // Divide os jogadores em dois times de 7
            time1.value = jogadoresSorteados.slice(0, 7);
            time2.value = jogadoresSorteados.slice(7, 14);

            // O restante vai para a reserva
            reservas.value = jogadoresSorteados.slice(14);

            // Limpa a lista de jogadores
            jogadores.value = [];
        };

        const salvarTimes = () => {
            alert("Times salvos com sucesso!");
        };

        return {
            jogadores,
            reservas,
            time1,
            time2,
            novoJogador,
            novoReserva,
            adicionarJogador,
            adicionarReserva,
            removerJogador,
            removerReserva,
            moverParaReserva,
            moverParaJogadores,
            sortearTimes,
            salvarTimes,
        };
    },
};
</script>