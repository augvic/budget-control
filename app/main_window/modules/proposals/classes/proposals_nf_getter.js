export class ProposalsNfGetter {

    async getNfDate(id) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/proposals/get_nf/${id}/`, {
                method: "GET",
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, proposals: ""}
        }
    }

}