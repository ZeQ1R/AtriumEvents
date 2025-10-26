import requests
import sys
import json
from datetime import datetime, timedelta

class WeddingSalonAPITester:
    def __init__(self, base_url="https://elegant-vows-5.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json() if response.text else {}
                except:
                    response_data = {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"Response: {response.text}")
                response_data = {}

            self.test_results.append({
                "test": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": response_data
            })

            return success, response_data

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({
                "test": name,
                "method": method,
                "endpoint": endpoint,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "error": str(e)
            })
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_create_booking(self):
        """Test creating a booking"""
        future_date = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")
        booking_data = {
            "customer_name": "John & Jane Doe",
            "email": "test@example.com",
            "phone": "+1-555-123-4567",
            "booking_date": future_date,
            "time_slot": "morning",
            "event_type": "Wedding Ceremony",
            "guest_count": 150,
            "special_requests": "Vegetarian menu preferred"
        }
        
        success, response = self.run_test("Create Booking", "POST", "bookings", 201, booking_data)
        return success, response.get('id') if success else None

    def test_get_all_bookings(self):
        """Test getting all bookings"""
        return self.run_test("Get All Bookings", "GET", "bookings", 200)

    def test_get_booking_by_id(self, booking_id):
        """Test getting a specific booking"""
        if not booking_id:
            print("❌ Skipping - No booking ID available")
            return False, {}
        return self.run_test("Get Booking by ID", "GET", f"bookings/{booking_id}", 200)

    def test_update_booking_status(self, booking_id):
        """Test updating booking status"""
        if not booking_id:
            print("❌ Skipping - No booking ID available")
            return False, {}
        update_data = {"status": "confirmed"}
        return self.run_test("Update Booking Status", "PUT", f"bookings/{booking_id}", 200, update_data)

    def test_check_availability(self):
        """Test checking availability for a date"""
        future_date = (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d")
        availability_data = {"booking_date": future_date}
        return self.run_test("Check Availability", "POST", "availability", 200, availability_data)

    def test_get_availability_range(self):
        """Test getting availability range"""
        start_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        end_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        return self.run_test("Get Availability Range", "GET", f"availability/range?start_date={start_date}&end_date={end_date}", 200)

    def test_delete_booking(self, booking_id):
        """Test deleting a booking"""
        if not booking_id:
            print("❌ Skipping - No booking ID available")
            return False, {}
        return self.run_test("Delete Booking", "DELETE", f"bookings/{booking_id}", 200)

    def test_duplicate_booking_prevention(self):
        """Test that duplicate bookings are prevented"""
        future_date = (datetime.now() + timedelta(days=5)).strftime("%Y-%m-%d")
        booking_data = {
            "customer_name": "Test User",
            "email": "duplicate@example.com",
            "phone": "+1-555-999-8888",
            "booking_date": future_date,
            "time_slot": "afternoon",
            "event_type": "Wedding",
            "guest_count": 100
        }
        
        # Create first booking
        success1, response1 = self.run_test("Create First Booking", "POST", "bookings", 201, booking_data)
        booking_id = response1.get('id') if success1 else None
        
        # Try to create duplicate booking
        success2, _ = self.run_test("Create Duplicate Booking (Should Fail)", "POST", "bookings", 400, booking_data)
        
        # Clean up
        if booking_id:
            self.test_delete_booking(booking_id)
        
        return success1 and not success2

def main():
    print("🚀 Starting Wedding Salon API Tests...")
    tester = WeddingSalonAPITester()
    
    # Test basic connectivity
    print("\n=== Basic Connectivity Tests ===")
    tester.test_root_endpoint()
    
    # Test booking CRUD operations
    print("\n=== Booking CRUD Tests ===")
    success, booking_id = tester.test_create_booking()
    tester.test_get_all_bookings()
    tester.test_get_booking_by_id(booking_id)
    tester.test_update_booking_status(booking_id)
    
    # Test availability endpoints
    print("\n=== Availability Tests ===")
    tester.test_check_availability()
    tester.test_get_availability_range()
    
    # Test business logic
    print("\n=== Business Logic Tests ===")
    tester.test_duplicate_booking_prevention()
    
    # Clean up test booking
    if booking_id:
        print("\n=== Cleanup ===")
        tester.test_delete_booking(booking_id)
    
    # Print final results
    print(f"\n📊 Final Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    # Save detailed results
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump({
            "summary": {
                "total_tests": tester.tests_run,
                "passed_tests": tester.tests_passed,
                "success_rate": f"{(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "0%"
            },
            "detailed_results": tester.test_results
        }, f, indent=2)
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())