<template>
    <q-page class="q-pa-md">
        <div class="app-container">
        <!-- Partida atual -->
        <q-card class="elevated-card shadow-2 q-mb-md">
            <q-card-section>
                <div class="row items-center justify-between">
                    <div>
                        <div class="text-subtitle1">Partida atual</div>
                        <div class="text-h6">{{ tempoFormatado }}</div>
                    </div>
                    <div class="row q-gutter-sm">
                        <q-btn label="Iniciar" color="primary" @click="iniciarCronometro" :disable="cronometroAtivo" />
                        <q-btn label="Pausar" color="warning" @click="pausarCronometro" :disable="!cronometroAtivo" />
                        <q-btn label="Reiniciar" color="negative" @click="reiniciarCronometro" />
                    </div>
                </div>
            </q-card-section>
        </q-card>

        <q-card class="elevated-card shadow-2">
            <q-card-section>
                <div class="text-h5">Times Salvos</div>
            </q-card-section>

            <!-- Times -->
            <q-card-section v-if="times.length">
                <div v-for="(time, tIndex) in times" :key="'time-' + tIndex" class="q-mb-md">
                    <div class="text-subtitle1 row items-center justify-between">
                        <span>Time {{ tIndex + 1 }}</span>
                        <q-badge color="primary" outline>{{ time.length }}/7</q-badge>
                    </div>

                    <q-list bordered separator>
                        <q-item v-for="(jogador, jIndex) in time" :key="'jogador-' + jIndex">
                            <q-item-section avatar>
                                <q-avatar color="secondary" text-color="white">{{ getInicial(jogador) }}</q-avatar>
                            </q-item-section>
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
                        <q-item-section avatar>
                            <q-avatar color="grey-7" text-color="white">{{ getInicial(reserva) }}</q-avatar>
                        </q-item-section>
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
                <q-input ref="novoJogadorInput" v-model="novoJogador" label="Nome do Jogador" dense @keyup.enter="adicionarNovoJogador" />
                <q-btn label="Adicionar" color="primary" @click="adicionarNovoJogador" :disable="!novoJogador" />
            </q-card-section>


            <!-- Cronômetro (mantido oculto pois está acima) -->
            <q-card-section v-if="false">
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

            <!-- Rotação pós-partida -->
            <q-separator />
            <q-card-section v-if="times.length >= 2" class="q-gutter-sm">
                <div class="text-subtitle1">Encerrar partida e rotacionar</div>
                <div class="row items-center q-gutter-sm">
                    <q-select
                        v-model="timePerdedor"
                        :options="opcoesTimes"
                        label="Time perdedor"
                        dense outlined style="min-width: 220px"
                    />
                    <q-btn label="Encerrar partida" color="orange"
                        :disable="timePerdedor === null"
                        @click="encerrarPartida" />
                </div>
                <div class="text-caption text-grey-7">Regra: o time perdedor vai para a reserva; entram os próximos 7 da fila formando o novo time.</div>
            </q-card-section>
        </q-card>
        </div>

        <!-- FABs contextuais -->
        <q-fab v-if="temJogadores" icon="add" direction="up" color="primary" class="q-fab absolute-bottom-right q-ma-md">
            <q-fab-action color="primary" icon="person_add" @click="focarAdicionarReserva" label="Adicionar jogador" />
            <q-fab-action color="orange" icon="shuffle" @click="confirmarSorteio" label="Refazer sorteio" />
            <q-fab-action color="secondary" icon="flag" @click="abrirEncerrarPartida" label="Encerrar partida" />
        </q-fab>
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
        const timePerdedor = ref(null);
        const novoJogadorInput = ref(null);

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
            novoJogadorInput.value?.focus?.();

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

        // Opções de select para times
        const opcoesTimes = computed(() => times.value.map((_, idx) => ({ label: `Time ${idx + 1}`, value: idx })));

        // Encerrar partida / Rotação
        const encerrarPartida = () => {
            const perd = timePerdedor.value?.value ?? timePerdedor.value;
            if (perd === null || perd === undefined) return;
            if (times.value.length < 2) return;

            const jogadoresPerdedores = times.value[perd].splice(0);
            // time perdedor vai para o fim da fila de reservas
            reservas.value.push(...jogadoresPerdedores);

            // puxar até 7 da reserva para formar o novo time
            const novos = reservas.value.splice(0, 7);
            times.value[perd] = novos;

            // feedback e persistência
            localStorage.setItem('timesSalvos', JSON.stringify({ times: times.value, reservas: reservas.value }));
            timePerdedor.value = null;
            $q.notify({ type: 'positive', message: 'Partida encerrada. Times rotacionados.', position: 'top' });
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

        const getInicial = (nome) => (nome || '').trim().charAt(0).toUpperCase();
        const focarAdicionarReserva = () => novoJogadorInput.value?.focus?.();
        const abrirEncerrarPartida = () => {
            if (opcoesTimes.value.length >= 2) {
                timePerdedor.value = opcoesTimes.value[0];
                $q.notify({ type: 'info', message: 'Selecione o time perdedor e confirme.', position: 'top' });
            }
        };

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
            cronometroAtivo,
            timePerdedor,
            opcoesTimes,
            encerrarPartida,
            getInicial,
            focarAdicionarReserva,
            abrirEncerrarPartida,
            novoJogadorInput
        };
    }
};
</script>