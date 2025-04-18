import asyncio
import os
from typing import Optional
from dotenv import load_dotenv
from tenacity import retry, stop_after_attempt, wait_fixed, retry_if_exception_type
import httpx
from qdrant_client.http.exceptions import ResponseHandlingException

from qdrant_wrapper.qdrant_base import QdrantBase, DocumentStatus

# Load environment variables
load_dotenv()

class QdrantRechunk(QdrantBase):
    """Class for rechunking and purging operations in Qdrant."""
    
    def __init__(self):
        super().__init__()
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def purge_collection(self, document_id: str) -> bool:
        """
        Purge a collection from Qdrant.
        
        Args:
            document_id: The ID of the document/collection to purge
            
        Returns:
            bool: True if the collection was successfully purged, False otherwise
        """
        try:
            # Delete the collection
            await self.async_client.delete_collection(collection_name=document_id)
            print(f"Successfully purged collection {document_id}")
            return True
            
        except Exception as e:
            print(f"Error purging collection {document_id}: {e}")
            return False
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def clear_collection_points(self, document_id: str) -> bool:
        """
        Clear all points from a collection without deleting the collection itself.
        
        Args:
            document_id: The ID of the document/collection to clear
            
        Returns:
            bool: True if the points were successfully cleared, False otherwise
        """
        try:
            # Check if collection exists first
            status = await self.document_exists_and_is_indexed(document_id)
            
            if status == DocumentStatus.NOT_EXISTS:
                print(f"Collection {document_id} does not exist. Nothing to clear.")
                return True
                
            if status == DocumentStatus.EMPTY:
                print(f"Collection {document_id} is already empty.")
                return True
                
            # Delete all points in the collection
            await self.async_client.delete(
                collection_name=document_id,
                points_selector=None  # None means delete all points
            )
            print(f"Successfully cleared all points from collection {document_id}")
            return True
            
        except Exception as e:
            print(f"Error clearing points from collection {document_id}: {e}")
            return False
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def purge_all_collections(self) -> bool:
        """
        Purge all collections from Qdrant.
        
        Returns:
            bool: True if all collections were successfully purged, False if any failed
        """
        try:
            # Get list of all collections
            collections_response = await self.async_client.get_collections()
            collections = [collection.name for collection in collections_response.collections]
            
            if not collections:
                print("No collections found to purge.")
                return True
            
            print(f"Found {len(collections)} collections to purge: {collections}")
            
            # Purge each collection
            results = []
            for collection_name in collections:
                result = await self.purge_collection(collection_name)
                results.append(result)
            
            # Return True only if all purges were successful
            return all(results)
            
        except Exception as e:
            print(f"Error purging all collections: {e}")
            return False
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def clear_all_collection_points(self) -> bool:
        """
        Clear all points from all collections without deleting the collections themselves.
        
        Returns:
            bool: True if all collections were successfully cleared, False if any failed
        """
        try:
            # Get list of all collections
            collections_response = await self.async_client.get_collections()
            collections = [collection.name for collection in collections_response.collections]
            
            if not collections:
                print("No collections found to clear.")
                return True
            
            print(f"Found {len(collections)} collections to clear: {collections}")
            
            # Clear each collection
            results = []
            for collection_name in collections:
                result = await self.clear_collection_points(collection_name)
                results.append(result)
            
            # Return True only if all clears were successful
            return all(results)
            
        except Exception as e:
            print(f"Error clearing all collections: {e}")
            return False
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def repopulate_collections(self, counties: list[dict]) -> dict:
        """
        Repopulate Qdrant collections for a list of counties.
        
        Args:
            counties: List of dictionaries with municipality, state_code, and zone_code
                     Example: [{"municipality": "ALBANY", "state_code": "IN", "zone_code": "R-R"}]
        
        Returns:
            dict: Results of the repopulation process with county names as keys and success status as values
        """
        from agent_graphs.extractor_graph import extractor_graph
        
        results = {}
        
        for county in counties:
            try:
                municipality = county.get("municipality")
                state_code = county.get("state_code")
                zone_code = county.get("zone_code", "")
                
                if not municipality or not state_code:
                    print(f"Skipping invalid county data: {county}")
                    results[f"{municipality}_{state_code}"] = False
                    continue
                
                print(f"Processing {municipality}, {state_code}")
                
                # Create initial state for the extractor graph
                initial_state = {
                    "document_id": "",
                    "document_content": "",
                    "section_list": {},
                    "municipality": municipality,
                    "state_code": state_code,
                    "zone_code": zone_code
                }
                
                # Configuration for the extractor graph
                config = {
                    "configurable": {
                        "model_name": "gpt-4o-mini",
                        "test_mode": False
                    }
                }
                
                # Run the extractor graph to fetch, parse, and chunk the document
                final_state = await extractor_graph.ainvoke(initial_state, config)
                
                document_id = final_state.get("document_id", "")
                if document_id:
                    status = await self.document_exists_and_is_indexed(document_id)
                    if status in [DocumentStatus.INDEXED, DocumentStatus.UDC]:
                        print(f"Successfully repopulated collection for {municipality}, {state_code}")
                        results[document_id] = True
                    else:
                        print(f"Failed to repopulate collection for {municipality}, {state_code}")
                        results[document_id] = False
                else:
                    print(f"Failed to get document_id for {municipality}, {state_code}")
                    results[f"{municipality}_{state_code}"] = False
                    
            except Exception as e:
                print(f"Error repopulating collection for {county}: {e}")
                county_id = f"{county.get('municipality', 'unknown')}_{county.get('state_code', 'unknown')}"
                results[county_id] = False
        
        return results 
    
    @retry(
        stop=stop_after_attempt(5),
        wait=wait_fixed(15),
        retry=retry_if_exception_type((httpx.ConnectTimeout, ResponseHandlingException))
    )
    async def purge_and_repopulate(self, counties: list[dict]) -> dict:
        """
        Comprehensive method that purges all collections and then repopulates with the provided counties.
        
        Args:
            counties: List of dictionaries with municipality, state_code, and zone_code
                     Example: [{"municipality": "ALBANY", "state_code": "IN", "zone_code": "R-R"}]
        
        Returns:
            dict: {
                "purge_success": bool,
                "total_counties": int,
                "successful_counties": int,
                "failed_counties": int,
                "county_results": dict  # Detailed results for each county
            }
        """
        result_summary = {
            "purge_success": False,
            "total_counties": len(counties),
            "successful_counties": 0,
            "failed_counties": 0,
            "county_results": {}
        }
        
        # Step 1: Purge all existing collections
        print("Step 1: Purging all existing collections...")
        purge_success = await self.purge_all_collections()
        result_summary["purge_success"] = purge_success
        
        if not purge_success:
            print("Warning: Failed to purge all collections. Continuing with repopulation...")
        
        # Step 2: Repopulate with new documents
        print(f"Step 2: Repopulating database with {len(counties)} counties...")
        county_results = await self.repopulate_collections(counties)
        result_summary["county_results"] = county_results
        
        # Count successes and failures
        successful_counties = sum(1 for success in county_results.values() if success)
        result_summary["successful_counties"] = successful_counties
        result_summary["failed_counties"] = len(counties) - successful_counties
        
        # Summary
        print(f"\nDatabase rechunking complete:")
        print(f"- Purge successful: {purge_success}")
        print(f"- Total counties processed: {len(counties)}")
        print(f"- Successfully added: {successful_counties}")
        print(f"- Failed to add: {len(counties) - successful_counties}")
        
        return result_summary 
    

if __name__ == "__main__":
    qdrant_rechunk = QdrantRechunk()
    counties = indiana_municipalities = [
    {"municipality": "ADAMS COUNTY", "state_code": "IN"},
    {"municipality": "ALBANY", "state_code": "IN"},
    {"municipality": "BARGERSVILLE", "state_code": "IN"},
    {"municipality": "BEDFORD", "state_code": "IN"},
    {"municipality": "BEECH GROVE", "state_code": "IN"},
    {"municipality": "BOONE COUNTY", "state_code": "IN"},
    {"municipality": "BRAZIL", "state_code": "IN"},
    {"municipality": "BROWNSBURG", "state_code": "IN"},
    {"municipality": "CARMEL", "state_code": "IN"},
    {"municipality": "CENTERVILLE", "state_code": "IN"},
    {"municipality": "CHARLESTOWN", "state_code": "IN"},
    {"municipality": "CLARKSVILLE", "state_code": "IN"},
    {"municipality": "CLINTON", "state_code": "IN"},
    {"municipality": "CLOVERDALE", "state_code": "IN"},
    {"municipality": "COLUMBUS", "state_code": "IN"},
    {"municipality": "CRAWFORDSVILLE", "state_code": "IN"},
    {"municipality": "CULVER", "state_code": "IN"},
    {"municipality": "DANVILLE", "state_code": "IN"},
    {"municipality": "EAST CHICAGO", "state_code": "IN"},
    {"municipality": "EDINBURGH", "state_code": "IN"},
    {"municipality": "ELKHART", "state_code": "IN"},
    {"municipality": "ELKHART COUNTY", "state_code": "IN"},
    {"municipality": "ELLETTSVILLE", "state_code": "IN"},
    {"municipality": "ELNORA", "state_code": "IN"},
    {"municipality": "FARMLAND", "state_code": "IN"},
    {"municipality": "FISHERS", "state_code": "IN"},
    {"municipality": "FORTVILLE", "state_code": "IN"},
    {"municipality": "FORT WAYNE", "state_code": "IN"},
    {"municipality": "FRANKFORT", "state_code": "IN"},
    {"municipality": "FREMONT", "state_code": "IN"},
    {"municipality": "GAS CITY", "state_code": "IN"},
    {"municipality": "GEORGETOWN", "state_code": "IN"},
    {"municipality": "GOODLAND", "state_code": "IN"},
    {"municipality": "GREENDALE", "state_code": "IN"},
    {"municipality": "GREENE COUNTY", "state_code": "IN"},
    {"municipality": "GREENFIELD", "state_code": "IN"},
    {"municipality": "GREENSBURG", "state_code": "IN"},
    {"municipality": "GREENTOWN", "state_code": "IN"},
    {"municipality": "GREENVILLE", "state_code": "IN"},
    {"municipality": "GREENWOOD", "state_code": "IN"},
    {"municipality": "HAGERSTOWN", "state_code": "IN"},
    {"municipality": "HAMILTON", "state_code": "IN"},
    {"municipality": "HANCOCK COUNTY", "state_code": "IN"},
    {"municipality": "HANOVER", "state_code": "IN"},
    {"municipality": "HARTFORD CITY", "state_code": "IN"},
    {"municipality": "JAMESTOWN", "state_code": "IN"},
    {"municipality": "KNOX COUNTY", "state_code": "IN"},
    {"municipality": "KOKOMO", "state_code": "IN"},
    {"municipality": "LAWRENCE", "state_code": "IN"},
    {"municipality": "LAWRENCEBURG", "state_code": "IN"},
    {"municipality": "LEBANON", "state_code": "IN"},
    {"municipality": "MADISON", "state_code": "IN"},
    {"municipality": "MARION", "state_code": "IN"},
    {"municipality": "MONROEVILLE", "state_code": "IN"},
    {"municipality": "MONROVIA", "state_code": "IN"},
    {"municipality": "MONTICELLO", "state_code": "IN"},
    {"municipality": "MOORES HILL", "state_code": "IN"},
    {"municipality": "MOORESVILLE", "state_code": "IN"},
    {"municipality": "MOUNT VERNON", "state_code": "IN"},
    {"municipality": "NEW ALBANY", "state_code": "IN"},
    {"municipality": "NEWBURGH", "state_code": "IN"},
    {"municipality": "NEW CASTLE", "state_code": "IN"},
    {"municipality": "NEW PALESTINE", "state_code": "IN"},
    {"municipality": "OWEN COUNTY", "state_code": "IN"},
    {"municipality": "PERU", "state_code": "IN"},
    {"municipality": "PLAINFIELD", "state_code": "IN"},
    {"municipality": "RICHMOND", "state_code": "IN"},
    {"municipality": "SELLERSBURG", "state_code": "IN"},
    {"municipality": "SEYMOUR", "state_code": "IN"},
    {"municipality": "SHELBYVILLE", "state_code": "IN"},
    {"municipality": "SHERIDAN", "state_code": "IN"},
    {"municipality": "VINCENNES", "state_code": "IN"},
    {"municipality": "WARRICK COUNTY", "state_code": "IN"},
    {"municipality": "WEST TERRE HAUTE", "state_code": "IN"},
    {"municipality": "YORKTOWN", "state_code": "IN"},
    {"municipality": "ZIONSVILLE", "state_code": "IN"}
]
    asyncio.run(qdrant_rechunk.purge_and_repopulate(counties))