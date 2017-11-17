(ns djinnii-serverless.moves-api
  (:require [cljs-lambda.macros :refer-macros [deflambda]]
            [cljs-lambda.context :as ctx]
            [cljs.nodejs :as node]
            [cljs-http.client :as http]
            [cljs.core.async :refer [<!]])
  (:require-macros
    [cljs.core.async.macros :as async-macros]))


;; required lambda proxy response format
;; {
;;   "isBase64Encoded": true|false,
;;   "statusCode": 200,
;;   "headers": ,
;;   "body": {stringified json}
;; }

;; work around for cljs-http to use in node env
(set! js/XMLHttpRequest (node/require "xhr2"))

(def log (.-log js/console))

(defn normalize-location)
(defn normalize-tracking-points)
(defn normalize-activities)
(defn add-activities-filler-space)
(defn create-activities-list)

(defn normalize-storyline-data
  [stories]
  ;; not top priority to have on backend but should be here
  ;; ->> 
  ;; map over stories
  ;; map over day segments
  ;; convert times to unix
  ;; normalize activities
  )

(deflambda update-moves-data
  [event context]
  ;; make request to Moves API for last week of storyline with trackpoints
  ;; get-latest-storyline
      ;; eventually port this frontend code to lambda
  ;; normalize data
  ;; call update Activities DB
  ;; call update Stats DB based on activities
  ;; call update Days with activities and stats timekeys
)

(deflambda get-latest-storyline
  [event context]
  (let [access_token (get-in event [:path_parameters :access_token])]
  (log "event" event)
  ;; get access token from request pathParam
  ;; send request to moves
    ;; if request fails invoke refresh
    ;; return 200 back to front end, don't send data, will be pulled directly from DB on front-end for modularity (don't need to call this everytime I want to get activities etc.) 
  (go (<! (http/get (str "https://api.moves-app.com/api/1.1/user/storyline/daily?pastDays=7&trackPoints=true&access_token=" access_token))))))

  (set! (.-exports js/module) #js {:handler handler})