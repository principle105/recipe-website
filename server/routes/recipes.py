from beanie import PydanticObjectId
from database.models import Recipe, User
from fastapi import APIRouter, HTTPException, Path
from starlette.requests import Request

recipes_router = APIRouter(prefix="/recipes")


@recipes_router.get("/me", response_model=list[Recipe])
async def me(request: Request):
    email = request.session.get("user")

    if email:
        user = await User.from_email(email)

        ids = [id for id in user.recipes]

        recipes = Recipe.find({"_id": {"$in": ids}})

        return [r async for r in recipes]

    return None


@recipes_router.get("/random", response_model=list[Recipe])
async def random_recipes():
    return await Recipe.get_random(12)


@recipes_router.post("/new")
async def new_recipe(request: Request):
    payload = await request.json()

    if "title" not in payload:
        raise HTTPException(422, "Missing recipe title")

    if "data" not in payload:
        raise HTTPException(422, "Missing recipe data")

    email = request.session.get("user")

    if email:
        user = await User.from_email(email)

        if user is not None:
            recipe = Recipe(
                author=user.id,
                title=payload["title"],
                data=payload["data"],
            )
            await recipe.create()

            recipe.cache_recipe()

            user.recipes.append(recipe.id)
            await user.save()

            user.cache_user()

            return user

    raise HTTPException(404, "User not found")


@recipes_router.post("/update")
async def update_recipe(request: Request):
    payload = await request.json()

    if "id" not in payload:
        raise HTTPException(422, "Missing recipe id")

    if "title" not in payload and "data" not in payload:
        raise HTTPException(422, "Missing fields to update")

    email = request.session.get("user")

    if email:
        user = await User.from_email(email)

        if user is not None:
            recipe_id = PydanticObjectId(payload["id"])

            if recipe_id not in user.recipes:
                raise HTTPException(401, "Recipe does not belong to user")

            recipe = await Recipe.from_id(recipe_id)

            if recipe is None:
                raise HTTPException(404, "Recipe not found")

            if "title" in payload:
                recipe.title = payload["title"]

            if "data" in payload:
                recipe.data = payload["data"]

            await recipe.save()

            recipe.cache_recipe()

            return {"hello": "world"}

    raise HTTPException(404, "User not found")


@recipes_router.get("/find/{id}", response_model=Recipe)
async def new_recipe(*, id: PydanticObjectId = Path(None)):
    recipe = await Recipe.from_id(id)

    if recipe is not None:
        return recipe

    return None
