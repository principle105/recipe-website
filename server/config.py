from decouple import config
from pydantic import BaseModel


class Settings(BaseModel):
    mongo_uri = config("MONGO_URI")

    secret = config("SECRET")

    client_url = "http://localhost:3000"

    # Google Auth
    google_client_id = config("GOOGLE_CLIENT_ID")
    google_client_secret = config("GOOGLE_CLIENT_SECRET")

    testing = config("TESTING", default=False, cast=bool)


CONFIG = Settings()
