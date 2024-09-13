from decouple import config
import requests
import json

class EthereumAPI:
    INFURA_URL = config('INFURA_URL')

    def __init__(self, wallet_address):
        self.wallet_address = wallet_address

    def get_balance(self):
        # Validate the Ethereum address before making the request
        if not EthereumAPI.is_valid_ethereum_address(self.wallet_address):
            return "Invalid Ethereum address"
        
        # Payload to get the balance of the wallet address
        payload = {
            "jsonrpc": "2.0",
            "method": "eth_getBalance",
            "params": [self.wallet_address, "latest"],
            "id": 1
        }

        response = self.make_request(payload)

        # Error handling
        if 'error' in response:
            return f"Error: {response['error']['message']}"
        
        # Balance is returned in Wei, convert it to Ether
        balance_in_wei = int(response['result'], 16)
        balance_in_ether = balance_in_wei / 10**18
        
        return balance_in_ether

    def make_request(self, payload):
        headers = {'Content-Type': 'application/json'}
        try:
            # Sending POST request to Infura
            response = requests.post(EthereumAPI.INFURA_URL, data=json.dumps(payload), headers=headers).json()
            return response
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}

    @staticmethod
    def is_valid_ethereum_address(address):
        # Static method to validate Ethereum addresses.
        return len(address) == 42 and address.startswith('0x')
