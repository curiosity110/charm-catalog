"""API views for customer communications."""
from __future__ import annotations

from rest_framework import mixins, viewsets

from .models import ContactRequest
from .serializers import ContactRequestSerializer


class ContactRequestViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    """Allow staff to review and capture incoming contact requests."""

    serializer_class = ContactRequestSerializer
    queryset = ContactRequest.objects.all()
