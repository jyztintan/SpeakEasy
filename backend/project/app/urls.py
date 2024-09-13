from django.urls import path
from .views import generate_openai_response, home

urlpatterns = [
    path('', home, name='home'),
    path('test-openai/', generate_openai_response, name='test-openai'),
]
