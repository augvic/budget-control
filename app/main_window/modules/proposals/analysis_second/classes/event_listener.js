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
                this.moduleLoader.loadModule("login", "fade-in-left");
            }, { once: true });
        });
    }

    visualizarPropostasAprovadasListener() {
        this.visualizarPropostasAprovadasButton.addEventListener("click", () => {
            this.reloader.stopReloadTableLoop();
            this.reloader.stopReloadBalanceLoop();
            document.getElementById("active_module").classList.add("fade-out-left");
            document.getElementById("active_module").addEventListener("animationend", () => {
                document.getElementById("active_module").classList.remove("fade-out-left");
                this.moduleLoader.loadModule("proposals/approved", "fade-in-right");
            }, { once: true });
        });
    }

    visualizarPropostasReprovadasListener() {
        this.visualizarPropostasReprovadasButton.addEventListener("click", () => {
            this.reloader.stopReloadTableLoop();
            this.reloader.stopReloadBalanceLoop();
            document.getElementById("active_module").classList.add("fade-out-left");
            document.getElementById("active_module").addEventListener("animationend", () => {
                document.getElementById("active_module").classList.remove("fade-out-left");
                this.moduleLoader.loadModule("proposals/reproved", "fade-in-right");
            }, { once: true });
        });
    }

    convertToExcelListener() {
        this.convertToExcelButton.addEventListener("click", async () => {
            const path = await window.api.selecionarDiretorio();
            if (!path) {
                return;
            }
            try {
                const response = await fetch(`http://127.0.0.1:8000/proposals/convert_to_excel/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ path: path })
                });
                const responseJson = await response.json();
                if (responseJson.success == true) {
                    const notification = new Notification(true, "Exportado para Excel.");
                    notification.popUp();
                } else {
                    const notification = new Notification(false, `Erro ao exportar como Excel: ${responseJson.message}.`);
                    notification.popUp();
                }
            } catch (error) {
                const notification = new Notification(false, `Erro ao exportar como Excel: ${error}.`);
                notification.popUp();
            }
        });
    }

}