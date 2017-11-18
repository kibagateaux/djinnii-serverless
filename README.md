> "More important than the quest for certainty is the quest for clarity" 
> - François Gautier

#Philosophies:
* WHY? - Teaches growth mindset to create positive feedback cycles between different aspects of your life. Based on scientific (sleep impacts, screen time, biofeedback) and behavioural design studies (nudge principles, gamification, intrinsic motivation).
* Time Based - Everything is designed around time to see how people change overtime and maintain immutable data.
* “Abstraction of Self” - Is it you or its own being? Given all data about you, is it possible to recreate a virtual replica?
* Core Components of a Health Human - Purpose, Nutrition, Emotion, Social, Financial, Physical Activity, Mental Activity, Sleep ...more? (Human Performance Institute)

# File Structure
**cljs-serverless** - AWS Lambda functions written in ClojureScript using [cljs-lambda](https://github.com/nervous-systems/cljs-lambda/tree/master/cljs-lambda) and [Serverless framework](https://serverless.com/)
**integrations** - AWS Lambda functions written in JavaScript. A quick port from front-end code toget app live to handle app integration logic such as OAuth, data normalizing, and database updates.
**firebase** - I could only figure out how to do serverless OAuth through firebase functions. Only using one function for MovesAPI redirect. FIXME!!! Do not build more functions, this is a trap.
**chatbot**


# Documentation
FIXME: I need to be documented so people know how to use me!
