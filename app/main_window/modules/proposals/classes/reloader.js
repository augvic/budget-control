import { TablePopulator } from "./table_populator.js";
import { BalanceUpdater } from "./balance_updater.js";

export class Reloader {

    constructor() {
        this.tablePopulator = new TablePopulator();
        this.balanceUpdater = new BalanceUpdater();
    }

    reloadTableLoop(proposalsStatus, fieldsToShow, buttonsTypes) {
        this.intervalTable = setInterval(() => {
            this.tablePopulator.populateTable(proposalsStatus, fieldsToShow, buttonsTypes);
        }, 3000);
    }

    stopReloadTableLoop() {
        clearInterval(this.intervalTable);
    }

    reloadBalanceLoop() {
        this.intervalBalance = setInterval(() => {
            this.balanceUpdater.updateCurrentBalance();
        }, 3000);
    }

    stopReloadBalanceLoop() {
        clearInterval(this.intervalBalance);
    }

}