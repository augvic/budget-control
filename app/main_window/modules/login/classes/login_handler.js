import { Notification } from '../../../classes/notification.js';
import { ModuleLoader } from '../../../classes/module_loader.js'

export class LoginHandler {

    constructor(){
        this.moduleLoader = new ModuleLoader();
    }

    _getLoginData() {
        const registration = document.getElementById("user").value;
        const password = document.getElementById("password").value;
        return { registration, password };
    }

    async _sendLoginDataToServer() {
        const { registration, password } = this._getLoginData();
        if (registration == "" || password == "") {
            return "";
        }
        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ registration, password }),
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, message: `Erro ao processar login: ${error}` };
        }
    }

    async login_check() {
        const response = await this._sendLoginDataToServer();
        if (response == "") {
            const notification = new Notification(false, "Preencha os campos.");
            notification.popUp();
            return;
        }
        if (response.success == true) {
            sessionStorage.setItem("user", response.name);
            sessionStorage.setItem("module", response.module);
            const notification = new Notification(true, response.message);
            notification.popUp();
            document.getElementById("active_module").classList.add("fade-out-left");
            document.getElementById("active_module").addEventListener("animationend", () => {
                document.getElementById("active_module").classList.remove("fade-out-left");
                this.moduleLoader.loadModule(response.module, "fade-in-right");
            }, { once: true });
        } else {
            const notification = new Notification(false, response.message);
            notification.popUp();
        }
    }

}