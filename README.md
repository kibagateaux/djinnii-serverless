> "More important than the quest for certainty is the quest for clarity" 
> François Gautier

# Philosophies:
* WHY? - Teaches growth mindset to create positive feedback cycles between different aspects of your life. Based on scientific (sleep impacts, screen time, biofeedback) and behavioural design studies (nudge principles, gamification, intrinsic motivation).
* Time Based - Everything is designed around time to see how people change overtime and maintain immutable data.
* “Abstraction of Self” - Is it you or its own being? Given all data about you, is it possible to recreate a virtual replica?
* KEEP DATA RAW & SIMPLE. Do not add interpretation, structure, or anything beyond what is necessary to describe the fundamental object and what it represents.
* Core Components of a Health Human - Purpose, Nutrition, Emotion, Social, Financial, Physical Activity, Mental Activity, Environment ...more? (Human Performance Institute)

# Development
In terminal change directory into service you are working on (e.g. `cd integrations/`) and run `serverles offline start` to deploy Lambda functions locally. This means that everything is being run off of your own computer and not servers in the cloud for faster feedback and so we don't pay. Everything is "hot-loaded" so anytime you save a file then the code you are running is automatically updated.

# File Structure

- **chatbot** - Chatbot built during Hacking Arts, designed to be used with [Botsify](botsify.com) but maybe this should change? Botsify is quite handy and it intgrates with different messenging services including Facebook and Kik.

- **cljs-serverless** - AWS Lambda functions written in ClojureScript using [cljs-lambda](https://github.com/nervous-systems/cljs-lambda/tree/master/cljs-lambda) and [Serverless framework](https://serverless.com/)

- **integrations** - AWS Lambda functions written in JavaScript using [Serverless framework](https://serverless.com/). A quick port from front-end code toget app live to handle app integration logic such as OAuth, data normalizing, and database updates.


# Notes
If lambda needs permissions, add roles to it's policy in IAM console.
If Lambda is inexplicably returning 502s, make sure respoonse codes are configured in API Gateway
# TODOS
Confirm Android setup https://developers.facebook.com/docs/facebook-login/android/  && https://github.com/facebook/react-native-fbsdk
Integrate Facebook login into AWS Cognito following this guide https://docs.aws.amazon.com/cognito/latest/developerguide/facebook.html
# Documentation
FIXME: I need to be documented so people know how to use me!
