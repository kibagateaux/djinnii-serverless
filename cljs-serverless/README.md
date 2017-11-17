# djinnii-serverless
#TODOS
  Get cljs-serverless working with serverless-offline fs. Serverless offline wants index.js with handlers - runnning `sls offline start -l ./target/djinnii-serverless` is no op.
  


# Build 
`
lein cljsbuild once
`

# Deploy

```shell
$ serverless deploy
```

# Redeploy Function

```
$ serverless deploy function -f echo
```

# Invoke

```shell
$ curl -X POST <url> -H 'Content-Type: application/json' -d '{"body": "Hi"}'
```
