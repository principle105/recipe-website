import random

from beanie import Document, PydanticObjectId
from pydantic import EmailStr

# User cache
user_email_cache = {}

# Recipe cache
recipe_id_cache = {}
recipe_random_cache = {}


class Recipe(Document):
    author: PydanticObjectId
    title: str
    data: dict

    @property
    def created(self):
        return self.id.generation_time

    @classmethod
    async def from_id(cls, _id):
        str_id = str(_id)

        if str_id in recipe_id_cache:
            return recipe_id_cache[str_id]

        recipe = await cls.find_one(cls.id == _id)
        recipe.cache_recipe()

        return recipe

    async def delete_recipe(self):
        await self.delete()

        str_id = str(self.id)

        recipe_id_cache[str_id] = None

        if str_id in recipe_random_cache:
            del recipe_random_cache[str_id]

    def cache_recipe(self):
        str_id = str(self.id)

        recipe_id_cache[str_id] = self
        recipe_random_cache[str_id] = self

    @classmethod
    async def get_random(cls, amt: int):
        # Returning all from the cache if there are enough in the cache
        if len(recipe_random_cache) > amt * 3:
            return random.sample(list(recipe_random_cache.values()), amt)

        if recipe_random_cache:
            cache_amt = min(len(recipe_random_cache), int(amt / 2))

            start = random.sample(
                list(recipe_random_cache.values()),
                cache_amt,
            )
        else:
            cache_amt = 0
            start = []

        start_ids = [s.id for s in start]

        results = cls.find({"_id": {"$nin": start_ids}}).limit(amt - cache_amt)

        items = [r async for r in results]

        # Caching the new results
        for it in items:
            it.cache_recipe()

        return start + items


class User(Document):
    email: EmailStr
    name: str
    avatar: str

    recipes: list[PydanticObjectId] = []

    @property
    def created(self):
        return self.id.generation_time

    def cache_user(self):
        user_email_cache[self.email] = self

    @classmethod
    async def from_email(cls, email: str, cache=True):
        if email in user_email_cache:
            return user_email_cache[email]

        user = await cls.find_one(cls.email == email)
        if cache:
            user_email_cache[email] = user

        return user
