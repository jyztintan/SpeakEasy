from django.db import models
from django.core.validators import int_list_validator


# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=100)
    scenarios = models.JSONField()


class Scenario(models.Model):
    scenario_id = models.IntegerField()
    # image = models.ImageField()
    context = models.CharField(max_length=1000)


class Conversation(models.Model):
    user_id = models.CharField(max_length=100)
    scenario_id = models.IntegerField()
    user_text = models.CharField(max_length=1000)


class LLMResponse(models.Model):
    reply = models.CharField(max_length=1000)
    feedback = models.CharField(max_length=1000)
