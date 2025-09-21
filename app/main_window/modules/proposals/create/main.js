import { EventListener } from './classes/event_listener.js';
import { AssistentesPopulator } from './classes/assistentes_populator.js'
import { ProcessadoresPopulator } from './classes/processadores_populator.js';
import { ModelosPopulator } from './classes/modelos_populator.js';
import { BalanceUpdater } from '../classes/balance_updater.js'
import { Reloader } from '../classes/reloader.js'

const balanceUpdater = new BalanceUpdater();
balanceUpdater.updateCurrentBalance();

const balanceReloader = new Reloader();
balanceReloader.reloadBalanceLoop();

const assistentesPopulator = new AssistentesPopulator();
assistentesPopulator.populateAssistentes();

const processadoresPopulator = new ProcessadoresPopulator();
processadoresPopulator.populateProcessadores();

const modelosPopulator = new ModelosPopulator();
modelosPopulator.populateModelos();

const eventListener = new EventListener(balanceReloader);
eventListener.valorUnitarioListener();
eventListener.quantidadeListener();
eventListener.verbaConcedidaListener();
eventListener.sendProposalListener();
eventListener.returnButtonListener();
eventListener.openModalButtonListener();
eventListener.closeModalButtonListener();
eventListener.convertToExcelListener();