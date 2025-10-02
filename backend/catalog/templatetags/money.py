from django import template

register = template.Library()

@register.filter
def mkd(cents):
    try:
        cents = int(cents)
    except Exception:
        return cents
    return f"{cents/100:,.2f} МКД".replace(",", " ").replace(".", ",")