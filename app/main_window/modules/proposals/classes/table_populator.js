import { Notification } from '../../../classes/notification.js';
import { ProposalsGetter } from './proposals_getter.js'
import { ButtonModalCreator } from './button_modal_creator.js';

export class TablePopulator {

    constructor() {
        this.proposalsGetter = new ProposalsGetter();
        this.buttonModalCreator = new ButtonModalCreator();
    }

    _createCell(proposalData, field) {
        const cell = document.createElement("td");
        cell.className = "p-2 h-auto w-auto";
        cell.innerText = proposalData[field];
        return cell;
    }

    _createTableRow(proposalData, fields, buttonsTypes) {
        const row = document.createElement("tr");
        row.className = "h-auto w-auto bg-gray-200 border-b border-b-gray-500";
        fields.forEach(field => {
            const cell = this._createCell(proposalData, field);
            row.appendChild(cell);
        });
        if (buttonsTypes) {
            const cell = document.createElement("td");
            cell.className = "h-auto w-auto w-auto p-2";
            const buttonsContainer = document.createElement("div");
            buttonsContainer.className = "flex gap-x-2 justify-center items-center";
            buttonsTypes.forEach(buttonType => {
                const button = this.buttonModalCreator.createButtonWithModal(buttonType, proposalData);
                buttonsContainer.appendChild(button);
            });
            cell.appendChild(buttonsContainer);
            row.appendChild(cell);
        }
        return row;
    }

    _verifyIfRowExists(tableBody, proposal) {
        const actualRows = tableBody.querySelectorAll("tr");
        for (const actualRow of actualRows) {
            const actualRowId = parseInt(actualRow.querySelectorAll("td")[0].innerText);
            if (actualRowId == proposal["id"]) {
                return true;
            }
        }
        return false;
    }

    _getProposalsListIds(proposals) {
        const proposalsIds = []
        proposals.forEach(proposal => {
            proposalsIds.push(proposal["id"]);
        });
        return proposalsIds;
    }

    _clearUnusedRows(tableBody, proposals) {
        const actualRows = tableBody.querySelectorAll("tr");
        const proposalsIds = this._getProposalsListIds(proposals);
        actualRows.forEach(actualRow => {
            const actualRowId = parseInt(actualRow.querySelectorAll("td")[0].innerText);
            if (!proposalsIds.includes(actualRowId)) {
                actualRow.remove();
            }
        });
    }

    _updateNfRows(tableBody, proposal) {
        const actualRows = tableBody.querySelectorAll("tr");
        for (const actualRow of actualRows) {
            const actualRowId = parseInt(actualRow.querySelectorAll("td")[0].innerText);
            try {
                const actualRowNf = actualRow.querySelectorAll("td")[15].innerText;
                const actualRowNfDate = actualRow.querySelectorAll("td")[16].innerText;
                if (actualRowId == proposal["id"]) {
                    if (actualRowNf != proposal["forma_abatimento"] || actualRowNfDate != proposal["data_abatimento"]) {
                        actualRow.querySelectorAll("td")[15].innerText = proposal["forma_abatimento"];
                        actualRow.querySelectorAll("td")[16].innerText = proposal["data_abatimento"];
                    }
                }
            } catch {
                return;
            }
        }
    }

    async populateTable(proposalsStatus, fieldsToShow, buttonsTypes) {
        const tableBody = document.getElementById("proposals_table_body");
        const response = await this.proposalsGetter.getProposals(proposalsStatus);
        if (response.success == false) {
            const notification = new Notification(false, "Erro ao carregar propostas.");
            notification.popUp();
            return
        }
        response.proposals.forEach(proposal => {
            this._updateNfRows(tableBody, proposal);
            const rowExists = this._verifyIfRowExists(tableBody, proposal);
            if (!rowExists) {
                const row = this._createTableRow(proposal, fieldsToShow, buttonsTypes);
                tableBody.appendChild(row);
            }
        });
        this._clearUnusedRows(tableBody, response.proposals);
    }

}