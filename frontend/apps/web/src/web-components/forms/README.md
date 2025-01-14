# forms

`display` is for the display components of a form. This contains the actual input area, etc. The api request senders are in `shared`, eg in `frontend/packages/shared/src/hooks/auth` for the login and logout related request senders.

The result of an api request is displayed by `FormResultInfoArea`, which in the case of success shows whatever message or component it should from `success-components`.
