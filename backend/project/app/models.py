from django.db import models


# Create your models here.
class User(models.Model):
    user_id = models.CharField(max_length=100)
    scenarios_id = models.JSONField()


class Scenario(models.Model):
    scenario_id = models.IntegerField()
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=100000)  # image converted to base64 str
    context = models.CharField(max_length=1000)
    first_message = models.CharField(max_length=10000)


class Conversation(models.Model):
    user_id = models.CharField(max_length=100)
    scenario_id = models.IntegerField()
    user_text = models.CharField(max_length=1000)


class LLMResponse(models.Model):
    text_response = models.CharField(max_length=10000)
    feedback = models.CharField(max_length=1000)
    translated_text = models.CharField(max_length=10000)
    score = models.IntegerField()
