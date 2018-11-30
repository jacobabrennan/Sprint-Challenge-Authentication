<!-- Answers to the Short Answer Essay Questions go here -->

1. What is the purpose of using _sessions_?
To persist state across requests.

2. What does bcrypt do to help us store passwords in a secure manner.
We used bcrypt to hash passwords, and to verify that passwords match previously stored hashes.

3. What does bcrypt do to slow down attackers?
Passwords that have been hashed multiple times take longer to crack.
This assigns a cost, in time, to each failed login attempt.
The cost isn't visible to a ligitimate user who may make several failed attempts before loggin in,
but enforces rate limiting on a malicious user who needs to make thousands of attempts.

4. What are the three parts of the JSON Web Token?
Header: Identifies how the token was generated, and thus how to verify it.
Payload: Contains claims about the identifying agent.
Signature: Used to cryptographically verify the header and payload.