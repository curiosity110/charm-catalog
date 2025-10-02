"""Serializers for customer communications."""
from __future__ import annotations

from rest_framework import serializers

from .models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    """Serialize contact form submissions."""

    class Meta:
        model = ContactRequest
        fields = ["id", "full_name", "email", "phone", "message", "created_at"]
        read_only_fields = ["id", "created_at"]
