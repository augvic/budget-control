from django.db import models

class Accounts(models.Model):

    registration = models.CharField(max_length=200, primary_key=True)
    password = models.CharField(max_length=200)
    name = models.CharField(max_length=200)
    module = models.CharField(max_length=200)

    def __str__(self):
        return str(self.registration)