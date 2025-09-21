import { LoginHandler } from './login_handler.js';

export class EventListeners {

    constructor() {
        this.loginButton = document.getElementById("login_button");
        this.loginHandler = new LoginHandler();
    }

    _loginButton() {
        this.loginButton.addEventListener("click", () => {
            this.loginHandler.login_check();
        });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                document.getElementById("login_button").click();
            }
        });
    }

    start() {
        this._loginButton();
    }

}