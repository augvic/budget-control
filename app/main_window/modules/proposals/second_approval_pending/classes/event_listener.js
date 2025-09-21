import { ModuleLoader } from '../../../../classes/module_loader.js'
import { Notification } from '../../../../classes/notification.js';

export class EventListener {

    constructor(reloader) {
        this.moduleLoader = new ModuleLoader();
        this.returnButton = document.getElementById("return_button");
        this.visualizarPropostasAprovadasButton = document.getElementById("visualizar_propostas_aprovadas");
        this.visualizarPropostasReprovadasButton = document.getElementById("visualizar_propostas_reprovadas");
        this.convertToExcelButton = document.getElementById("convert_to_excel");
        this.reloader = reloader;
    }

    returnButtonListener() {
        this.returnButton.addEventListener("click", () => {
            this.reloader.stopReloadTableLoop();
            this.reloader.stopReloadBalanceLoop();
            document.getElementById("active_module").classList.add("fade-out-right");
            document.getElementById("active_module").addEventListener("animationend", () => {
                document.getElementById("active_module").classList.remove("fade-out-right");
                this.moduleLoader.loadModule("proposals/analysis", "fade-in-left");
            }, { once: true });
        });
    }

}