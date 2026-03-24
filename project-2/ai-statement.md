AI Statement: I used AI to debug code & guide me in writing JSON files and working with JavaScript, as well as suggesting potential workflows for making the project work. 

I came up with the idea of using a Google Sheets, CSV, or JSON file to archive all the project's text content. I asked it to teach me how to write JSON files and later received its assistance in debugging the file. See below:

Prompt: 
"See the attached decision flowchart-type diagram. I am trying to streamline my question pages in the following way:

– Only one question page per question – several text fields ready to be populated – QUESTION, OPTIONS (x4)
– Use a JSON, CSV, or Google Sheets file index with 'tagged' text
– Text is tagged as "Question X" or "Answer X, Correct" or "Answer X, Incorrect"
– Must keep track of: (i) no. of correct questions, (ii) correct/incorrect status of previous question
– Add populating logic => If previous answer was correct, randomly pick P number of correct options and keep remaining number of options incorrect

Guide me on how I can implement this". 

ChatGPT: "Use one reusable question page + one data file + one state file. Do not use CSV or Google Sheets for this tonight. JSON is the right choice: easiest to read in JS, easiest to tag, easiest to randomise.

The clean structure is:
	•	question.html → one template page
	•	questions.json → all question/answer content
	•	game.js → loads the right question, fills the page, tracks state, decides next options
	•	localStorage → keeps timer, score, previous answer status, current question number". 