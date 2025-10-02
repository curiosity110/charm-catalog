"""Allow running management commands via ``python -m backend``."""
from __future__ import annotations

from django.core.management import execute_from_command_line


def main() -> None:
    execute_from_command_line()


if __name__ == "__main__":
    main()
