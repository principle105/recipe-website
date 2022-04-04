import random
import time

from beanie import Document, PydanticObjectId
from pydantic import EmailStr

# User cache
user_email_cache = {}

# Recipe cache
recipe_id_cache = {}

recipe_random_cache = {}
recipe_random_last_update = 0


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
        # WOWO GLOBAL oiwefnow
        global recipe_random_cache
        global recipe_random_last_update

        if (
            recipe_random_cache is False
            or time.time() > recipe_random_last_update + 300
        ):
            results = cls.aggregate([{"$sample": {"size": amt}}])

            items = [cls(**r) async for r in results]

            recipe_random_cache = {str(n.id): n for n in items}
            recipe_random_last_update = time.time()

            for it in items:
                it.cache_recipe()

            return items

        values = list(recipe_random_cache.values())

        return random.sample(values, min(len(values), amt))


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
