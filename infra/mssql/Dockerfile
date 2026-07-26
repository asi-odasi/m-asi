FROM mcr.microsoft.com/mssql/server:2019-latest

USER root
RUN mkdir -p /.system \
    && chown mssql:root /.system \
    && chmod 770 /.system
USER mssql
