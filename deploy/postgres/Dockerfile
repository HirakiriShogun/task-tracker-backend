FROM postgres:15-bookworm

COPY entrypoint.sh /usr/local/bin/task-tracker-postgres-entrypoint.sh
RUN chmod +x /usr/local/bin/task-tracker-postgres-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/task-tracker-postgres-entrypoint.sh"]
