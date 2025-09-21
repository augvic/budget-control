from django.contrib import admin
from .models import *

@admin.register(CurrentBalance)
class CurrentBalanceAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return super().get_queryset(request).using('proposals')

    def save_model(self, request, obj, form, change):
        obj.save(using='proposals')

    def delete_model(self, request, obj):
        obj.delete(using='proposals')

@admin.register(Assistentes)
class AssistentesAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return super().get_queryset(request).using('proposals')

    def save_model(self, request, obj, form, change):
        obj.save(using='proposals')

    def delete_model(self, request, obj):
        obj.delete(using='proposals')

@admin.register(Modelos)
class ModelosAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return super().get_queryset(request).using('proposals')

    def save_model(self, request, obj, form, change):
        obj.save(using='proposals')

    def delete_model(self, request, obj):
        obj.delete(using='proposals')

@admin.register(Processadores)
class ProcessadoresAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return super().get_queryset(request).using('proposals')

    def save_model(self, request, obj, form, change):
        obj.save(using='proposals')

    def delete_model(self, request, obj):
        obj.delete(using='proposals')

@admin.register(Proposals)
class ProposalsAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return super().get_queryset(request).using('proposals')

    def save_model(self, request, obj, form, change):
        obj.save(using='proposals')

    def delete_model(self, request, obj):
        obj.delete(using='proposals')

    list_display = ("id", "data", "assistente", "revendedor_cliente", "certame_negocio", "modelo", "processador", "quantidade", "valor_unitario", "valor_total", "verba_concedida", "verba_concedida_porcentagem", "status", "aprovador_reprovador", "data_hora_aprovacao_recusa", "forma_abatimento", "data_abatimento")
    list_filter = ("assistente", "revendedor_cliente", "modelo", "processador", "status", "aprovador_reprovador")