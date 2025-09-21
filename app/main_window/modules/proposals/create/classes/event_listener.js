import { BrlConverter } from './brl_converter.js';
import { ProposalCreator } from './proposal_creator.js';
import { ModuleLoader } from '../../../../classes/module_loader.js'
import { TablePopulator } from '../../classes/table_populator.js'
import { Reloader } from '../../classes/reloader.js'
import { Notification } from '../../../../classes/notification.js';

export class EventListener {

    constructor(balanceReloader) {
        this.brlConverter = new BrlConverter();
        this.proposalCreator = new ProposalCreator();
        this.moduleLoader = new ModuleLoader();
        this.tablePopulator = new TablePopulator();
        this.tableReloader = new Reloader();
        this.balanceReloader = balanceReloader;
        this.valorUnitarioInput = document.getElementById("valor_unitario");
        this.valorTotalInput = document.getElementById("valor_total");
        this.quantidadeInput = document.getElementById("quantidade");
        this.verbaConcedidaInput = document.getElementById("verba_concedida");
        this.verbaConcedidaPorcentagemInput = document.getElementById("verba_concedida_porcentagem");
        this.sendProposalButton = document.getElementById("send_proposal");
        this.returnButton = document.getElementById("return_button");
        this.openModalButton = document.getElementById("open_modal_button");
        this.closeModalButton = document.getElementById("close_modal_button");
        this.convertToExcelButton = document.getElementById("convert_to_excel");
    }

    _updateCustoTotalInput() {
        const custoPrecificado = this.brlConverter.brlToFloat(this.valorUnitarioInput.value);
        const quantidade =  this.quantidadeInput.value;
        if (custoPrecificado == 0.0 || quantidade == "") {
            this.valorTotalInput.value = "R$ 0,00";
            return;
        }
        const custoTotal = custoPrecificado * quantidade;
        const custoTotalBrl = this.brlConverter.floatToBrl(custoTotal);
        this.valorTotalInput.value = custoTotalBrl;
    }

    _updateVerbaConcedidaPorcentagem() {
        const verbaConcedida = this.brlConverter.brlToFloat(this.verbaConcedidaInput.value);
        const custoTotal = this.brlConverter.brlToFloat(this.valorTotalInput.value);
        if (verbaConcedida == 0.0 || custoTotal == 0.0) {
            this.verbaConcedidaPorcentagemInput.value = "0%";
        } else {
            const verbaConcedidaPorcentagem = (verbaConcedida / custoTotal) * 100;
            this.verbaConcedidaPorcentagemInput.value = `${verbaConcedidaPorcentagem.toFixed(2)}%`;
        }
    }

    _updateInputValueToBrl(inputId) {
        const input = document.getElementById(inputId);
        if (input.value == "" || input.value == "R$" || input.value == "R$ ") {
            input.value = "R$ 0,00";
        } else {
            const sanitizedValue = this.brlConverter.strToSanitizedFloat(input.value);
            const centsValue = sanitizedValue / 100;
            const brlValue = this.brlConverter.floatToBrl(centsValue);
            input.value = brlValue;
            requestAnimationFrame(() => {
                const inputLength = input.value.length;
                input.setSelectionRange(inputLength, inputLength);
            });
        }
    }

    valorUnitarioListener() {
        this.valorUnitarioInput.addEventListener("input", () => {
            this._updateInputValueToBrl("valor_unitario");
            this._updateCustoTotalInput();
            this._updateVerbaConcedidaPorcentagem();
        });
        this.valorUnitarioInput.addEventListener("click", () => {
            requestAnimationFrame(() => {
                const inputLength = this.valorUnitarioInput.value.length;
                this.valorUnitarioInput.setSelectionRange(inputLength, inputLength);
            });
        });
    }

    quantidadeListener() {
        this.quantidadeInput.addEventListener("input", () => {
            this._updateCustoTotalInput();
            this._updateVerbaConcedidaPorcentagem();
        });
    }

    verbaConcedidaListener() {
        this.verbaConcedidaInput.addEventListener("input", () => {
            this._updateInputValueToBrl("verba_concedida");
            this._updateVerbaConcedidaPorcentagem();
        });
        this.verbaConcedidaInput.addEventListener("click", () => {
            requestAnimationFrame(() => {
                const inputLength = this.verbaConcedidaInput.value.length;
                this.verbaConcedidaInput.setSelectionRange(inputLength, inputLength);
            });
        });
    }

    sendProposalListener() {
        this.sendProposalButton.addEventListener("click", () => {
            this.proposalCreator.createProposal();
        });
    }

    returnButtonListener() {
        this.returnButton.addEventListener("click", () => {
            this.balanceReloader.stopReloadBalanceLoop();
            document.getElementById("active_module").classList.add("fade-out-right");
            document.getElementById("active_module").addEventListener("animationend", () => {
                document.getElementById("active_module").classList.remove("fade-out-right");
                this.moduleLoader.loadModule("login", "fade-in-left");
            }, { once: true });
        });
    }

    openModalButtonListener() {
        this.openModalButton.addEventListener("click", () => {
            const fieldsToShow = [
                "id",
                "data",
                "assistente",
                "revendedor_cliente",
                "certame_negocio",
                "modelo",
                "processador",
                "quantidade",
                "valor_unitario",
                "valor_total",
                "verba_concedida",
                "verba_concedida_porcentagem",
                "status",
                "aprovador_reprovador",
                "data_hora_aprovacao_recusa",
                "forma_abatimento",
                "data_abatimento"
            ]
            this.tablePopulator.populateTable("All", fieldsToShow, null);
            this.tableReloader.reloadTableLoop("All", fieldsToShow, null);
            document.getElementById("modal").classList.remove("opacity-fade-out");
            document.getElementById("modal").classList.add("opacity-fade-in");
            document.getElementById("modal_container").classList.remove("fade-out-bot");
            document.getElementById("modal_container").classList.add("fade-in-bot");
            document.getElementById("modal").classList.remove("hidden");
            document.getElementById("modal").classList.add("flex");
        });
    }

    closeModalButtonListener() {
        this.closeModalButton.addEventListener("click", () => {
            this.tableReloader.stopReloadTableLoop();
            document.getElementById("modal_container").classList.remove("fade-in-bot");
            document.getElementById("modal_container").classList.add("fade-out-bot");
            document.getElementById("modal").classList.remove("opacity-fade-in");
            document.getElementById("modal").classList.add("opacity-fade-out");
            document.getElementById("modal").addEventListener("animationend", () => {
                document.getElementById("modal").classList.remove("flex");
                document.getElementById("modal").classList.add("hidden");
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






