(defproject djinnii-serverless "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure       "1.8.0"]
                 [org.clojure/clojurescript "1.8.51"]
                 [io.nervous/cljs-lambda    "0.3.5"]
                 [adzerk/env "0.4.0"]]
  :plugins [[lein-npm                    "0.6.2"]
            [io.nervous/lein-cljs-lambda "0.6.6"]]
  :npm {:dependencies [[serverless-cljs-plugin "0.1.2"]
                        [serverless-offline "3.16.0"]]}
  :cljs-lambda {
    :defaults {:role "kiba"}
    :functions
     [{:name   "init-mvoes-auth"
       :invoke djinnii-serverless.moves-api/init-auth}]
    :compiler   {:inputs  ["src"]
                 :options {:output-to     "target/djinnii-serverless/djinnii_serverless.js"
                           :output-dir    "target/djinnii-serverless"
                           :target        :nodejs
                           :language-in   :ecmascript5
                           :optimizations :advanced}}})
  :cljsbuild {
    :repl-listen-port 9000
    :builds {
      :dev
      {:source-paths ["src"]
       :jar true
       :compiler {:output-to "resources/public/js/main-debug.js"
                  :optimizations :whitespace
                  :pretty-print true}}
      :prod
      {:source-paths ["src"]
       :compiler {:output-to "resources/public/js/main.js"
                  :optimizations :advanced
                  :pretty-print false}}}}