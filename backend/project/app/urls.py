from django.urls import path
from .views import (
    generate_openai_response,
    test,
    create_user,
    get_scenarios,
    create_scenario,
    create_conversation_response,
)

urlpatterns = [
    path("test/", test),
    path("users/", create_user),
    path("scenarios/<str:user_id>", get_scenarios),
    path("scenarios/", create_scenario),
    path("text/", create_conversation_response),
    path("test-openai/", generate_openai_response, name="test-openai"),
]
