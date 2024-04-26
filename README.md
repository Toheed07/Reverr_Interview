# Token Payment System API

This is an Express API for handling token-based payments and transactions between users.

## User Schema

The user schema includes the following fields:

- **id**: Unique identifier for the user
- **firstname**: User's first name
- **lastname**: User's last name
- **password**: User's password (hashed for security)
- **email**: User's email address
- **transaction_id**: Identifier for transactions associated with the user
- **amount**: Amount of tokens associated with the user
- **token**: Token associated with the user

## Endpoints
### Add Payment
### Endpoint: POST /add-payment

This endpoint handles adding payments to user accounts and assigning tokens. It accepts the following parameters in the request body:

- **userId**: ID of the user making the payment
- **amount**: Amount of tokens to be added to the user's account

### Initiate Transaction
### Endpoint: POST /transactions

This endpoint initiates a transaction between two users. It deducts tokens from the sender's account and adds them to the recipient's account within a transaction block to ensure data consistency. It accepts the following parameters in the request body:

- **senderId**: ID of the user initiating the transaction
- **recipientId**: ID of the user receiving the transaction
- **amount**: Amount of tokens to be transferred in the transaction
