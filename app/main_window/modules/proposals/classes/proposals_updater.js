export class ProposalsUpdater {

    async updateProposal(id, status, aprovador, dataHora, nf, dataFaturamento, porcentagem) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/proposals/update/${id}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: status, aprovador_reprovador: aprovador, data_hora_aprovacao_recusa: dataHora, forma_abatimento: nf, data_abatimento: dataFaturamento, verba_concedida_porcentagem: porcentagem })
            });
            const responseJson = await response.json();
            return responseJson;
        } catch (error) {
            return { success: false, message: `Erro ao atualizar proposta: ${error}.`}
        }
    }

}