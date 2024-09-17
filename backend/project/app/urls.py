from django.urls import path
from .views import (
    test,
    create_user,
    get_scenarios,
    resouce_scenario,
    create_conversation_response,
    request_help,
)

urlpatterns = [
    path("test/", test),
    path("users/", create_user),
    path("scenarios/<str:user_id>", get_scenarios),
    path("scenarios/", resouce_scenario),
    path("text/", create_conversation_response),
    path("get-help/", request_help),
]
