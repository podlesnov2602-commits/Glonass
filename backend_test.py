import requests
import sys
import json
from datetime import datetime

class RealEstateAPITester:
    def __init__(self, base_url="https://propdeals-8.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json() if response.text else {}
                except:
                    return True, {}
            else:
                error_msg = f"Expected {expected_status}, got {response.status_code}"
                if response.text:
                    try:
                        error_data = response.json()
                        error_msg += f" - {error_data}"
                    except:
                        error_msg += f" - {response.text[:200]}"
                self.log_test(name, False, error_msg)
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log_test(name, False, f"Request error: {str(e)}")
            return False, {}
        except Exception as e:
            self.log_test(name, False, f"Unexpected error: {str(e)}")
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_get_all_properties(self):
        """Test getting all properties"""
        success, response = self.run_test("Get All Properties", "GET", "properties", 200)
        if success and isinstance(response, list):
            print(f"   Found {len(response)} properties")
            return success, response
        return success, []

    def test_get_property_by_id(self, property_id):
        """Test getting a single property by ID"""
        return self.run_test(f"Get Property {property_id}", "GET", f"properties/{property_id}", 200)

    def test_get_nonexistent_property(self):
        """Test getting a non-existent property"""
        fake_id = "nonexistent-property-id-12345"
        return self.run_test("Get Non-existent Property", "GET", f"properties/{fake_id}", 404)

    def test_create_property(self):
        """Test creating a new property"""
        test_property = {
            "title": "Test Property for API Testing",
            "description": "This is a test property created by automated testing",
            "price": 5000000,
            "location": "Test District, Moscow",
            "property_type": "apartment",
            "area": 85.5,
            "rooms": 3,
            "bathrooms": 2,
            "images": [
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
                "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800"
            ],
            "features": ["Balcony", "Parking", "Modern Kitchen"],
            "status": "available"
        }
        
        success, response = self.run_test("Create Property", "POST", "properties", 201, test_property)
        if success and 'id' in response:
            print(f"   Created property with ID: {response['id']}")
            return success, response['id']
        return success, None

    def test_update_property(self, property_id):
        """Test updating an existing property"""
        update_data = {
            "title": "Updated Test Property",
            "price": 5500000,
            "features": ["Balcony", "Parking", "Modern Kitchen", "Air Conditioning"]
        }
        
        return self.run_test(f"Update Property {property_id}", "PUT", f"properties/{property_id}", 200, update_data)

    def test_delete_property(self, property_id):
        """Test deleting a property"""
        return self.run_test(f"Delete Property {property_id}", "DELETE", f"properties/{property_id}", 200)

    def test_property_filters(self):
        """Test property filtering"""
        # Test filter by property type
        success1, _ = self.run_test("Filter by Property Type", "GET", "properties", 200, 
                                   params={"property_type": "apartment"})
        
        # Test filter by price range
        success2, _ = self.run_test("Filter by Price Range", "GET", "properties", 200, 
                                   params={"min_price": 1000000, "max_price": 10000000})
        
        # Test filter by location
        success3, _ = self.run_test("Filter by Location", "GET", "properties", 200, 
                                   params={"location": "Moscow"})
        
        # Test filter by status
        success4, _ = self.run_test("Filter by Status", "GET", "properties", 200, 
                                   params={"status": "available"})
        
        return success1 and success2 and success3 and success4

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Real Estate API Tests")
        print(f"   Base URL: {self.base_url}")
        print("=" * 60)

        # Test API root
        self.test_api_root()

        # Test getting all properties
        success, properties = self.test_get_all_properties()
        
        # Test getting individual properties if any exist
        if success and properties:
            # Test getting first property
            first_property = properties[0]
            if 'id' in first_property:
                self.test_get_property_by_id(first_property['id'])

        # Test getting non-existent property
        self.test_get_nonexistent_property()

        # Test property filtering
        self.test_property_filters()

        # Test CRUD operations
        success, created_id = self.test_create_property()
        if success and created_id:
            # Test updating the created property
            self.test_update_property(created_id)
            
            # Test getting the updated property
            self.test_get_property_by_id(created_id)
            
            # Test deleting the created property
            self.test_delete_property(created_id)

        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return 1

def main():
    tester = RealEstateAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())