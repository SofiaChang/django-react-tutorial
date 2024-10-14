from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializer import NoteSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def get_queryset(self):
        return User.objects.all()
    

# Notes
class NoteListCreateView(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print('serializer is not valid ', serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)
    
    def perform_destroy(self, instance):
        instance.delete()
        print('Note deleted')