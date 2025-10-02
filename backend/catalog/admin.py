"""Admin registrations for catalog models."""
from __future__ import annotations

from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "price", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("title", "description")
    ordering = ("-created_at",)
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("title", "slug", "description", "price", "active")}),
        ("Image", {"fields": ("image", "image_url")}),
        ("Metadata", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
    readonly_fields = ("created_at", "updated_at")
