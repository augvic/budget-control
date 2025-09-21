import { Notification } from "../../../../classes/notification.js";
import { BalanceUpdater } from "../../classes/balance_updater.js";

export class ProposalCreator {

    constructor() {
        this.balanceUpdater = new BalanceUpdater();
    }

    _getFormData() {
        return {
            solicitante: sessionStorage.getItem("user"),
            data: document.getElementById("data").value,
            assistente: document.getElementById("assistente").value,
            revendedor_cliente: document.getElementById("revendedor_cliente").value,
            certame_negocio: document.getElementById("certame_negocio").value,
            modelo: document.getElementById("produto").value,
            processador: document.getElementById("processador").value,
            quantidade: document.getElementById("quantidade").value,
            valor_unitario: document.getElementById("valor_unitario").value,
            valor_total: document.getElementById("valor_total").value,
            verba_concedida: document.getElementById("verba_concedida").value,
            verba_concedida_porcentagem: document.getElementById("verba_concedida_porcentagem").value
        }
    }

    _verifyFields(formData) {
        return Object.values(formData).some(field => field === "");
    }

    async _postToServer() {
        try {
            const formData = this._getFormData();
            const formDataIsNotOk = this._verifyFields(formData);
            if (formDataIsNotOk == true) {
                return { success: false, message: "Preencha todos os campos."}
            }
            const response = await fetch('http://127.0.0.1:8000/proposals/create/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, message: `Erro ao enviar proposta: ${error}.`}
        }
    }

    async createProposal() {
        const response = await this._postToServer();
        if (response.success == true) {
            const notification = new Notification(true, response.message);
            notification.popUp();
            const proposalData = this._getFormData();
            const percentage = parseFloat(String(proposalData["verba_concedida_porcentagem"]).replace("%", ""));
            if (percentage <= 3.0) {
                const subtractValue = parseFloat(String(proposalData["verba_concedida"]).replace("R$", "").replace(".", "").replace(",", ".").trim());
                const response = await this.balanceUpdater.subtractBalanceAndUpdateDb(subtractValue);
                if (response.sucess == false) {
                    const notification = new Notification(false, response.message);
                    notification.popUp();
                }
            }
        } else {
            const notification = new Notification(false, response.message);
            notification.popUp();
        }
    }

}