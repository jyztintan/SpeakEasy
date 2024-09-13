from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from .process_prompt import openai_call


# Create your views here.
def generate_openai_response(request):
    original = request.GET.get('original')
    translated = openai_call(original)
    return JsonResponse({'translation': translated})
# You can test with http://127.0.0.1:8000/test-openai/?original=your_mother_is_nice

def home(request):
    return HttpResponse("hello world!")
