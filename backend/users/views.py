from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework.generics import GenericAPIView

from users.serializers import FullUserSerializer

class RetrieveUserView(GenericAPIView):
  permission_classes = (IsAuthenticated, )
  
  def get(self, request, *args, **kwargs):    
    serializer = FullUserSerializer(request.user)
    return Response(serializer.data, status=HTTP_200_OK)