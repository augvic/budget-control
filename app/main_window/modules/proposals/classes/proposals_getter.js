export class ProposalsGetter {

    async getProposals(status) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/proposals/get/${status}/`, {
                method: "GET",
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, proposals: "" }
        }
    }

}