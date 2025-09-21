export class BalanceUpdater {

    async _getCurrentBalance() {
        try {
            const response = await fetch('http://127.0.0.1:8000/balance/', {
                method: "GET"
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, current_balance: "" }
        }
    }

    async subtractBalanceAndUpdateDb(subtractValue) {
        const response = await this._getCurrentBalance();
        let currentBalance = response.current_balance.replace("R$", "");
        currentBalance = currentBalance.replace(".", "");
        currentBalance = currentBalance.replace(".", "");
        currentBalance = currentBalance.replace(".", "");
        currentBalance = currentBalance.replace(".", "");
        currentBalance = currentBalance.replace(",", ".");
        currentBalance = currentBalance.trim();
        currentBalance = parseFloat(currentBalance);
        const newBalance = String((currentBalance - subtractValue).toFixed(2));
        try {
            const response = await fetch('http://127.0.0.1:8000/balance/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ new_balance: newBalance })
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, message: `Erro ao atualizar saldo atual: ${error}`}
        }
    }

    async updateCurrentBalance() {
        const response = await this._getCurrentBalance();
        if (response.success == true) {
            const actualBalance = document.getElementById("current_balance").innerText;
            if (actualBalance != response.current_balance) {
                document.getElementById("current_balance").innerText = response.current_balance;
            }
        } else {
            const notification = new Notification(false, "Erro ao carregar saldo atual.");
            notification.popUp();
        }
        
    }

}