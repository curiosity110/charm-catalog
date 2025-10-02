"""Admin registrations for catalog models."""
from __future__ import annotations

from django.contrib import admin

from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ("image", "image_url", "is_primary", "sort_order")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "price_cents", "active", "created_at")
    list_filter = ("active", "created_at")
    search_fields = ("title", "description")
    ordering = ("-created_at",)
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProductImageInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("product", "is_primary", "sort_order", "created_at")
    list_filter = ("is_primary", "created_at")
    search_fields = ("product__title",)
    ordering = ("product", "sort_order")
