from authlib.integrations.starlette_client import OAuth, OAuthError
from config import CONFIG
from database.models import User
from fastapi import APIRouter
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import HTMLResponse, RedirectResponse

auth_router = APIRouter(prefix="/auth")

config_data = {
    "GOOGLE_CLIENT_ID": CONFIG.google_client_id,
    "GOOGLE_CLIENT_SECRET": CONFIG.google_client_secret,
}
config = Config(environ=config_data)

oauth = OAuth(config)

# Registering oauth providers
oauth.register(
    name="google",
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid profile email"},
)


@auth_router.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("redirect")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@auth_router.get("/redirect")
async def redirect(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as error:
        return HTMLResponse(f"<h1>{error.error}</h1>")

    user_info = token.get("userinfo")

    user = await User.from_email(user_info.email, cache=False)

    if user is None:
        # Creating a user
        user = User(
            email=user_info.email, name=user_info.name, avatar=user_info.picture
        )
        await user.create()

        user.cache_user()

    if user:
        request.session["user"] = user.email

    return RedirectResponse(url=CONFIG.client_url)


@auth_router.get("/logout")
async def logout(request: Request):
    request.session.pop("user", None)

    return RedirectResponse(url=CONFIG.client_url)
