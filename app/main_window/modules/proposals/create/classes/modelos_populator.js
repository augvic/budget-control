export class ModelosPopulator {

    async _getModelos() {
        try {
            const response = await fetch('http://127.0.0.1:8000/modelos/', {
                method: "GET",
            });
            const responseJson = await response.json();
            return responseJson.modelos;
        } catch (error) {
            console.log(error);
        }
    }

    async populateModelos() {
        const modelos = await this._getModelos();
        const modelosDatalist = document.getElementById("modelos");
        modelos.forEach(modelo => {
            const modeloForDatalist = `<option value="${modelo}"></option>`;
            modelosDatalist.innerHTML += modeloForDatalist; 
        });
    }

}