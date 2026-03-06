1. Go to Aegis Cre Repo

2. Sign the payload. ( .env file of the /testing directory should be set. Update nonce as well )
```bash
cd testing && echo '{"user": "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7", "merchant": "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7", "amount": 18, "nonce": 0}' | node sig-gen-minimal.js
```

3. Simulate CRE triggered authorize function call. User signed signature get relayed by the Merchant. ( Replace the signature and nonce )
```bash
cre workflow simulate ./aegis-workflow --http-payload '{"functionName": "authorize", "user": "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7", "merchant": "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7", "merchantType": "RIDE_SHARE", "amount": 18, "nonce": 0, "signature": "YOUR_SIGNATURE"}' --target local-simulation --non-interactive --trigger-index 0 --broadcast
```

** Explain AI Fraud Detection**
** Display the transactions portal's authorization log**
** Click transaction hash and go to the transaction in Sepolia Etherscan and internal transaction in Tenderly**
** Copy authorization log's document id for the next step**

4. Due to Route change, Duber Merchant increments the authorization ( Use the authorization log ID from the previous step )
```bash
cre workflow simulate ./aegis-workflow --http-payload '{"functionName": "secureIncrement", "merchantType": "RIDE_SHARE", "user": "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7", "merchant": "0x9F77cBDb561aaD32b403695306e3eea53F9B40e7", "currentAuth": 18, "requestedTotal": 30, "reason": "Major traffic on I-95 — alternate route adds 12 miles", "authorizationLogId": "1772076522483_62266"}' --target local-simulation --non-interactive --trigger-index 0 --broadcast
```

** Explain AI Risk assesment**
** Display the transactions portal's secureIncrement log**
** Click transaction hash and go to the transaction in Sepolia Etherscan**

5. Go to Aegis Contracts Repo

6. Ride ends. 26 USD get captured. 4 USD get refunded back to the user.
```bash
make capture-funds PROTOCOL=0x41259482E8F1b654e4E7d3d0DCF12B28670c5d44 USER_ADDRESS=0x9F77cBDb561aaD32b403695306e3eea53F9B40e7 AMOUNT=26 FLAGS=--broadcast
```

7. Write captured funds logs by simulating the capture-funds log trigger. This should happen automatically in production. ( Get tx hash from the previous step )
```bash
cre workflow simulate ./aegis-workflow \
  --non-interactive --trigger-index 1 \
  --evm-tx-hash YOUR_TX_HASH \
  --evm-event-index 1 \
  --target local-simulation
```

8. Write Funds released logs to firestore
```bash
cre workflow simulate ./aegis-workflow \
  --non-interactive --trigger-index 2 \
  --evm-tx-hash YOUR_TX_HASH \
  --evm-event-index 0 \
  --target local-simulation
```