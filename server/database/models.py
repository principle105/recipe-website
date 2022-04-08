import random
import time

from beanie import Document, PydanticObjectId
from pydantic import EmailStr


class RecipeCache:
    recipe_id_cache = {}

    recipe_random_cache = {}
    recipe_random_last_update = 0

    @classmethod
    @property
    def id_cache(cls):
        return cls.recipe_id_cache

    @classmethod
    @property
    def random_cache(cls):
        return cls.recipe_random_cache

    @classmethod
    @property
    def random_update(cls):
        return cls.recipe_random_last_update


class Recipe(Document, RecipeCache):
    author: PydanticObjectId
    title: str
    data: dict

    @property
    def created(self):
        return self.id.generation_time

    @classmethod
    async def from_id(cls, _id):
        str_id = str(_id)

        if str_id in cls.recipe_id_cache:
            return cls.recipe_id_cache[str_id]

        recipe = await cls.find_one(cls.id == _id)
        recipe.cache_recipe()

        return recipe

    async def delete_recipe(self):
        await self.delete()

        str_id = str(self.id)

        self.recipe_id_cache[str_id] = None

        if str_id in self.recipe_random_cache:
            del self.recipe_random_cache[str_id]

    def cache_recipe(self):
        str_id = str(self.id)

        self.recipe_id_cache[str_id] = self
        self.recipe_random_cache[str_id] = self

    @classmethod
    async def get_random(cls, amt: int):
        if (
            cls.recipe_random_cache is False
            or time.time() > cls.recipe_random_last_update + 300
        ):
            results = cls.aggregate([{"$sample": {"size": amt * 5}}])

            items = [cls(**r) async for r in results]

            cls.recipe_random_cache = {str(n.id): n for n in items}
            cls.recipe_random_last_update = time.time()

            for it in items:
                it.cache_recipe()
        else:

            items = list(cls.recipe_random_cache.values())

        return random.sample(items, min(len(items), amt))


class UserCache:
    user_email_cache = {}

    @classmethod
    @property
    def email_cache(cls):
        return cls.user_email_cache


class User(Document, UserCache):
    email: EmailStr
    name: str
    avatar: str

    recipes: list[PydanticObjectId] = []

    @property
    def created(self):
        return self.id.generation_time

    def cache_user(self):
        self.email_cache[self.email] = self

    @classmethod
    async def from_email(cls, email: str, cache=True):
        if email in cls.email_cache:
            return cls.email_cache[email]

        user = await cls.find_one(cls.email == email)
        if cache:
            cls.email_cache[email] = user

        return user
