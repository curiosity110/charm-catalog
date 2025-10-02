"""Admin registrations for order models."""
from __future__ import annotations

from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "quantity", "price_at_purchase", "created_at")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "customer_phone", "status", "total_price", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("customer_name", "customer_phone", "customer_email")
    ordering = ("-created_at",)
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity", "price_at_purchase", "created_at")
    list_filter = ("created_at",)
    search_fields = ("product__title", "order__customer_name")
    ordering = ("-created_at",)
