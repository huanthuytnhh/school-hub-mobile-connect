import json

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from stream_chat import StreamChat

client = StreamChat(api_key=settings.STREAM_API_KEY, api_secret=settings.STREAM_API_SECRET)

@csrf_exempt
def get_stream_token(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    user_id = data.get("user_id")
    if not user_id:
        return JsonResponse({"error": "Missing user_id"}, status=400)
    
    # Tạo token
    token = client.create_token(user_id)
    
    return JsonResponse({
        "token": token,
        "api_key": settings.STREAM_API_KEY,
        "user_id": user_id
    })
