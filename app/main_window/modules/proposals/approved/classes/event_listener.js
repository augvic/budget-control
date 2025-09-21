import { ModuleLoader } from '../../../../classes/module_loader.js'

export class EventListener {

    constructor(reloader) {
        this.moduleLoader = new ModuleLoader();
        this.returnButton = document.getElementById("return_button");
        this.reloader = reloader;
    }

    returnButtonListener() {
        this.returnButton.addEventListener("click", () => {
            this.reloader.stopReloadTableLoop();
            this.reloader.stopReloadBalanceLoop();
            document.getElementById("active_module").classList.add("fade-out-right");
            document.getElementById("active_module").addEventListener("animationend", () => {
                document.getElementById("active_module").classList.remove("fade-out-right");
                if (sessionStorage.getItem("module") == "proposals/analysis_second") {
                    this.moduleLoader.loadModule("proposals/analysis_second", "fade-in-left");
                } else {
                    this.moduleLoader.loadModule("proposals/analysis", "fade-in-left");
                }
            }, { once: true });
        });
    }

}