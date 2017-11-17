(defproject djinnii-serverless "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure       "1.8.0"]
                 [org.clojure/clojurescript "1.8.51"]
                 [io.nervous/cljs-lambda    "0.3.5"]
                 [org.clojure/core.async "0.3.442"]
                 [cljs-http "0.1.43"]
                 [adzerk/env "0.4.0"]]
  :plugins [[lein-npm                    "0.6.2"]
            [io.nervous/lein-cljs-lambda "0.6.6"]
            [io.nervous/eulalie "0.6.10"]]
  :npm {:dependencies [[serverless-cljs-plugin "0.1.2"]
                       [serverless-offline "3.16.0"]
                       [xhr2 ""]
                       [moves "0.0.2"]]}
  :cljs-lambda {

    :functions
     [{:name   "get-auth-code"
       :invoke djinnii-serverless.moves-api/get-auth-code}
       {:name   "get-new-moves-token"
       :invoke djinnii-serverless.moves-api/get-new-moves-token}]
    :compiler   {:inputs  ["src"]
                 :externs ["aws-externs.js"]
                 :options {:output-to     "target/djinnii-serverless/djinnii_serverless.js"
                           :output-dir    "target/djinnii-serverless"
                           :target        :nodejs
                           :language-in   :ecmascript5
                           :optimizations :advanced}} :defaults {:role "arn:aws:iam::261701813877:role/cljs-lambda-default"}})
  :cljsbuild {
    :repl-listen-port 9000
    :builds {
      :dev
      {:source-paths ["src"]
       :jar true
       :compiler {:output-to "resources/public/js/main-debug.js"
                  :optimizations :whitespace
                  :pretty-print true
                  :externs ["aws-externs.js"]}}
      :prod
      {:source-paths ["src"]
       :compiler {:output-to "resources/public/js/main.js"
                  :optimizations :advanced
                  :pretty-print false
                  :externs ["aws-externs.js"]}}}}