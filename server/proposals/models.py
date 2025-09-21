from django.db import models

class CurrentBalance(models.Model):

    current_balance = models.CharField(max_length=200)

    def __str__(self):
        return str(self.current_balance)

class Assistentes(models.Model):

    nome = models.CharField(max_length=200)

    def __str__(self):
        return str(self.nome)
    
class Modelos(models.Model):

    nome = models.CharField(max_length=200)

    def __str__(self):
        return str(self.nome)
    
class Processadores(models.Model):

    nome = models.CharField(max_length=200)

    def __str__(self):
        return str(self.nome)
    
class Proposals(models.Model):
    
    data = models.CharField(max_length=200)
    assistente = models.CharField(max_length=200)
    revendedor_cliente = models.CharField(max_length=200)
    certame_negocio = models.CharField(max_length=200)
    modelo = models.CharField(max_length=200)
    processador = models.CharField(max_length=200)
    quantidade = models.CharField(max_length=200)
    valor_unitario = models.CharField(max_length=200)
    valor_total = models.CharField(max_length=200)
    verba_concedida = models.CharField(max_length=200)
    verba_concedida_porcentagem = models.CharField(max_length=200)
    status = models.CharField(max_length=200)
    aprovador_reprovador = models.CharField(max_length=200)
    data_hora_aprovacao_recusa = models.CharField(max_length=200)
    forma_abatimento = models.CharField(max_length=200)
    data_abatimento = models.CharField(max_length=200)

    def __str__(self):
        return str(self.id)