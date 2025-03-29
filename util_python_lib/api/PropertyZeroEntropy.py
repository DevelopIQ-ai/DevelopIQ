import requests
import base64
from zeroentropy import ZeroEntropy

class PropertyZeroEntropy(ZeroEntropy):
    """
    A convenience subclass of ZeroEntropy that ties a single collection_name
    to all operations, plus some helper methods for PDF uploads and queries.
    """

    def __init__(self, api_key: str, collection_name: str):
        """
        Initialize the client with an API key and a default collection name.
        """
        super().__init__(api_key=api_key)
        self.collection_name = collection_name

    def process_pdf(self, url: str) -> str:
        """
        Downloads a PDF from `url`, base64-encodes it, and uploads it to the
        current collection. The `path` is automatically generated from the URL's filename.
        Returns a success or error string.
        """
        try:
            pdf_resp = requests.get(url, timeout=10)
            pdf_resp.raise_for_status()
            base64_content = base64.b64encode(pdf_resp.content).decode("utf-8")
            filename = url.split("/")[-1] or "document.pdf"
            short_path = f"{self.collection_name}_{filename}"
            self.documents.add(
                collection_name=self.collection_name,
                path=short_path,
                content={
                    "type": "auto",
                    "base64_data": base64_content,
                }
            )
            print(f"PDF uploaded successfully to collection '{self.collection_name}' at path '{short_path}'")
            return f"PDF uploaded successfully to collection '{self.collection_name}' at path '{short_path}'"
        except Exception as e:
            return f"Error processing {url}: {e}"

    def process_text_file(self, file_path: str, document_name: str = None) -> str:
        """
        Reads a text file from the local `file_path` and uploads its content to the
        current collection. The document name in ZeroEntropy can be specified or will be 
        derived from the file path.
        Returns a success or error string.
        """
        try:
            # Read the text file
            with open(file_path, 'r', encoding='utf-8') as file:
                text_content = file.read()
            
            # Generate document name if not provided
            if not document_name:
                document_name = file_path.split("/")[-1]
            
            # Create a unique path for the document in ZeroEntropy
            short_path = f"{document_name}"
            
            print(short_path)
            print(text_content)
            self.documents.add(
                collection_name=self.collection_name,
                path=short_path,
                content={
                    "type": "text",
                    "text": text_content,
                }
            )
            print(f"Text file uploaded successfully to collection '{self.collection_name}' at path '{short_path}'")
            return f"Text file uploaded successfully to collection '{self.collection_name}' at path '{short_path}'"
        except Exception as e:
            return f"Error processing text file {file_path}: {e}"

    def get_collection_info(self):
        """
        Returns a list of documents in this collection.
        """
        resp = self.documents.get_info_list(collection_name=self.collection_name)
        return resp

    def get_top_documents(self, query: str, k: int = 5):
        """
        Returns the top K documents for a given query in this collection.
        """
        resp = self.queries.top_documents(
            collection_name=self.collection_name,
            query=query,
            k=k,
        )
        return resp.results

    def get_snippets_info(self, query: str, k: int = 5):
        """
        Returns the top K snippets for a given query in this collection.
        """
        resp = self.queries.top_snippets(
            collection_name=self.collection_name,
            query=query,
            k=k,
        )
        return resp.results
    
    def get_pages_info(self, query: str, k: int = 5):
        """
        Returns the top K pages for a given query in this collection.
        """
        resp = self.queries.top_pages(
            collection_name=self.collection_name,
            query=query,
            k=k,
        )
        return resp.results
    
    def get_info_by_id(self, id: str):
        """
        Returns the top K documents for a given query in this collection.
        """
        resp = self.documents.get_info(collection_name=self.collection_name, id=id)
        return resp.results
    


if __name__ == "__main__":
    property_zero_entropy = PropertyZeroEntropy(api_key="ze_W2oJBSioD2e0ciuq", collection_name="PA")
    # property_zero_entropy.process_text_file("/Users/kushbhuwalka/Documents/projects/PropertyAI/philadelphia.txt",
    #                                          "philadelphia")
    col = property_zero_entropy.get_collection_info()
    print(col)