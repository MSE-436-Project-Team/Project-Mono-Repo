from dotenv import load_dotenv
import os
from supabase import create_client, Client

class SupaBaseClient:
    """
    A class to manage the connection to a Supabase database.
    """

    def __init__(self):
        """
        Initializes the SupaBaseClient with environment variables.
        """
        load_dotenv()
        self.supabase_url = os.getenv("SUPABASE_URL")
        if not self.supabase_url:
            raise ValueError("SUPABASE_URL environment variable is not set.")
        self.supabase_key = os.getenv("SUPABASE_KEY")  
        if not self.supabase_key:
            raise ValueError("SUPABASE_KEY environment variable is not set.")
        self.client: Client = create_client(self.supabase_url, self.supabase_key)

    def get_client(self) -> Client:
        """
        Returns the Supabase client instance.
        """
        return self.client
    
    def ping(self) -> bool:
        """
        Checks if the Supabase client is connected by performing a simple query.
        Returns True if connected, False otherwise.
        """
        try:
            response = self.client.rpc("echo", { "say": "👋" }).execute()
            return response.data == "👋"
        except Exception as e:
            print(f"Ping failed: {e}")
            return False


# Example usage:
if __name__ == "__main__":
    supabase_client = SupaBaseClient()
    if supabase_client.ping():
        print("Connected to Supabase!")
    else:
        print("Failed to connect to Supabase.")   
