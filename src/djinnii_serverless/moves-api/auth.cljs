(ns djinnii-serverless.moves-api
  (:require [cljs-lambda.macros :refer-macros [deflambda]])
  (:require-macros [adzerk.env :as env]))

(def log (.-log js/console))
(def env-var (.-env js/process))

(deflambda init-auth
  [event context]
  ;; switch case on invocation method get/post
  ;; on post and code respond back to moves api
  ;; auth code for token url https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code=<code>&client_id=<client_id>&client_secret=<client_secret>&redirect_uri=<redirect_uri>

  ;; if get then initiate process
  (let [api-key (env/def "MOVES_API_KEY")
        redirect-uri (str "moves://app/authorize?client_id=" api-key "&redirect_uri=" "&scope=activity,location")]
    (log "key" api-key)
    (log "url" redirect-uri)
    (log "context" context)
    (log "event" event)
    ;; return deep-link
    
    (assoc-in (js->clj event) [:response] redirect-uri)
    (.done context nil event)
  )
  ;; on get request initiates auth flow with 
)