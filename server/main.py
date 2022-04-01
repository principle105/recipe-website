from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

import routes
from app import app
from config import CONFIG

# Routes
for route in routes.default:
    app.include_router(route)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CONFIG.client_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(
    SessionMiddleware, secret_key=CONFIG.secret, https_only=True, same_site="none"
)
