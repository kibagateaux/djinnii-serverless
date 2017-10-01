(ns djinnii-serverless.moves-api
  (:require [cljs-lambda.macros :refer-macros [deflambda]]
            [cljs.nodejs :as node])
  ; (:require-macros [adzerk/env :as env])
)

(def log (.-log js/console))
(defn env-var 
  "Returns the value of the environment variable,
  or raises if it is missing from the environment."
  [var]
  (let [env (get js/process "env")]
  (or
    (get env var) 
    (throw (str "Environment variable '" var "' is undefined")))))

(deflambda init-auth
  [event context]
  ;; switch case on invocation method get/post

  ;; should be own lambdafunc called "handle-auth-tokens"
  ;; on post and code respond back to moves api
  ;; auth code for token url https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code=<code>&client_id=<client_id>&client_secret=<client_secret>&redirect_uri=<redirect_uri>

  ;; if post method
  ;;   if code in params 
  ;;    send code back to moves and receive token
  (if-let [code (get context [:params :code])]
      (let api-key (env-var "MOVES_API_KEY")
        api-secret (env-var "MOVES_API_SECRET")
        auth-url (str "https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code=" code "&client_id=<" api-key "&client_secret=" api-secret "&redirect_uri=" "---this funcs url---")]
    ;; post to url and get token (not async dont need and pain to learn rn)
      )
    ;; else
      ;; destructure tokens from request and save to db
    (let [{:access_token refresh_token} (get context [:body])])
  )

  ;; else get method
  ;; if get then initiate process
  (let [api-key (env-var "MOVES_API_KEY")
        redirect-uri (str "moves://app/authorize?client_id=" api-key "&redirect_uri=" "---this funcs url---" "&scope=activity,location")]
    (log "key" api-key)
    (log "url" redirect-uri)
    (log "context" context)
    (log "event" event)

    ;; add deep-link to response and return it
    (assoc-in (js->clj event) [:response] redirect-uri)
    (.done context nil event)
  )
  ;; on get request initiates auth flow with 
)