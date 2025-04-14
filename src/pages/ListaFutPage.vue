<template>
    <q-page class="q-pa-md">
        <q-card>
            <q-card-section>
                <div class="text-h5">Times Salvos</div>
            </q-card-section>

            <!-- Times -->
            <q-card-section v-if="times.length">
                <div v-for="(time, tIndex) in times" :key="'time-' + tIndex" class="q-mb-md">
                    <div class="text-subtitle1 row items-center justify-between">
                        <span>Time {{ tIndex + 1 }}</span>
                        <span>{{ time.length }}/7 jogadores</span>
                    </div>

                    <q-list bordered separator>
                        <q-item v-for="(jogador, jIndex) in time" :key="'jogador-' + jIndex">
                            <q-item-section>
                                <q-input v-model="times[tIndex][jIndex]" dense />
                            </q-item-section>
                            <q-item-section side>
                                <q-btn flat icon="delete" @click="removerJogadorDoTime(tIndex, jIndex)" />
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <!-- Adicionar da reserva -->
                    <div class="q-mt-sm row items-center q-gutter-sm" v-if="reservas.length">
                        <q-select v-model="reservaSelecionada[tIndex]" :options="reservas" label="Adicionar da Reserva"
                            dense outlined style="min-width: 200px" />
                        <q-btn label="Adicionar" @click="adicionarReservaParaTime(tIndex)"
                            :disable="!reservaSelecionada[tIndex]" color="primary" dense />
                    </div>
                </div>
            </q-card-section>

            <!-- Reservas -->
            <q-card-section v-if="reservas.length">
                <div class="text-subtitle1">Reservas</div>
                <q-list bordered separator>
                    <q-item v-for="(reserva, index) in reservas" :key="'reserva-' + index">
                        <q-item-section>
                            <q-input v-model="reservas[index]" dense />
                        </q-item-section>
                        <q-item-section side>
                            <q-btn flat icon="delete" @click="removerReserva(index)" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
            <!-- Adicionar novo jogador à reserva -->
            <q-card-section>
                <div class="text-subtitle1">Adicionar Jogador à Reserva</div>
                <q-input v-model="novoJogador" label="Nome do Jogador" dense />
                <q-btn label="Adicionar" color="primary" @click="adicionarNovoJogador" :disable="!novoJogador" />
            </q-card-section>


            <!-- Cronômetro -->
            <q-card-section>
                <div class="text-subtitle1 q-mb-sm">Cronômetro do Fut</div>
                <div class="text-h6 q-mb-md">{{ tempoFormatado }}</div>
                <div class="row q-gutter-sm">
                    <q-btn label="Iniciar" color="primary" @click="iniciarCronometro" :disable="cronometroAtivo" />
                    <q-btn label="Pausar" color="warning" @click="pausarCronometro" :disable="!cronometroAtivo" />
                    <q-btn label="Reiniciar" color="negative" @click="reiniciarCronometro" />
                </div>
            </q-card-section>

            <!-- Ações -->
            <q-card-section class="q-gutter-md">
                <q-btn label="Salvar Alterações" color="primary" @click="salvarAlteracoes" />
                <q-btn label="Limpar Tudo" color="negative" @click="limparTudo" />
            </q-card-section>
        </q-card>

        <!-- Botão flutuante de sorteio -->
        <q-btn v-if="temJogadores" icon="shuffle" round color="orange" @click="confirmarSorteio"
            class="q-fab absolute-bottom-right q-ma-md" glossy size="lg">
            <q-tooltip>Refazer sorteio</q-tooltip>
        </q-btn>
    </q-page>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { Dialog } from 'quasar';

export default {
    setup() {
        const $q = useQuasar();
        const router = useRouter();
        const novoJogador = ref("");
        const times = ref([]);
        const reservas = ref([]);
        const reservaSelecionada = ref([]);
        const cronometro = ref(0);
        const cronometroAtivo = ref(false);
        let intervalo = null;

        // Carrega dados salvos
        onMounted(() => {
            const data = JSON.parse(localStorage.getItem("timesSalvos"));
            if (data) {
                times.value = data.times || [];
                reservas.value = data.reservas || [];
                reservaSelecionada.value = Array(times.value.length).fill(null);
            }
        });


        const removerJogadorDoTime = (tIndex, jIndex) => {
            const jogador = times.value[tIndex].splice(jIndex, 1)[0];
            if (jogador?.trim()) reservas.value.push(jogador);
        };

        const removerReserva = (index) => {
            reservas.value.splice(index, 1);
        };

        const adicionarReservaParaTime = (tIndex) => {
            const jogador = reservaSelecionada.value[tIndex];
            if (!jogador) return;

            if (times.value[tIndex].length >= 7) {
                $q.notify({
                    type: 'warning',
                    message: `O Time ${tIndex + 1} já tem 7 jogadores.`,
                    position: 'top'
                });
                return;
            }

            times.value[tIndex].push(jogador);
            const rIndex = reservas.value.indexOf(jogador);
            if (rIndex !== -1) reservas.value.splice(rIndex, 1);
            reservaSelecionada.value[tIndex] = null;
        };
        // Função para adicionar novo jogador à reserva
        const adicionarNovoJogador = () => {
            if (novoJogador.value.trim() === "") {
                $q.notify({
                    type: 'warning',
                    message: 'O nome do jogador não pode estar vazio!',
                    position: 'top'
                });
                return;
            }

            // Adiciona o novo jogador à reserva e limpa o campo de entrada
            reservas.value.push(novoJogador.value.trim());
            novoJogador.value = "";  // Limpa o campo de entrada

            $q.notify({
                type: 'positive',
                message: 'Jogador adicionado à reserva!',
                position: 'top'
            });
        }
        const salvarAlteracoes = () => {
            localStorage.setItem("timesSalvos", JSON.stringify({
                times: times.value,
                reservas: reservas.value
            }));
            $q.notify({
                type: 'positive',
                message: 'Alterações salvas!',
                position: 'top'
            });
        };

        const limparTudo = () => {
            if (confirm("Deseja realmente limpar todos os dados?")) {
                localStorage.removeItem("timesSalvos");
                times.value = [];
                reservas.value = [];
                reservaSelecionada.value = [];
                router.push("/");
            }
        };

        // Computado para exibir botão flutuante só se houver jogadores
        const temJogadores = computed(() =>
            times.value.flat().length > 0 || reservas.value.length > 0
        );

        const confirmarSorteio = () => {
            Dialog.create({
                title: 'Refazer Sorteio',
                message: 'Deseja refazer o sorteio com todos os jogadores e reservas?',
                cancel: true,
                persistent: true
            }).onOk(() => {
                refazerSorteio();
            });
        };

        const refazerSorteio = () => {
            const todos = [
                ...times.value.flat().map(j => j.trim()).filter(j => j),
                ...reservas.value.map(j => j.trim()).filter(j => j)
            ];

            if (todos.length < 14) {
                $q.notify({
                    type: 'warning',
                    message: 'Não há jogadores suficientes para formar dois times.',
                    position: 'top'
                });
                return;
            }

            const embaralhado = [...todos].sort(() => Math.random() - 0.5);
            const novosTimes = [];
            for (let i = 0; i < embaralhado.length; i += 7) {
                novosTimes.push(embaralhado.slice(i, i + 7));
            }

            const timesCheios = novosTimes.filter(t => t.length === 7);
            const resto = novosTimes.find(t => t.length < 7);
            times.value = timesCheios;
            reservas.value = resto || [];
            reservaSelecionada.value = Array(times.value.length).fill(null);

            $q.notify({
                type: 'info',
                message: 'Sorteio realizado!',
                position: 'top'
            });
        };

        // CRONÔMETRO
        const iniciarCronometro = () => {
            if (!cronometroAtivo.value) {
                cronometroAtivo.value = true;
                intervalo = setInterval(() => {
                    cronometro.value++;
                }, 1000);
            }
        };

        const pausarCronometro = () => {
            cronometroAtivo.value = false;
            clearInterval(intervalo);
        };

        const reiniciarCronometro = () => {
            clearInterval(intervalo);
            cronometro.value = 0;
            cronometroAtivo.value = false;
        };

        const tempoFormatado = computed(() => {
            const horas = String(Math.floor(cronometro.value / 3600)).padStart(2, '0');
            const minutos = String(Math.floor((cronometro.value % 3600) / 60)).padStart(2, '0');
            const segundos = String(cronometro.value % 60).padStart(2, '0');
            return `${horas}:${minutos}:${segundos}`;
        });

        return {
            times,
            reservas,
            reservaSelecionada,
            removerJogadorDoTime,
            removerReserva,
            adicionarReservaParaTime,
            novoJogador,
            adicionarNovoJogador,
            salvarAlteracoes,
            limparTudo,
            confirmarSorteio,
            refazerSorteio,
            temJogadores,
            iniciarCronometro,
            pausarCronometro,
            reiniciarCronometro,
            tempoFormatado,
            cronometroAtivo
        };
    }
};
</script>