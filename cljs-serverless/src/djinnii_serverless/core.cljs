(ns djinnii-serverless.core
  (:require [cljs-lambda.macros :refer-macros [deflambda defgateway]]
            [cljs.nodejs :as nodejs]))

(nodejs/enable-util-print!)
            
;; example func
; (defgateway echo [event ctx]
;   {:status  200
;    :headers {:content-type (-> event :headers :content-type)}
;    :body    (event :body)})


(deflambda dynamo-db 
  "Connection to AWS DynamoDB"
  [event context])
