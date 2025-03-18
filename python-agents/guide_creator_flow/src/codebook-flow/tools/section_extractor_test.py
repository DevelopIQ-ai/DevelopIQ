import unittest
import os
from pathlib import Path
from section_extractor import SectionExtractorTool

class TestSectionExtractorTool(unittest.TestCase):
    def setUp(self):
        """Set up the test environment."""
        self.tool = SectionExtractorTool()
        
        # Get the path to the gas_city.html file
        current_dir = Path(__file__).parent.resolve()
        project_dir = current_dir.parent
        self.html_file_path = os.path.join(project_dir, 'gas_city.html')
        
        # Read the HTML content
        with open(self.html_file_path, 'r', encoding='utf-8') as f:
            self.html_content = f.read()
    
    def test_extract_section_with_number_only(self):
        """Test extracting a section using only section number."""
        result = self.tool._run(
            section_number="151.027",
            html_document=self.html_content
        )
        
        # Check that the extracted section contains the expected text
        self.assertIn("151.027", result)
        self.assertIn("PERMITTED USES", result)
        self.assertNotIn("151.028", result)  # Should not contain the next section
        print(result)
    # def test_extract_section_with_number_and_name(self):
    #     """Test extracting a section using section number and name."""
    #     result = self.tool._run(
    #         section_number="151.027",
    #         section_name="PERMITTED USES",
    #         html_document=self.html_content
    #     )
        
    #     # Check that the extracted section contains the expected text
    #     self.assertIn("151.027", result)
    #     self.assertIn("PERMITTED USES", result)
    #     self.assertNotIn("151.028", result)  # Should not contain the next section
    
    # def test_extract_nonexistent_section(self):
    #     """Test extracting a section that doesn't exist."""
    #     result = self.tool._run(
    #         section_number="999.999",
    #         html_document=self.html_content
    #     )
        
    #     # Should return a message indicating the section was not found
    #     self.assertIn("not found", result)
    
    # def test_extract_different_section(self):
    #     """Test extracting a different section."""
    #     result = self.tool._run(
    #         section_number="150.001",
    #         section_name="TITLE",
    #         html_document=self.html_content
    #     )
        
    #     # Check that the extracted section contains the expected text
    #     self.assertIn("150.001", result)
    #     self.assertIn("TITLE", result)
    #     self.assertNotIn("150.002", result)  # Should not contain the next section
        
    # def test_case_insensitivity(self):
    #     """Test that section name matching is case insensitive."""
    #     result = self.tool._run(
    #         section_number="151.027",
    #         section_name="permitted uses",  # Lowercase
    #         html_document=self.html_content
    #     )
        
    #     # Should still find the section despite case difference
    #     self.assertIn("151.027", result)
    #     self.assertIn("PERMITTED USES", result)
    
    # def test_empty_html_document(self):
    #     """Test handling of empty HTML document."""
    #     result = self.tool._run(
    #         section_number="151.027",
    #         html_document=""
    #     )
        
    #     # Should return a "not found" message
    #     self.assertIn("not found", result)
    
    # def test_section_content_validity(self):
    #     """Test that extracted content contains meaningful paragraphs from the section."""
    #     result = self.tool._run(
    #         section_number="150.001",
    #         html_document=self.html_content
    #     )
        
    #     # Verify that the result contains actual content from that section
    #     self.assertIn("Subdivision Regulations", result)
    #     self.assertIn("City of Gas City", result)
    
    # def test_section_boundary_detection(self):
    #     """Test that the tool correctly identifies section boundaries."""
    #     # Extract two consecutive sections
    #     section1 = self.tool._run(
    #         section_number="150.001",
    #         html_document=self.html_content
    #     )
        
    #     section2 = self.tool._run(
    #         section_number="150.002",
    #         html_document=self.html_content
    #     )
        
    #     # Check that sections are different and correctly bounded
    #     self.assertNotEqual(section1, section2)
    #     self.assertIn("TITLE", section1)
    #     self.assertIn("POLICY", section2)
        
    #     # Section 1 should not contain content exclusive to section 2
    #     unique_to_section2 = "declared policy of the city"
    #     self.assertNotIn(unique_to_section2, section1)
    #     self.assertIn(unique_to_section2, section2)

if __name__ == "__main__":
    unittest.main()
