import { ProposalsUpdater } from "./proposals_updater.js";
import { Notification } from "../../../classes/notification.js"
import { BalanceUpdater } from "./balance_updater.js";
import { ProposalsNfGetter } from "./proposals_nf_getter.js";

export class ButtonModalCreator {

    constructor() {
        this.proposalsUpdater = new ProposalsUpdater();
        this.balanceUpdater = new BalanceUpdater();
        this.proposalsNfGetter = new ProposalsNfGetter();
    }

    _openModal() {
        document.getElementById("modal").classList.add("opacity-fade-in");
        document.getElementById("modal_container").classList.add("fade-in-bot");
        document.getElementById("modal").classList.remove("hidden");
        document.getElementById("modal").classList.add("flex");
        document.getElementById("modal").addEventListener("animationend", () => {
            document.getElementById("modal").classList.remove("opacity-fade-in");
            document.getElementById("modal_container").classList.remove("fade-in-bot");
        }, { once: true });
    }

    _closeModal() {
        document.getElementById("modal_container").classList.add("fade-out-bot");
        document.getElementById("modal").classList.add("opacity-fade-out");
        document.getElementById("modal").addEventListener("animationend", () => {
            document.getElementById("modal").classList.remove("flex");
            document.getElementById("modal").classList.add("hidden");
            document.getElementById("modal_container").classList.remove("fade-out-bot");
            document.getElementById("modal").classList.remove("opacity-fade-out");
        }, { once: true });
    }

    async _createModalContent(action, proposalData) {
        const container = document.createElement("div");
        container.className = "flex flex-col items-center justify-center cursor-default";
        const confirmPhrase = document.createElement("p");
        confirmPhrase.className = "text-center";
        container.appendChild(confirmPhrase);
        const buttonsContainer = document.createElement("div");
        buttonsContainer.className = "flex gap-x-3 justify-center items-center";
        const yesButton = document.createElement("button");
        yesButton.className = "text-white bg-green-400 p-2 rounded-md cursor-pointer hover:bg-green-700 transition-colors duration-300";
        yesButton.innerText = "Sim";
        buttonsContainer.appendChild(yesButton);
        const noButton = document.createElement("button");
        noButton.className = "text-white bg-red-400 p-2 rounded-md cursor-pointer hover:bg-red-700 transition-colors duration-300";
        noButton.innerText = "Não";
        buttonsContainer.appendChild(noButton);
        const phraseWithProposalContent = `Assistente: ${proposalData["assistente"]}
                Revendedor: ${proposalData["revendedor_cliente"]}
                Certame/Negócio: ${proposalData["certame_negocio"]}
                Produto: ${proposalData["produto"]}
                Processador: ${proposalData["processador"]}
                Quantidade: ${proposalData["quantidade"]}
                Valor Unitário: ${proposalData["valor_unitario"]}
                Valor Total: ${proposalData["valor_total"]}
                Verba Concedida: ${proposalData["verba_concedida"]}
                Porcentagem de Verba Concedida: ${proposalData["verba_concedida_porcentagem"]}\n\n`;
        if (action == "Aprovar") {
            confirmPhrase.innerText = `Confirma a APROVAÇÃO para a proposta de ID ${proposalData["id"]}?\n\n${phraseWithProposalContent}`;
        }
        if (action == "Reprovar") {
            confirmPhrase.innerText = `Confirma a REPROVAÇÃO para a proposta de ID ${proposalData["id"]}?\n\n${phraseWithProposalContent}`;
        }
        if (action == "Incluir NF") {
            const nfDateUpdated = await this.proposalsNfGetter.getNfDate(proposalData["id"]);
            confirmPhrase.innerText = `Incluir NF para a proposta de ID ${proposalData["id"]}?\n\n${phraseWithProposalContent}`;
            const nfInputsContainer = document.createElement("div");
            nfInputsContainer.className = "flex gap-x-3";
            const nfInput = document.createElement("input");
            nfInput.type = "text";
            nfInput.placeholder = "Forma de Abatimento";
            nfInput.className = "h-[40px] w-[300px] outline-none p-2 bg-white";
            nfInput.id = "nf";
            if (nfDateUpdated.forma_abatimento == "-") {
                nfInput.value = "";
            } else {
                nfInput.value = nfDateUpdated.forma_abatimento;
            }
            const nfDateInput = document.createElement("input");
            nfDateInput.type = "text";
            nfDateInput.placeholder = "Data do Abatimento";
            nfDateInput.className = "h-[40px] w-[300px] outline-none p-2 bg-white";
            nfDateInput.id = "nf_date";
            if (nfDateUpdated.data_abatimento == "-") {
                nfDateInput.value = "";
            } else {
                nfDateInput.value = nfDateUpdated.data_abatimento;
            }
            nfInputsContainer.appendChild(nfInput);
            nfInputsContainer.appendChild(nfDateInput);
            container.appendChild(nfInputsContainer);
            container.appendChild(document.createElement("br"));
        }
        container.appendChild(buttonsContainer);
        return [container, yesButton, noButton];
    }

    _setModalListener(yesButton, noButton, actionOnYes, proposalData) {
        noButton.addEventListener("click", () => {
            this._closeModal();
        });
        yesButton.addEventListener("click", async () => {
            if (actionOnYes == "Aprovar") {
                const now = new Date();
                const nowString = now.toLocaleString();
                const percentage = parseFloat(String(proposalData["verba_concedida_porcentagem"]).replace("%", ""));
                let response;
                let status;
                if (percentage <= 6.0 || sessionStorage.getItem("module") == "proposals/analysis_second") {
                    response = await this.proposalsUpdater.updateProposal(proposalData["id"], "Aprovado", sessionStorage.getItem("user"), nowString, "-", "-", proposalData["verba_concedida_porcentagem"]);
                    status = "Aprovado";
                } else {
                    response = await this.proposalsUpdater.updateProposal(proposalData["id"], "Aguardando Segunda Aprovação", sessionStorage.getItem("user"), nowString, "-", "-", proposalData["verba_concedida_porcentagem"]);
                    status = "Aguardando Segunda Aprovação";
                }
                if (response.success == true) {
                    if (status == "Aprovado") {
                        const notification = new Notification(true, "Proposta aprovada.");
                        notification.popUp();
                        const subtractValue = parseFloat(String(proposalData["verba_concedida"]).replace("R$", "").replace(".", "").replace(",", ".").trim());
                        const response = await this.balanceUpdater.subtractBalanceAndUpdateDb(subtractValue);
                        if (response.sucess == false) {
                            const notification = new Notification(false, response.message);
                            notification.popUp();
                        }
                    } else {
                        const notification = new Notification(true, "Proposta encaminhada para segunda aprovação.");
                        notification.popUp();
                    }
                    this._closeModal();
                } else {
                    const notification = new Notification(false, response.message)
                    notification.popUp();
                }
            }
            if (actionOnYes == "Reprovar") {
                const now = new Date();
                const nowString = now.toLocaleString();
                const response = await this.proposalsUpdater.updateProposal(proposalData["id"], "Reprovado", sessionStorage.getItem("user"), nowString, "-", "-", proposalData["verba_concedida_porcentagem"]);
                if (response.success == true) {
                    const notification = new Notification(true, "Proposta reprovada.");
                    notification.popUp();
                    this._closeModal();
                } else {
                    const notification = new Notification(false, response.message);
                    notification.popUp();
                }
            }
            if (actionOnYes == "Incluir NF") {
                const nf = document.getElementById("nf").value;
                const nfDate = document.getElementById("nf_date").value;
                if (nf == "" || nfDate == "") {
                    const notification = new Notification(false, "Preencher todos os campos.");
                    notification.popUp();
                } else {
                    const response = await this.proposalsUpdater.updateProposal(proposalData["id"],"-", "-", "-", nf, nfDate, "-");
                    if (response.success == true) {
                        const notification = new Notification(true, "Abatimento Incluído.");
                        notification.popUp();
                        this._closeModal();
                    } else {
                        const notification = new Notification(true, response.message);
                        notification.popUp();
                    }
                }
            }
        });
    }

    _setButtonListener(button, proposalData, action) {
        button.addEventListener("click", async () => {
            const [container, yesButton, noButton] = await this._createModalContent(action, proposalData);
            document.getElementById("modal_container").innerHTML = "";
            document.getElementById("modal_container").appendChild(container);
            this._openModal();
            this._setModalListener(yesButton, noButton, action, proposalData);
        });
    }

    createButtonWithModal(buttonType, proposalData) {
        const button = document.createElement("input");
        button.type = "button";
        if (buttonType == "approve") {
            button.className = "h-auto text-center rounded-md w-[100px] p-1 text-white bg-green-400 hover:bg-green-700 cursor-pointer transition-colors duration-300";
            button.value = "Aprovar";
            this._setButtonListener(button, proposalData, "Aprovar");
        }
        if (buttonType == "reprove") {
            button.className = "h-auto text-center rounded-md w-[100px] p-1 text-white bg-red-400 hover:bg-red-700 cursor-pointer transition-colors duration-300";
            button.type = "button";
            button.value = "Reprovar";
            this._setButtonListener(button, proposalData, "Reprovar");
        }
        if (buttonType == "nf_include") {
            button.className = "h-auto text-center rounded-md w-[100px] p-1 text-white bg-blue-400 hover:bg-blue-700 cursor-pointer transition-colors duration-300";
            button.type = "button";
            button.value = "Incluir";
            this._setButtonListener(button, proposalData, "Incluir NF");
        }
        return button;
    }

}