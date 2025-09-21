from django.contrib import admin
from .models import *

@admin.register(Accounts)
class AccountsAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return super().get_queryset(request).using('login')

    def save_model(self, request, obj, form, change):
        obj.save(using='login')

    def delete_model(self, request, obj):
        obj.delete(using='login')

    list_display = ("registration", "password", "name", "module")