import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..' '..', '..')))

import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from login.models import *

class LoginDatabase:

    def get_account(self, registration: str) -> Accounts:
        return Accounts.objects.filter(registration=registration).first()
