"""Minimal HTTP API server providing product and order endpoints."""
from __future__ import annotations

import argparse
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, Optional
from urllib.parse import parse_qs, urlparse

from .database import init_db
from . import models

DEFAULT_HOST = "0.0.0.0"
DEFAULT_PORT = 8000


def _json_bytes(data: Any) -> bytes:
    return json.dumps(data, ensure_ascii=False).encode("utf-8")


class ApiRequestHandler(BaseHTTPRequestHandler):
    server_version = "CharmCatalogAPI/1.0"

    def log_message(self, format: str, *args: Any) -> None:  # noqa: A003 - keeping BaseHTTPRequestHandler signature
        # Print concise access logs to stdout
        message = "%s - - [%s] %s" % (self.address_string(), self.log_date_time_string(), format % args)
        print(message)

    def _set_common_headers(self, status: HTTPStatus, content_length: int) -> None:
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(content_length))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Connection", "close")

    def _write_json(self, status: HTTPStatus, payload: Any) -> None:
        body = _json_bytes(payload)
        self._set_common_headers(status, len(body))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)
        self.wfile.flush()
        self.close_connection = True

    def _parse_json_body(self) -> Dict[str, Any]:
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0:
            return {}
        data = self.rfile.read(length)
        if not data:
            return {}
        try:
            return json.loads(data.decode("utf-8"))
        except json.JSONDecodeError as exc:  # pragma: no cover - defensive
            raise ValueError("Invalid JSON payload.") from exc

    def do_OPTIONS(self) -> None:  # noqa: N802 - required by BaseHTTPRequestHandler
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.send_header("Connection", "close")
        self.end_headers()
        self.close_connection = True

    def do_GET(self) -> None:  # noqa: N802 - required naming
        parsed = urlparse(self.path)
        segments = [segment for segment in parsed.path.split("/") if segment]

        try:
            if len(segments) >= 2 and segments[0] == "api" and segments[1] == "products":
                self._handle_products_get(segments, parse_qs(parsed.query))
            elif len(segments) >= 2 and segments[0] == "api" and segments[1] == "orders":
                self._handle_orders_get(segments)
            else:
                self._write_json(HTTPStatus.NOT_FOUND, {"detail": "Endpoint not found."})
        except ValueError as exc:
            self._write_json(HTTPStatus.BAD_REQUEST, {"detail": str(exc)})
        except Exception as exc:  # pragma: no cover - defensive
            self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"detail": str(exc)})

    def do_POST(self) -> None:  # noqa: N802
        parsed = urlparse(self.path)
        segments = [segment for segment in parsed.path.split("/") if segment]

        try:
            if len(segments) >= 2 and segments[0] == "api" and segments[1] == "products":
                payload = self._parse_json_body()
                product = models.create_product(payload)
                self._write_json(HTTPStatus.CREATED, product)
            elif len(segments) >= 2 and segments[0] == "api" and segments[1] == "orders":
                payload = self._parse_json_body()
                order = models.create_order(payload)
                self._write_json(HTTPStatus.CREATED, order)
            else:
                self._write_json(HTTPStatus.NOT_FOUND, {"detail": "Endpoint not found."})
        except ValueError as exc:
            self._write_json(HTTPStatus.BAD_REQUEST, {"detail": str(exc)})
        except Exception as exc:  # pragma: no cover - defensive
            self._write_json(HTTPStatus.INTERNAL_SERVER_ERROR, {"detail": str(exc)})

    # Endpoint helpers -----------------------------------------------------

    def _handle_products_get(self, segments: list[str], query: Dict[str, list[str]]) -> None:
        if len(segments) == 2:
            search = query.get("search", [None])[0] if query else None
            products = models.list_products(search)
            self._write_json(HTTPStatus.OK, products)
            return

        if len(segments) == 3:
            slug = segments[2]
            product = models.get_product_by_slug(slug)
            if not product:
                self._write_json(HTTPStatus.NOT_FOUND, {"detail": "Product not found."})
                return
            self._write_json(HTTPStatus.OK, product)
            return

        self._write_json(HTTPStatus.NOT_FOUND, {"detail": "Endpoint not found."})

    def _handle_orders_get(self, segments: list[str]) -> None:
        if len(segments) == 2:
            orders = models.list_orders()
            self._write_json(HTTPStatus.OK, orders)
            return

        if len(segments) == 3:
            order_id = segments[2]
            try:
                order = models.get_order(order_id)
            except ValueError as exc:
                self._write_json(HTTPStatus.NOT_FOUND, {"detail": str(exc)})
                return
            self._write_json(HTTPStatus.OK, order)
            return

        self._write_json(HTTPStatus.NOT_FOUND, {"detail": "Endpoint not found."})


def run_server(host: str = DEFAULT_HOST, port: int = DEFAULT_PORT) -> None:
    init_db()
    with ThreadingHTTPServer((host, port), ApiRequestHandler) as httpd:
        print(f"🚀 Charm Catalog API running on http://{host}:{port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopping server...")
        finally:
            httpd.server_close()


def parse_args(args: Optional[list[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Charm Catalog API server")
    parser.add_argument("--host", default=DEFAULT_HOST, help="Host interface to bind")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port to listen on")
    return parser.parse_args(args=args)


def main(argv: Optional[list[str]] = None) -> None:
    options = parse_args(argv)
    run_server(options.host, options.port)


if __name__ == "__main__":  # pragma: no cover - CLI entry
    main()
