FROM postgres:14.3

ARG ARG_DB_USER
ENV POSTGRES_USER=$ARG_DB_USER

ARG ARG_DB_PASSWORD
ENV POSTGRES_PASSWORD=$ARG_DB_PASSWORD

ARG ARG_DB_NAME
ENV POSTGRES_DB=$ARG_DB_NAME

COPY db.tar.gz /docker-entrypoint-initdb.d/

RUN tar -xvzf /docker-entrypoint-initdb.d/db.tar.gz -C /docker-entrypoint-initdb.d/