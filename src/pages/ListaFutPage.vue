<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="text-h6">Times Salvos</div>
            </q-card-section>

            <q-card-section v-if="times.jogadores.length || times.reservas.length">
                <!-- TIME 1 -->
                <div class="text-subtitle1">Time 1</div>
                <q-input v-model="comentarios.time1" label="Comentário do Time 1 (posição, etc)" filled
                    class="q-mb-sm" />
                <q-list bordered separator>
                    <q-item v-for="(jogador, index) in times.jogadores.slice(0, 7)" :key="'t1-' + index">
                        <q-item-section>
                            <q-input v-model="times.jogadores[index]" filled dense />
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat dense icon="delete" color="negative" @click="removerJogador(index)" />
                        </q-item-section>
                    </q-item>
                </q-list>
                <q-btn label="Adicionar Jogador ao Time 1" icon="add" @click="adicionarJogador(0)" class="q-mt-sm" />

                <!-- TIME 2 -->
                <div class="text-subtitle1 q-mt-md">Time 2</div>
                <q-input v-model="comentarios.time2" label="Comentário do Time 2 (posição, etc)" filled
                    class="q-mb-sm" />
                <q-list bordered separator>
                    <q-item v-for="(jogador, index) in times.jogadores.slice(7, 14)" :key="'t2-' + index">
                        <q-item-section>
                            <q-input v-model="times.jogadores[index + 7]" filled dense />
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat dense icon="delete" color="negative" @click="removerJogador(index + 7)" />
                        </q-item-section>
                    </q-item>
                </q-list>
                <q-btn label="Adicionar Jogador ao Time 2" icon="add" @click="adicionarJogador(7)" class="q-mt-sm" />

                <!-- RESERVAS -->
                <div class="text-subtitle1 q-mt-md">Banco de reservas</div>
                <q-list bordered separator>
                    <q-item v-for="(reserva, index) in times.reservas" :key="'res-' + index">
                        <q-item-section>
                            <q-input v-model="times.reservas[index]" filled dense />
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat dense icon="delete" color="negative" @click="removerReserva(index)" />
                        </q-item-section>
                    </q-item>
                </q-list>
                <q-btn label="Adicionar Reserva" icon="add" @click="adicionarReserva" class="q-mt-sm" />
            </q-card-section>

            <q-card-section v-else>
                <div class="text-center text-grey">Nenhum time salvo.</div>
            </q-card-section>

            <q-card-section>
                <q-btn label="Salvar Alterações" @click="salvarEdicoes" color="primary" icon="save" class="q-mr-sm" />
                <q-btn label="Limpar Lista" @click="limparLista" color="negative" icon="delete_forever" />
                <q-btn label="Sortear Times" @click="sortearTimes" color="secondary" icon="shuffle" class="q-ml-md" />
            </q-card-section>

            <!-- Cronômetro -->
            <q-card-section>
                <div class="text-h6">Cronômetro</div>
                <q-input v-model="tempoInput" type="number" label="Tempo do jogo (minutos)" filled />
                <div class="q-mt-md text-h6">{{ formatarTempo(tempoRestante) }}</div>

                <div class="q-mt-md">
                    <q-btn icon="play_arrow" label="Iniciar" @click="iniciarCronometro" color="positive"
                        :disable="cronometroAtivo" />
                    <q-btn icon="pause" label="Parar" @click="pararCronometro" color="negative" class="q-ml-sm"
                        :disable="!cronometroAtivo" />
                    <q-btn icon="replay" label="Zerar" @click="zerarCronometro" color="warning" class="q-ml-sm" />
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const times = ref({ jogadores: [], reservas: [] });
const comentarios = ref({ time1: "", time2: "" });

const tempoInput = ref(10);
const tempoRestante = ref(0);
const cronometroAtivo = ref(false);
let intervalo = null;

onMounted(() => {
    const dadosSalvos = JSON.parse(localStorage.getItem("timesSalvos"));
    if (dadosSalvos) times.value = dadosSalvos;

    const tempoRestanteSalvo = parseInt(localStorage.getItem("tempoRestante"));
    const tempoInputSalvo = parseInt(localStorage.getItem("tempoInput"));

    if (!isNaN(tempoInputSalvo)) tempoInput.value = tempoInputSalvo;
    if (!isNaN(tempoRestanteSalvo)) tempoRestante.value = tempoRestanteSalvo;
});

watch([tempoInput, tempoRestante], () => {
    localStorage.setItem("tempoInput", tempoInput.value);
    localStorage.setItem("tempoRestante", tempoRestante.value);
});

const salvarEdicoes = () => {
    localStorage.setItem("timesSalvos", JSON.stringify(times.value));
    alert("Times atualizados!");
};

const limparLista = () => {
    if (confirm("Tem certeza que deseja limpar toda a lista?")) {
        times.value = { jogadores: [], reservas: [] };
        localStorage.removeItem("timesSalvos");
    }
};

const adicionarJogador = (posicao) => {
    times.value.jogadores.splice(posicao, 0, "");
};

const removerJogador = (index) => {
    times.value.jogadores.splice(index, 1);
};

const adicionarReserva = () => {
    times.value.reservas.push("");
};

const removerReserva = (index) => {
    times.value.reservas.splice(index, 1);
};

const sortearTimes = () => {
    if (times.value.jogadores.length < 14) {
        alert("É necessário pelo menos 14 jogadores para o sorteio!");
        return;
    }

    const jogadoresEmbaralhados = [...times.value.jogadores].sort(() => Math.random() - 0.5);
    times.value.jogadores = jogadoresEmbaralhados.slice(0, 14);
    times.value.reservas = jogadoresEmbaralhados.slice(14);
    salvarEdicoes();
};

const iniciarCronometro = () => {
    if (tempoInput.value <= 0) {
        alert("Defina um tempo válido!");
        return;
    }

    if (tempoRestante.value <= 0) {
        tempoRestante.value = tempoInput.value * 60;
    }

    cronometroAtivo.value = true;

    intervalo = setInterval(() => {
        if (tempoRestante.value > 0) {
            tempoRestante.value--;
        } else {
            clearInterval(intervalo);
            cronometroAtivo.value = false;
            alert("⏰ Tempo esgotado!");
        }
    }, 1000);
};

const pararCronometro = () => {
    clearInterval(intervalo);
    cronometroAtivo.value = false;
};

const zerarCronometro = () => {
    clearInterval(intervalo);
    tempoRestante.value = 0;
    cronometroAtivo.value = false;
};

const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
};
</script>
