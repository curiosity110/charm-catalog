from django.contrib import admin
from django.utils.html import format_html
from .models import Product, Order, OrderItem

admin.site.site_header = "Store Admin"
admin.site.site_title = "Store Admin"
admin.site.index_title = "Back-office"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "price_eur", "published", "created_at")
    list_filter = ("published", "created_at")
    search_fields = ("title", "slug", "description")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("published",)
    readonly_fields = ()
    ordering = ("-created_at",)
    list_per_page = 25

    @admin.display(description="Price (€)")
    def price_eur(self, obj):
        return f"{obj.price_cents/100:.2f}"

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("price_cents",)

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id_short", "customer_name", "phone", "status_badge", "total_eur", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("customer_name", "phone", "id")
    date_hierarchy = "created_at"
    inlines = [OrderItemInline]
    readonly_fields = ("payment_method", "total_cents", "created_at")
    ordering = ("-created_at",)
    actions = ["mark_confirmed", "mark_shipped", "mark_delivered", "mark_canceled", "export_as_csv"]

    fieldsets = (
        ("Order", {"fields": ("status", "payment_method", "total_cents")}),
        ("Customer", {"fields": ("customer_name", "phone", "address", "note")}),
        ("Timestamps", {"fields": ("created_at",)}),
    )

    @admin.display(description="Order")
    def id_short(self, obj):
        return str(obj.id)[:8]

    @admin.display(description="Total (€)")
    def total_eur(self, obj):
        return f"{obj.total_cents/100:.2f}"

    @admin.display(description="Status")
    def status_badge(self, obj):
        color = {
            "new":"#0369a1", "confirmed":"#047857",
            "shipped":"#7c3aed", "delivered":"#16a34a",
            "canceled":"#dc2626"
        }.get(obj.status, "#374151")
        return format_html(
            '<span style="padding:2px 8px;border-radius:12px;background:{};color:white">{}</span>',
            color, obj.status.capitalize()
        )

    # ----- quick status actions -----
    def _bulk_status(self, request, queryset, value, label):
        updated = queryset.update(status=value)
        self.message_user(request, f"{updated} order(s) marked {label}.")

    def mark_confirmed(self, request, queryset): self._bulk_status(request, queryset, "confirmed", "confirmed")
    def mark_shipped(self, request, queryset):   self._bulk_status(request, queryset, "shipped", "shipped")
    def mark_delivered(self, request, queryset): self._bulk_status(request, queryset, "delivered", "delivered")
    def mark_canceled(self, request, queryset):  self._bulk_status(request, queryset, "canceled", "canceled")

    mark_confirmed.short_description = "Mark as Confirmed"
    mark_shipped.short_description   = "Mark as Shipped"
    mark_delivered.short_description = "Mark as Delivered"
    mark_canceled.short_description  = "Mark as Canceled"

    # ----- CSV export -----
    def export_as_csv(self, request, queryset):
        import csv
        from django.http import HttpResponse
        resp = HttpResponse(content_type="text/csv")
        resp["Content-Disposition"] = "attachment; filename=orders.csv"
        w = csv.writer(resp)
        w.writerow(["id","created_at","customer_name","phone","address","status","total_eur"])
        for o in queryset:
            w.writerow([o.id, o.created_at, o.customer_name, o.phone, o.address, o.status, f"{o.total_cents/100:.2f}"])
        return resp
    export_as_csv.short_description = "Export selected orders as CSV"
