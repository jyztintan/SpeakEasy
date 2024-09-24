from django.urls import path
from .views import (
    test,
    create_user,
    get_scenarios,
    resource_scenario,
    create_conversation_response,
    request_help, create_conversation_feedback,
)

urlpatterns = [
    path("test/", test),
    path("users/", create_user),
    path("scenarios/<str:user_id>", get_scenarios),
    path("scenarios/", resource_scenario),
    path("text/", create_conversation_response),
    path("feedback/", create_conversation_feedback),
    path("get-help/", request_help),
]
