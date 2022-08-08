# /bin/bash -e

yarn db:migrate

MIGRATION=$(yarn db:generate "./migrations/CheckMigrations" | grep "has been generated successfully")

if [[ $MIGRATION ]]; then
  MIGRATION_NAME=$(echo "$MIGRATION" | grep -Eo '\/((.*).ts)');
  echo "New migration contains:";
  cat "$MIGRATION_NAME";
  echo "Ungenerated migrations missing";
  exit 1;
else
  echo "All migrations were correctly generated."
fi;
