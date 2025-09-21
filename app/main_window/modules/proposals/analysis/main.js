import { BalanceUpdater } from '../classes/balance_updater.js'
import { TablePopulator } from '../classes/table_populator.js'
import { EventListener } from './classes/event_listener.js'
import { Reloader } from '../classes/reloader.js'

const fieldsToShow = [
    "id",
    "data",
    "assistente",
    "revendedor_cliente",
    "certame_negocio",
    "modelo",
    "processador",
    "quantidade",
    "valor_unitario",
    "valor_total",
    "verba_concedida",
    "verba_concedida_porcentagem",
]
const buttonsTypes = [
    "approve",
    "reprove"
]

const balanceUpdater = new BalanceUpdater();
balanceUpdater.updateCurrentBalance();

const tablePopulator = new TablePopulator();
tablePopulator.populateTable("Em Análise", fieldsToShow, buttonsTypes);

const reloader = new Reloader();
reloader.reloadTableLoop("Em Análise", fieldsToShow, buttonsTypes);
reloader.reloadBalanceLoop();

const eventListener = new EventListener(reloader);
eventListener.returnButtonListener();
eventListener.visualizarPropostasAprovadasListener();
eventListener.visualizarPropostasReprovadasListener();
eventListener.convertToExcelListener();
eventListener.aguardandoSegundaAprovaçãoListener();