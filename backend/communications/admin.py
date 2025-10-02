"""Admin registrations for communications models."""
from __future__ import annotations

from django.contrib import admin

from .models import ContactRequest


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "created_at")
    search_fields = ("full_name", "email", "phone")
    ordering = ("-created_at",)
