import { ModuleLoader } from "./classes/module_loader.js";
import { EventListeners } from "./classes/event_listeners.js";
import { ServerStatus } from "./classes/server_status.js";

const eventListeners = new EventListeners();
eventListeners.start();

const serverStatus = new ServerStatus();
while (true) {
    const response = await serverStatus.verifyStatus();
    if (response.status == "OK") {
        document.getElementById("loading_screen").classList.remove("fade-in-bot");
        document.getElementById("loading_screen").classList.add("fade-out-bot");
        document.getElementById("loading_screen").addEventListener("animationend", () => {
            document.getElementById("loading_screen").classList.remove("flex");
            document.getElementById("loading_screen").classList.add("hidden");
        }, { once: true });
        break
    }
}

const moduleLoader = new ModuleLoader();
moduleLoader.loadModule("login", "fade-in-left");