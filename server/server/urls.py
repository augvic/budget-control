import os
import sys
this_script_path = os.path.dirname(__file__)
root_path = os.path.join(this_script_path, '..')
full_root_path = os.path.abspath(root_path)
sys.path.append(full_root_path)

from django.contrib import admin
from django.urls import path
from login.views import *
from proposals.views import *
from admin_config.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('shutdown/', Shutdown.as_view(), name="shutdown"),
    path('login/', Login.as_view(), name="login"),
    path('balance/', Balance.as_view(), name="balance"),
    path('assistentes/', Assistentes.as_view(), name="assistentes"),
    path('modelos/', Modelos.as_view(), name="mdoelos"),
    path('processadores/', Processadores.as_view(), name="processadores"),
    path('proposals/create/', ProposalsCreator.as_view(), name="proposals_create"),
    path('proposals/get/<str:status>/', ProposalsGetter.as_view(), name="proposals_get"),
    path('proposals/update/<str:id>/', ProposalsUpdater.as_view(), name="proposals_update"),
    path('proposals/convert_to_excel/', ProposalsConverter.as_view(), name="proposals_convert_to_excel"),
    path('proposals/get_nf/<str:id>/', ProposalsNfGetter.as_view(), name="proposals_get_nf_date"),
    path('server/', Server.as_view(), name="server"),
]