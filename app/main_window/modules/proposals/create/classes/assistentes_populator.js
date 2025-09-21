export class AssistentesPopulator {

    async _getAssistentes() {
        try {
            const response = await fetch('http://127.0.0.1:8000/assistentes/', {
                method: "GET",
            });
            const responseJson = await response.json();
            return responseJson.assistentes;
        } catch (error) {
            console.log(error);
        }
    }

    async populateAssistentes() {
        const assistentes = await this._getAssistentes();
        const assistentesDatalist = document.getElementById("assistentes");
        assistentes.forEach(assistente => {
            const assistenteForDatalist = `<option value="${assistente}"></option>`;
            assistentesDatalist.innerHTML += assistenteForDatalist; 
        });
    }

}