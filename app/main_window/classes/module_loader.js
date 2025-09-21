export class ModuleLoader {

    constructor() {
        this.activeModule = document.getElementById("active_module");
        const mainHtmlPath = document.location.href;
        this.modulesPath = mainHtmlPath.replace("main.html", "modules");
    }

    _cleanActiveModule() {
        this.activeModule.innerHTML = "";
        const activeScript = document.getElementById("active_module_script");
        activeScript.remove()
    }

    _insertNewModule(module, animationType) {
        const mainHtml = `${this.modulesPath}/${module}/main.html`;
        const mainScript = `${this.modulesPath}/${module}/main.js`;
        fetch(mainHtml)
            .then((res) => res.text())
            .then((html) => {
                this.activeModule.innerHTML = html;
                requestAnimationFrame(() => {
                    this.activeModule.classList.add(animationType);
                });
                this.activeModule.addEventListener("animationend", () => {
                    this.activeModule.classList.remove(animationType);
                }, { once: true });
                const moduleScript = document.createElement("script");
                moduleScript.src = `${mainScript}?v=${Date.now()}`;
                moduleScript.id = "active_module_script";
                moduleScript.type = "module";
                document.body.appendChild(moduleScript);
            })
            .catch((err) => {
                console.error("Erro ao carregar módulo:", err);
            });
    }

    loadModule(module, animationType) {
        this._cleanActiveModule();
        this._insertNewModule(module, animationType);
    }

}