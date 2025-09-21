import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..' '..', '..')))

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from proposals.models import *

class ProposalsDatabase:

    def get_current_balance(self) -> str:
        return str(CurrentBalance.objects.first())
    
    def update_current_balance(self, new_balance: str) -> None:
        balance = CurrentBalance.objects.get(pk=1)
        balance.current_balance = new_balance
        balance.save()
    
    def get_assistentes(self) -> list[str]:
        return list(Assistentes.objects.values_list("nome", flat=True))
    
    def get_modelos(self) -> list[str]:
        return list(Modelos.objects.values_list("nome", flat=True))
    
    def get_processadores(self) -> list[str]:
        return list(Processadores.objects.values_list("nome", flat=True))
    
    def create_proposal(self, proposal_data: dict) -> None:
        new_proposal = Proposals(
            data=proposal_data["data"],
            assistente=proposal_data["assistente"],
            revendedor_cliente=proposal_data["revendedor_cliente"],
            certame_negocio=proposal_data["certame_negocio"],
            modelo=proposal_data["modelo"],
            processador=proposal_data["processador"],
            quantidade=proposal_data["quantidade"],
            valor_unitario=proposal_data["valor_unitario"],
            valor_total=proposal_data["valor_total"],
            verba_concedida=proposal_data["verba_concedida"],
            verba_concedida_porcentagem=proposal_data["verba_concedida_porcentagem"],
            status=proposal_data["status"],
            aprovador_reprovador=proposal_data["aprovador_reprovador"],
            data_hora_aprovacao_recusa=proposal_data["data_hora_aprovacao_recusa"],
            forma_abatimento=proposal_data["forma_abatimento"],
            data_abatimento=proposal_data["data_abatimento"]
        )
        new_proposal.save()
    
    def get_proposals(self, status: str):
        if status == "All":
            return Proposals.objects.all()
        else:
            return Proposals.objects.filter(status=status)
        
    def update_proposal(self, id: int, proposal_data: dict) -> None:
        proposal = Proposals.objects.get(pk=id)
        if proposal_data["status"] != "-":
            proposal.status = proposal_data["status"]
        if proposal_data["aprovador_reprovador"] != "-":
            if proposal.aprovador_reprovador != proposal_data["aprovador_reprovador"]:
                if proposal.aprovador_reprovador == "-" or proposal_data["status"] == "Reprovado":
                    proposal.aprovador_reprovador = proposal_data["aprovador_reprovador"]
                else:
                    proposal.aprovador_reprovador += f" - {proposal_data["aprovador_reprovador"]}"
            else:
                proposal.aprovador_reprovador = proposal_data["aprovador_reprovador"]
        if proposal_data["data_hora_aprovacao_recusa"] != "-":
            if proposal.data_hora_aprovacao_recusa != proposal_data["data_hora_aprovacao_recusa"]:
                if proposal.data_hora_aprovacao_recusa == "-" or proposal_data["status"] == "Reprovado":
                    proposal.data_hora_aprovacao_recusa = proposal_data["data_hora_aprovacao_recusa"]
                else:
                    proposal.data_hora_aprovacao_recusa += f" - {proposal_data["data_hora_aprovacao_recusa"]}"
        if proposal_data["forma_abatimento"] != "-":
            proposal.forma_abatimento = proposal_data["forma_abatimento"]
        if proposal_data["data_abatimento"] != "-":
            proposal.data_abatimento = proposal_data["data_abatimento"]
        proposal.save()

    def get_proposals_nf(self, id: int) -> dict:
        proposal = Proposals.objects.get(pk=id)
        proposal_nf_date = {
            "forma_abatimento": proposal.forma_abatimento,
            "data_abatimento": proposal.data_abatimento
        }
        return proposal_nf_date