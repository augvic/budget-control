export class ServerStatus {

    async verifyStatus() {
        try {
            const response = await fetch(`http://127.0.0.1:8000/server/`, {
                method: "GET",
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { status: "ERROR" }
        }
}

}