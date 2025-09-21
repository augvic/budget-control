import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..' '..')))

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .classes.proposals_database import ProposalsDatabase
from .classes.sqlite3ToSheet import Sqlite3ToSheet
from django.views.decorators.csrf import csrf_exempt
from babel.numbers import format_currency
from django.views import View
from django.utils.decorators import method_decorator
import json
import re
from datetime import datetime

proposals_database = ProposalsDatabase()
sqlite_converter = Sqlite3ToSheet()

@method_decorator(csrf_exempt, name="dispatch")
class Balance(View):

    def get(self, request) -> JsonResponse:
        current_balance = float(proposals_database.get_current_balance())
        current_balance_brl = format_currency(current_balance, 'BRL', locale='pt_BR')
        return JsonResponse({"success": True, "current_balance": current_balance_brl})

    def post(self, request) -> JsonResponse:
        try:
            data = json.loads(request.body)
            proposals_database.update_current_balance(data["new_balance"])
            return JsonResponse({"success": True, "message": "Saldo atualizado."})
        except Exception as error:
            return JsonResponse({"success": False, "message": f"Erro ao atualizar saldo atual: {error}."})

@method_decorator(csrf_exempt, name="dispatch")
class Assistentes(View):

    def get(self, request) -> JsonResponse:
        assistentes = proposals_database.get_assistentes()
        return JsonResponse({"assistentes": assistentes})
    
@method_decorator(csrf_exempt, name="dispatch")
class Modelos(View):

    def get(self, request) -> JsonResponse:
        modelos = proposals_database.get_modelos()
        return JsonResponse({"modelos": modelos})
    
@method_decorator(csrf_exempt, name="dispatch")
class Processadores(View):

    def get(self, request) -> JsonResponse:
        processadores = proposals_database.get_processadores()
        return JsonResponse({"processadores": processadores})

@method_decorator(csrf_exempt, name="dispatch")
class ProposalsCreator(View):

    def _sanitize_data(self, data: dict) -> dict:
        data["data"] = datetime.strptime(data["data"], "%Y-%m-%d").strftime("%d/%m/%Y")
        data["status"] = "Em Análise"
        data["aprovador_reprovador"] = "-"
        data["data_hora_aprovacao_recusa"] = "-"
        data["forma_abatimento"] = "-"
        data["data_abatimento"] = "-"
        data["valor_unitario"] = re.sub(r"[^\d,\.]", "", data["valor_unitario"]).replace(".", "").replace(",", ".")
        data["valor_total"] = re.sub(r"[^\d,\.]", "", data["valor_total"]).replace(".", "").replace(",", ".")
        data["verba_concedida"] = re.sub(r"[^\d,\.]", "", data["verba_concedida"]).replace(".", "").replace(",", ".")
        return data

    def _verify_percentage(self, data) -> dict:
        percentage = float(str(data["verba_concedida_porcentagem"]).replace("%", ""))
        if percentage <= 3.0:
            data["aprovador_reprovador"] = data["solicitante"]
            data["status"] = "Aprovado"
            data["data_hora_aprovacao_recusa"] = datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
        return data

    def post(self, request) -> JsonResponse:
        try:
            data = json.loads(request.body)
            data = self._sanitize_data(data)
            data = self._verify_percentage(data)
            proposals_database.create_proposal(data)
            if data["status"] == "Aprovado":
                return JsonResponse({"success": True, "message": "Proposta aprovada automaticamente."})
            else:
                return JsonResponse({"success": True, "message": "Proposta enviada para aprovação."})
        except Exception as error:
            return JsonResponse({"success": False, "message": f"Erro ao enviar proposta: {error}."})

@method_decorator(csrf_exempt, name="dispatch")
class ProposalsGetter(View):

    def get(self, request, status) -> JsonResponse:
        proposals = proposals_database.get_proposals(status)
        proposals_list = []
        for proposal in proposals:
            proposal_dict = {
                "id": proposal.id,
                "data": proposal.data,
                "assistente": proposal.assistente,
                "revendedor_cliente": proposal.revendedor_cliente,
                "certame_negocio": proposal.certame_negocio,
                "modelo": proposal.modelo,
                "processador": proposal.processador,
                "quantidade": proposal.quantidade,
                "valor_unitario": format_currency(proposal.valor_unitario, 'BRL', locale='pt_BR'),
                "valor_total": format_currency(proposal.valor_total, 'BRL', locale='pt_BR'),
                "verba_concedida": format_currency(proposal.verba_concedida, 'BRL', locale='pt_BR'),
                "verba_concedida_porcentagem": proposal.verba_concedida_porcentagem,
                "status": proposal.status,
                "aprovador_reprovador": proposal.aprovador_reprovador,
                "data_hora_aprovacao_recusa": proposal.data_hora_aprovacao_recusa,
                "forma_abatimento": proposal.forma_abatimento,
                "data_abatimento": proposal.data_abatimento
            }
            proposals_list.append(proposal_dict)
        return JsonResponse({"success": True, "proposals": proposals_list})
    
@method_decorator(csrf_exempt, name="dispatch")
class ProposalsUpdater(View):

    def post(self, request, id) -> JsonResponse:
        try:
            data = json.loads(request.body)
            proposals_database.update_proposal(id, data)
            return JsonResponse({"success": True, "message": "Proposta atualizada."})
        except Exception as error:
            return JsonResponse({"success": False, "message": f"Erro ao atualizar proposta: {error}."})
        
@method_decorator(csrf_exempt, name="dispatch")
class ProposalsConverter(View):

    def post(self, request) -> JsonResponse:
        try:
            data = json.loads(request.body)
            sqlite_converter.convert(data["path"])
            return JsonResponse({"success": True, "message": "Exportado para Excel."})
        except Exception as error:
            return JsonResponse({"success": False, "message": f"Erro ao exportar para Excel: {error}."})

@method_decorator(csrf_exempt, name="dispatch")
class ProposalsNfGetter(View):

    def get(self, request, id) -> JsonResponse:
        nf_date = proposals_database.get_proposals_nf(id)
        return JsonResponse({"forma_abatimento": nf_date["forma_abatimento"], "data_abatimento": nf_date["data_abatimento"]})
    
@method_decorator(csrf_exempt, name="dispatch")
class Server(View):

    def get(self, request) -> JsonResponse:
        return JsonResponse({"status": "OK"})