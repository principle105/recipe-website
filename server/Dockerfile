FROM python:3.9.7

ENV PYTHONDONTWRITEBYTECODE 1

ENV PYTHONUNBUFFERED 1

COPY pyproject.toml poetry.lock ./

RUN pip install -U poetry

RUN poetry config virtualenvs.create false

RUN poetry export -f requirements.txt -o requirements.txt --without-hashes
RUN pip install -r requirements.txt

COPY . .
CMD [ "sh", "-c", "uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}"]