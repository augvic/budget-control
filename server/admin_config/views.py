from django.views.decorators.csrf import csrf_exempt
from django.views import View
from django.utils.decorators import method_decorator
import os

@method_decorator(csrf_exempt, name="dispatch")
class Shutdown(View):

    def post(self, request):
        os._exit(0)