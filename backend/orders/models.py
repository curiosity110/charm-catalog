"""Database models for order management."""
from __future__ import annotations

import uuid

from django.db import models

from catalog.models import Product


class Order(models.Model):
    """Represents a customer's order request."""

    STATUS_NEW = "new"
    STATUS_CONTACTED = "contacted"
    STATUS_SCHEDULED = "scheduled"
    STATUS_FULFILLED = "fulfilled"
    STATUS_CANCELED = "canceled"
    STATUS_CHOICES = [
        (STATUS_NEW, "New"),
        (STATUS_CONTACTED, "Contacted"),
        (STATUS_SCHEDULED, "Scheduled"),
        (STATUS_FULFILLED, "Fulfilled"),
        (STATUS_CANCELED, "Canceled"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer_name = models.CharField(max_length=255)
    customer_phone = models.CharField(max_length=50)
    customer_email = models.EmailField(blank=True)
    customer_address = models.TextField(blank=True)
    payment_method = models.CharField(max_length=50, default="cash_on_delivery")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_NEW)
    total_cents = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:  # pragma: no cover
        return f"Order {self.id}"


class OrderItem(models.Model):
    """Line item for a product within an order."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, related_name="order_items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="order_items", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price_cents_at_purchase = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.product.title} x {self.quantity}"
