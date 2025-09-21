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
    "status",
    "aprovador_reprovador",
    "data_hora_aprovacao_recusa",
    "forma_abatimento",
    "data_abatimento"
]
const buttonsTypes = [
    "nf_include"
]

const tablePopulator = new TablePopulator();
tablePopulator.populateTable("Aprovado", fieldsToShow, buttonsTypes);

const reloader = new Reloader();
reloader.reloadTableLoop("Aprovado", fieldsToShow, buttonsTypes);

const eventListener = new EventListener(reloader);
eventListener.returnButtonListener();
eventListener.convertToExcelListener();