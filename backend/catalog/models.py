import uuid
from django.db import models

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price_cents = models.PositiveIntegerField(default=0)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.title

class Order(models.Model):
    STATUS_CHOICES = [
        ("new","New"), ("confirmed","Confirmed"),
        ("shipped","Shipped"), ("delivered","Delivered"),
        ("canceled","Canceled"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    customer_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=300)
    note = models.TextField(blank=True)
    payment_method = models.CharField(max_length=10, default="COD")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="new")
    total_cents = models.PositiveIntegerField(default=0)
    def __str__(self): return f"Order {self.id} ({self.customer_name})"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_cents = models.PositiveIntegerField()  # snapshot at order time
