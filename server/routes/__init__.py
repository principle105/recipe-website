from .auth import auth_router
from .recipes import recipes_router
from .users import users_router

default = [auth_router, users_router, recipes_router]
