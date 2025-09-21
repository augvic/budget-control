import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..' '..')))

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .classes.login_database import LoginDatabase
from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.utils.decorators import method_decorator
import json

login_database = LoginDatabase()

@method_decorator(csrf_exempt, name="dispatch")
class Login(View):

    def post(self, request) -> JsonResponse:
        try:
            data = json.loads(request.body)
            registration = data.get('registration')
            password = data.get('password')
            account = login_database.get_account(registration)
            if account:
                if account.password == password:
                    return JsonResponse({'success': True, 'message': "Logado com sucesso.", "name": account.name, "module": account.module})
                else:
                    return JsonResponse({'success': False, 'message': "Login inválido."})
            else:
                return JsonResponse({'success': False, 'message': "Login inválido."})
        except:
            return JsonResponse({'success': False, 'message': "Erro ao processar login."})