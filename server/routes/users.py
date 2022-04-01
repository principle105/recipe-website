from database.models import User
from fastapi import APIRouter
from starlette.requests import Request

users_router = APIRouter(prefix="/users")


@users_router.get("/me", response_model=User)
async def me(request: Request):
    email = request.session.get("user")
    if email:
        user = await User.from_email(email)

        if user is not None:
            return user

    return None
