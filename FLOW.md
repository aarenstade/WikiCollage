1. User enters new wiki page
2. No additions are returned
3. User adds additions
4. User starts upload, and enters topic info

   1. build elementObjects list
      1. convert img urls to base64
      2. upload images
   2. request embed mural endpoint
      1. send element objects, and rev mural url
      2. return new mural url
   3. request insert addition endpoint
      1. send addition item with topic_id = undefined
      2. send topic object {topic, description}
      3. insert topic, get topic_id
      4. add topic_id to addition, insert addition
   4. redirect user to /success with addition_id

5. User enters existing wiki page
6. Prev addition is returned
7. User adds additions
8. Users starts upload
   1. build elementObjects list
   2. request embed mural endpoint, return new mural
   3. request insert addition endpoint
      1. send addition item with topic_id
      2. insert addition
   4. redirect user to /success with addition_id
