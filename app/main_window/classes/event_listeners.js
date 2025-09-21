export class EventListeners {

    constructor() {
        this.minimizeButton = document.getElementById("minimize");
        this.maximizeButton = document.getElementById("maximize");
        this.closeButton = document.getElementById("close");
    }

    _minMaxClo() {
        window.addEventListener("DOMContentLoaded", () => {

            this.minimizeButton.addEventListener("click", () => {
                window.api.minimizar();
            });
        
            this.maximizeButton.addEventListener("click", () => {
                window.api.maximizar();
            });

            this.closeButton.addEventListener("click", () => {
                window.api.fechar();
            });

        });
    }

    start() {
        this._minMaxClo();
    }

}