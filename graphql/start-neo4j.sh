docker rm -f neo4j;
docker run -d -p 7474:7474 -p 7687:7687 \
    --memory 1024m \
    --name neo4j \
    neo4j:3.3.1


# After container instantiation
# allow Neo4j upgrades
# docker cp neo4j:/var/lib/neo4j/conf/neo4j.conf .
  # add in dbms.allow_format_migration=true
# docker cp ./neo4j.conf neo4j:/var/lib/neo4j/conf/neo4j.conf

# Add APOC procedures for Cypher directive
# docker exec -it neo4j /bin/sh
# apk add --update openssl
    # cd plugins
    # wget https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.3.0.1/apoc-3.3.0.1-all.jar

# This should be in `docker run` statement
# -v $PWD/plugins:/plugins