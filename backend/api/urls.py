from django.urls import path
from . import views

urlpatterns = [
    # path('register/', views.CreateUserView.as_view(), name='register'),
    path('notes', views.NoteListCreateView.as_view(), name='notes'),
    path('notes/delete/<int:pk>', views.NoteDelete.as_view(), name='note-delete'),
]