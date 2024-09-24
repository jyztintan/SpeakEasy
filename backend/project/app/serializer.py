from rest_framework import serializers
from .models import User, LLMFeedback
from .models import Scenario
from .models import Conversation
from .models import LLMResponse


class ScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scenario
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = "__all__"


class LLMResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = LLMResponse
        fields = "__all__"


class LLMFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = LLMFeedback
        fields = "__all__"
