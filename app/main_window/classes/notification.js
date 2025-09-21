export class Notification {

    constructor(success, message) {
        this.container = this._createContainer();
        if (success == true) {
            this.container.classList.add("bg-green-400");
        } else {
            this.container.classList.add("bg-red-400");
        }
        this.container.innerText = message;
    }

    _createContainer() {
        const container = document.createElement("div");
        container.id = "notification";
        container.className = "fixed z-50 bottom-4 right-5 py-3 px-6 text-white rounded-md cursor-default fade-in-right";
        return container
    }

    popUp() {
        document.body.appendChild(this.container);
        setTimeout(() => {
            this.container.classList.remove("fade-in-right");
            this.container.classList.add("fade-out-right");
            this.container.addEventListener("animationend", () => {
                this.container.remove()
            }, { once: true })
        }, 3000);
    }

}