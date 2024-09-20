from django.db import models


# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=500)
    scenarios_id = models.JSONField()


class Scenario(models.Model):
    scenario_id = models.IntegerField()
    name = models.CharField(max_length=2000)
    image = models.CharField(max_length=100000)  # image url
    context = models.CharField(max_length=10000)
    first_message = models.CharField(max_length=10000)


class Conversation(models.Model):
    user_id = models.CharField(max_length=500)
    scenario_id = models.IntegerField()
    user_text = models.CharField(max_length=10000)


class LLMResponse(models.Model):
    text = models.CharField(max_length=100000)
    feedback = models.CharField(max_length=10000)
    translated_text = models.CharField(max_length=100000)
    score = models.IntegerField()
