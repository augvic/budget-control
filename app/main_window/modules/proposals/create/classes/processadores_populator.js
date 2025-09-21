export class ProcessadoresPopulator {

    async _getProcessadores() {
        try {
            const response = await fetch('http://127.0.0.1:8000/processadores/', {
                method: "GET",
            });
            const responseJson = await response.json();
            return responseJson.processadores;
        } catch (error) {
            console.log(error);
        }
    }

    async populateProcessadores() {
        const processadores = await this._getProcessadores();
        const processadoresDatalist = document.getElementById("processadores");
        processadores.forEach(processador => {
            const processadorForDatalist = `<option value="${processador}"></option>`;
            processadoresDatalist.innerHTML += processadorForDatalist; 
        });
    }

}