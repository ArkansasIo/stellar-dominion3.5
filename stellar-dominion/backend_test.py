import requests
import sys
import json
from datetime import datetime

class StellarDominionAPITester:
    def __init__(self, base_url="https://26f3f83a-f4af-4064-a1b4-5797c1417aeb.preview.emergentagent.com"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=15, use_auth=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}
        
        # Add auth header if needed
        if use_auth and self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        if data:
            print(f"   Data: {json.dumps(data, indent=2)[:200]}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout, cookies={'session_token': self.session_token} if self.session_token else None)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:300]}...")
                    return success, response_data
                except:
                    print(f"   Response: {response.text[:200]}...")
                    return success, response.text
            else:
                self.failed_tests.append({
                    "name": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:300]}...")
                return success, None

        except requests.exceptions.Timeout:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": "Timeout"
            })
            print(f"❌ Failed - Request timeout")
            return False, None
        except requests.exceptions.ConnectionError as e:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": f"Connection error: {str(e)}"
            })
            print(f"❌ Failed - Connection error: {str(e)}")
            return False, None
        except Exception as e:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_health_endpoints(self):
        """Test health and status endpoints"""
        print("\n🔧 Testing Health Endpoints...")
        
        # Test basic health
        self.run_test("Root Health Check", "GET", "health", 200)
        
        # Test API health
        self.run_test("API Health Check", "GET", "api/health", 200)
        
        # Test API status
        self.run_test("API Status Check", "GET", "api/status", 200)

    def test_auth_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Test user login with specified credentials
        login_data = {"username": "testuser3", "password": "testpass123"}
        success, response = self.run_test("User Login", "POST", "api/auth/login", 200, login_data)
        
        if success and response:
            print(f"✅ Login successful. Session token set.")
            self.user_id = response.get('userId')
            self.session_token = response.get('token')
        else:
            # Try registration if login fails
            register_data = {"username": "testuser3", "password": "testpass123"}
            success, response = self.run_test("User Registration", "POST", "api/auth/register", 200, register_data)
            
            if success and response:
                print(f"✅ Registration successful. User ID: {response.get('userId')}")
                self.user_id = response.get('userId')
                self.session_token = response.get('token')
        
        # Test auth user endpoint
        self.run_test("Get Auth User", "GET", "api/auth/user", 200, use_auth=True)
        
        # Test get current user
        self.run_test("Get Current User Info", "GET", "api/auth/me", 200, use_auth=True)

    def test_player_setup(self):
        """Test player setup flow"""
        print("\n👤 Testing Player Setup...")
        
        if not self.session_token:
            print("❌ Skipping player setup - no session token")
            return
        
        # Test player setup
        setup_data = {
            "planetName": "Test Colony",
            "commanderType": "militarist",
            "governmentType": "democracy",
            "faction": "terran"
        }
        success, response = self.run_test("Player Setup", "POST", "api/player/setup", 200, setup_data, use_auth=True)
        
        if success:
            print(f"✅ Player setup completed successfully")

    def test_game_state(self):
        """Test game state endpoints"""
        print("\n🎮 Testing Game State...")
        
        if not self.session_token:
            print("❌ Skipping game state tests - no session token")
            return
        
        # Test get player state
        self.run_test("Get Player State", "GET", "api/player/state", 200, use_auth=True)
        
        # Test get game state
        self.run_test("Get Game State", "GET", "api/game/state", 200, use_auth=True)

    def test_buildings_system(self):
        """Test buildings system"""
        print("\n🏗️ Testing Buildings System...")
        
        if not self.session_token:
            print("❌ Skipping buildings tests - no session token")
            return
        
        # Test get building costs
        self.run_test("Get Building Costs", "GET", "api/buildings/costs", 200, use_auth=True)
        
        # Test building upgrade
        upgrade_data = {"buildingType": "metalMine"}
        success, response = self.run_test("Upgrade Building", "POST", "api/buildings/upgrade", 200, upgrade_data, use_auth=True)
        
        if success:
            print(f"✅ Building upgrade successful")

    def test_research_system(self):
        """Test research system"""
        print("\n🔬 Testing Research System...")
        
        if not self.session_token:
            print("❌ Skipping research tests - no session token")
            return
        
        # Test get available research
        self.run_test("Get Available Research", "GET", "api/research/available", 200, use_auth=True)
        
        # Test start research
        research_data = {"techId": "energyTechnology"}
        success, response = self.run_test("Start Research", "POST", "api/research/start", 200, research_data, use_auth=True)
        
        if success:
            print(f"✅ Research started successfully")

    def test_shipyard_system(self):
        """Test shipyard system"""
        print("\n🚀 Testing Shipyard System...")
        
        if not self.session_token:
            print("❌ Skipping shipyard tests - no session token")
            return
        
        # Test get available ships
        self.run_test("Get Available Ships", "GET", "api/shipyard/available", 200, use_auth=True)
        
        # Test build ships
        ship_data = {"shipType": "lightFighter", "quantity": 1}
        success, response = self.run_test("Build Ships", "POST", "api/shipyard/build", 200, ship_data, use_auth=True)
        
        if success:
            print(f"✅ Ship building successful")

    def test_galaxy_system(self):
        """Test galaxy system"""
        print("\n🌌 Testing Galaxy System...")
        
        if not self.session_token:
            print("❌ Skipping galaxy tests - no session token")
            return
        
        # Test galaxy view
        self.run_test("Get Galaxy View", "GET", "api/galaxy/1/1", 200, use_auth=True)
        
        # Test universe overview
        self.run_test("Get Universe Overview", "GET", "api/universe/overview", 200, use_auth=True)

    def test_leaderboard(self):
        """Test leaderboard system"""
        print("\n🏆 Testing Leaderboard System...")
        
        if not self.session_token:
            print("❌ Skipping leaderboard tests - no session token")
            return
        
        # Test leaderboard
        self.run_test("Get Leaderboard", "GET", "api/leaderboard", 200, use_auth=True)

    def test_v15_config_endpoints(self):
        """Test v1.5 configuration endpoints"""
        print("\n⚙️  Testing v1.5 Configuration Endpoints...")
        
        if not self.session_token:
            print("❌ Skipping config tests - no session token")
            return
        
        # Test planet classes config (should return 12 classes)
        success, response = self.run_test("Planet Classes Config", "GET", "api/config/planet-classes", 200, use_auth=True)
        if success and response:
            classes = response if isinstance(response, dict) else {}
            print(f"   Found {len(classes)} planet classes")
            expected_classes = ["M", "O", "L", "H", "P", "Y", "J", "K", "D", "T", "N", "R"]
            for cls in expected_classes[:3]:  # Check first few
                if cls in classes:
                    print(f"   ✓ Found {cls} class: {classes[cls].get('name', 'Unknown')}")
        
        # Test biomes config (should return 90 biomes)
        success, response = self.run_test("Biomes Config", "GET", "api/config/biomes", 200, use_auth=True)
        if success and response:
            biomes = response if isinstance(response, list) else []
            print(f"   Found {len(biomes)} biomes")
            if len(biomes) >= 90:
                print(f"   ✓ Expected 90 biomes, found {len(biomes)}")
            else:
                print(f"   ⚠️ Expected 90 biomes, only found {len(biomes)}")
        
        # Test lifeforms config 
        success, response = self.run_test("Lifeforms Config", "GET", "api/config/lifeforms", 200, use_auth=True)
        if success and response:
            lifeforms = response if isinstance(response, dict) else {}
            print(f"   Found {len(lifeforms)} lifeforms")
            if "cetus" in lifeforms:
                cetus_bonus = lifeforms["cetus"].get("bonuses", {}).get("field_bonus", 0)
                print(f"   ✓ Cetus field bonus: +{cetus_bonus} fields")
        
        # Test player classes config
        success, response = self.run_test("Player Classes Config", "GET", "api/config/player-classes", 200, use_auth=True)
        if success and response:
            classes = response if isinstance(response, dict) else {}
            print(f"   Found {len(classes)} player classes")
            if "discoverer" in classes:
                disc_bonus = classes["discoverer"].get("bonuses", {}).get("planet_size_bonus", 0)
                print(f"   ✓ Discoverer planet size bonus: +{disc_bonus*100}%")

    def test_v15_combat_config(self):
        """Test v1.5 combat configuration"""
        print("\n⚔️  Testing v1.5 Combat Configuration...")
        
        if not self.session_token:
            print("❌ Skipping combat config tests - no session token")
            return
        
        # Test combat config
        success, response = self.run_test("Combat Config", "GET", "api/config/combat", 200, use_auth=True)
        if success and response:
            config = response.get("config", {}) if isinstance(response, dict) else {}
            max_rounds = config.get("max_rounds", 0)
            min_rounds = config.get("min_rounds", 0)
            print(f"   Combat rounds: {min_rounds}-{max_rounds}")
            if max_rounds == 15:
                print(f"   ✓ Correct 15-round system")
            else:
                print(f"   ⚠️ Expected 15 rounds, found {max_rounds}")
            
            # Check for ship stats
            ship_stats = response.get("shipStats", {})
            if ship_stats:
                print(f"   Ship stats available: {len(ship_stats)} ship types")
            
            defense_stats = response.get("defenseStats", {})
            if defense_stats:
                print(f"   Defense stats available: {len(defense_stats)} defense types")

    def test_v15_station_types(self):
        """Test v1.5 space station types"""
        print("\n🚀 Testing v1.5 Station Types...")
        
        if not self.session_token:
            print("❌ Skipping station types tests - no session token")
            return
        
        # Test station types (should return 8 types)
        success, response = self.run_test("Station Types", "GET", "api/stations/types", 200, use_auth=True)
        if success and response:
            stations = response if isinstance(response, dict) else {}
            print(f"   Found {len(stations)} station types")
            if len(stations) == 8:
                print(f"   ✓ Expected 8 station types found")
            else:
                print(f"   ⚠️ Expected 8 station types, found {len(stations)}")
            
            # Check for key station types
            expected_types = ["orbital_station", "starbase", "moonbase", "trading_post"]
            for station_type in expected_types:
                if station_type in stations:
                    station_info = stations[station_type]
                    print(f"   ✓ {station_info.get('name', station_type)}: {station_info.get('max_fields', 0)} fields")

    def test_v15_field_size_categories(self):
        """Test field size categories endpoint"""
        print("\n📏 Testing Field Size Categories...")
        
        if not self.session_token:
            print("❌ Skipping field size tests - no session token")
            return
        
        # Test field size categories
        success, response = self.run_test("Field Size Categories", "GET", "api/config/field-sizes", 200, use_auth=True)
        if success and response:
            categories = response if isinstance(response, dict) else {}
            print(f"   Found {len(categories)} size categories")
            
            # Check for key categories
            expected_cats = ["normal", "large", "huge", "massive"]
            for cat in expected_cats:
                if cat in categories:
                    cat_info = categories[cat]
                    print(f"   ✓ {cat_info.get('label', cat)}: {cat_info.get('min', 0)}-{cat_info.get('max', 0)} fields")

    def test_v15_enhanced_player_setup(self):
        """Test enhanced player setup with playerClass and lifeform"""
        print("\n👤 Testing Enhanced Player Setup...")
        
        if not self.session_token:
            print("❌ Skipping enhanced player setup - no session token")
            return
        
        # Test player setup with Discoverer class and Cetus lifeform
        setup_data = {
            "planetName": "Test Colony v1.5",
            "commanderType": "militarist",
            "governmentType": "democracy", 
            "faction": "terran",
            "playerClass": "discoverer",  # +10% planet size bonus
            "lifeform": "cetus"          # +25 fields bonus
        }
        success, response = self.run_test("Enhanced Player Setup", "POST", "api/player/setup", 200, setup_data, use_auth=True)
        
        if success and response:
            planet_data = response.get("planetType", {})
            base_fields = planet_data.get("baseFields", 0)
            max_fields = planet_data.get("maxFields", 0)
            print(f"   Planet fields: {base_fields} base, {max_fields} max")
            
            # Check for bonuses
            if max_fields > base_fields:
                bonus = max_fields - base_fields
                print(f"   ✓ Field bonuses applied: +{bonus} fields")
            
            # Check lifeform and class
            if response.get("lifeform") == "cetus":
                print(f"   ✓ Cetus lifeform applied")
            if response.get("playerClass") == "discoverer":
                print(f"   ✓ Discoverer class applied")

    def test_v15_planet_colonization(self):
        """Test planet colonization system"""
        print("\n🌍 Testing Planet Colonization...")
        
        if not self.session_token:
            print("❌ Skipping colonization tests - no session token")
            return
        
        # First check planets endpoint
        success, response = self.run_test("Get Player Planets", "GET", "api/planets?page=1&per_page=25", 200, use_auth=True)
        if success and response:
            planets = response.get("planets", [])
            pagination = response.get("pagination", {})
            print(f"   Current planets: {len(planets)}")
            print(f"   Pagination: page {pagination.get('page', 1)}/{pagination.get('totalPages', 1)}")
            
            # Check pagination range (15-100 per page)
            per_page = pagination.get("perPage", 25)
            if 15 <= per_page <= 100:
                print(f"   ✓ Pagination within range: {per_page} per page")
            else:
                print(f"   ⚠️ Pagination outside expected range: {per_page}")

    def test_v15_combat_simulation(self):
        """Test combat simulation with 1-15 rounds"""
        print("\n⚔️  Testing Combat Simulation...")
        
        if not self.session_token:
            print("❌ Skipping combat simulation tests - no session token")  
            return
        
        # Test combat simulation endpoint
        combat_data = {
            "attacker": {"lightFighter": 10, "cruiser": 5},
            "attackerTech": {"weaponsTechnology": 5, "shieldingTechnology": 3},
            "defender": {"lightFighter": 8, "heavyFighter": 3},
            "defenderDefense": {"rocketLauncher": 10, "lightLaser": 5},
            "defenderTech": {"weaponsTechnology": 3, "shieldingTechnology": 4}
        }
        success, response = self.run_test("Combat Simulation", "POST", "api/combat/simulate", 200, combat_data, use_auth=True)
        
        if success and response:
            winner = response.get("winner", "unknown")
            rounds = response.get("rounds", 0)
            round_details = response.get("roundDetails", [])
            print(f"   Combat result: {winner} wins in {rounds} rounds")
            
            # Check round range (1-15)
            if 1 <= rounds <= 15:
                print(f"   ✓ Rounds within expected range: {rounds}")
            else:
                print(f"   ⚠️ Rounds outside expected range: {rounds}")
            
            # Check for debris and survivors
            debris = response.get("debris", {})
            if debris:
                print(f"   Debris: {debris.get('metal', 0)} metal, {debris.get('crystal', 0)} crystal")
            
            survivors = response.get("attackerSurvivors", {})
            if survivors:
                print(f"   Attacker survivors: {sum(survivors.values())} ships")

    def test_v15_leaderboard_pagination(self):
        """Test leaderboard with pagination (15-100 per page)"""
        print("\n🏆 Testing Leaderboard Pagination...")
        
        if not self.session_token:
            print("❌ Skipping leaderboard pagination tests - no session token")
            return
        
        # Test leaderboard with different page sizes
        page_sizes = [15, 25, 50, 100]
        for size in page_sizes:
            endpoint = f"api/leaderboard?page=1&per_page={size}"
            success, response = self.run_test(f"Leaderboard (per_page={size})", "GET", endpoint, 200, use_auth=True)
            
            if success and response:
                players = response.get("players", [])
                pagination = response.get("pagination", {})
                actual_per_page = pagination.get("perPage", 0)
                print(f"   ✓ Page size {size}: returned {len(players)} players, per_page={actual_per_page}")

    def test_v15_galaxy_view_enhanced(self):
        """Test galaxy view with planet positions and sizes"""
        print("\n🌌 Testing Enhanced Galaxy View...")
        
        if not self.session_token:
            print("❌ Skipping galaxy view tests - no session token")
            return
        
        # Test galaxy view with position details
        success, response = self.run_test("Galaxy View Enhanced", "GET", "api/galaxy/1/1", 200, use_auth=True)
        if success and response:
            planets = response.get("planets", [])
            print(f"   System planets: {len(planets)}")
            
            for i, planet in enumerate(planets[:3]):  # Check first few
                position = planet.get("position", 0)
                size_info = planet.get("sizeInfo", {})
                base_fields = size_info.get("baseFields", 0)
                max_fields = size_info.get("maxFields", 0)
                size_category = size_info.get("category", "unknown")
                
                print(f"   Planet {i+1}: pos {position}, {base_fields}-{max_fields} fields ({size_category})")
                
                # Check position-based sizing (position 8 should be largest)
                if position == 8 and base_fields > 200:
                    print(f"   ✓ Position 8 has large size: {base_fields} fields")
                elif position in [1, 15] and base_fields < 100:
                    print(f"   ✓ Edge position has smaller size: {base_fields} fields")

    def test_v20_starships_system(self):
        """Test Stellar Dominion v2.0 - All 90 Starships System"""
        print("\n🚀 Testing v2.0 - 90 Starships System...")
        
        if not self.session_token:
            print("❌ Skipping starships tests - no session token")
            return
        
        # Test all starships endpoint (should return 90 starships)
        success, response = self.run_test("All Starships (90 expected)", "GET", "api/starships", 200, use_auth=True)
        if success and response:
            starships = response if isinstance(response, dict) else {}
            print(f"   Found {len(starships)} starships")
            if len(starships) >= 90:
                print(f"   ✅ Expected 90+ starships, found {len(starships)}")
            else:
                print(f"   ⚠️ Expected 90+ starships, only found {len(starships)}")
            
            # Check for sample starships with stats
            sample_ships = list(starships.keys())[:3] if starships else []
            for ship_id in sample_ships:
                ship = starships[ship_id]
                ship_name = ship.get('name', 'Unknown')
                ship_class = ship.get('class', 'Unknown')
                ship_tier = ship.get('tier', 0)
                stats = ship.get('stats', {})
                hull = stats.get('hull', 0)
                weapons = stats.get('weapons', 0)
                print(f"   ✓ {ship_name}: {ship_class} class, Tier {ship_tier}, Hull: {hull}, Weapons: {weapons}")

    def test_v20_motherships_system(self):
        """Test Stellar Dominion v2.0 - 10 Motherships System"""
        print("\n🛸 Testing v2.0 - 10 Motherships System...")
        
        if not self.session_token:
            print("❌ Skipping motherships tests - no session token")
            return
        
        # Test motherships endpoint (should return 10 motherships)
        success, response = self.run_test("All Motherships (10 expected)", "GET", "api/motherships", 200, use_auth=True)
        if success and response:
            motherships = response if isinstance(response, dict) else {}
            print(f"   Found {len(motherships)} motherships")
            if len(motherships) >= 10:
                print(f"   ✅ Expected 10+ motherships, found {len(motherships)}")
            else:
                print(f"   ⚠️ Expected 10+ motherships, only found {len(motherships)}")
            
            # Check sample motherships
            sample_motherships = list(motherships.keys())[:2] if motherships else []
            for ms_id in sample_motherships:
                ms = motherships[ms_id]
                ms_name = ms.get('name', 'Unknown')
                ms_class = ms.get('class', 'Unknown')
                ms_tier = ms.get('tier', 0)
                stats = ms.get('stats', {})
                hull = stats.get('hull', 0)
                print(f"   ✓ {ms_name}: {ms_class} class, Tier {ms_tier}, Hull: {hull:,}")

    def test_v20_universes_system(self):
        """Test Stellar Dominion v2.0 - 9 Universes System"""
        print("\n🌌 Testing v2.0 - 9 Universes × 30 Galaxies System...")
        
        if not self.session_token:
            print("❌ Skipping universes tests - no session token")
            return
        
        # Test all universes endpoint (should return 9 universes)
        success, response = self.run_test("All Universes (9 expected)", "GET", "api/universes", 200, use_auth=True)
        if success and response:
            universes = response if isinstance(response, dict) else {}
            print(f"   Found {len(universes)} universes")
            if len(universes) >= 9:
                print(f"   ✅ Expected 9+ universes, found {len(universes)}")
                
                # Test first universe details
                first_universe_key = list(universes.keys())[0] if universes else None
                if first_universe_key:
                    universe = universes[first_universe_key]
                    universe_name = universe.get('name', 'Unknown')
                    universe_id = universe.get('id', 1)
                    print(f"   ✓ Sample: {universe_name} (ID: {universe_id})")
            else:
                print(f"   ⚠️ Expected 9+ universes, only found {len(universes)}")
        
        # Test galaxies in universe 1 (should return 30 galaxies)
        success, response = self.run_test("Galaxies in Universe 1 (30 expected)", "GET", "api/universes/1/galaxies", 200, use_auth=True)
        if success and response:
            galaxies = response if isinstance(response, list) else []
            print(f"   Universe 1 galaxies: {len(galaxies)}")
            if len(galaxies) >= 30:
                print(f"   ✅ Expected 30+ galaxies, found {len(galaxies)}")
                
                # Check sample galaxies
                sample_galaxies = galaxies[:3] if galaxies else []
                for galaxy in sample_galaxies:
                    galaxy_name = galaxy.get('name', 'Unknown')
                    galaxy_id = galaxy.get('id', 0)
                    galaxy_type = galaxy.get('type', 'Unknown')
                    print(f"   ✓ Galaxy {galaxy_id}: {galaxy_name} ({galaxy_type})")
            else:
                print(f"   ⚠️ Expected 30+ galaxies, only found {len(galaxies)}")

    def test_v20_planet_scanner_system(self):
        """Test Stellar Dominion v2.0 - Planet Scanner System"""
        print("\n🔍 Testing v2.0 - Planet Scanner System...")
        
        if not self.session_token:
            print("❌ Skipping scanner tests - no session token")
            return
        
        # Test scanner range endpoint
        success, response = self.run_test("Scanner Range", "GET", "api/scanner/range", 200, use_auth=True)
        if success and response:
            scanner_data = response if isinstance(response, dict) else {}
            scanner_level = scanner_data.get('scanner_level', 0)
            scan_range = scanner_data.get('range', 0)
            accuracy = scanner_data.get('accuracy', 0)
            print(f"   Scanner Level: {scanner_level}, Range: {scan_range}, Accuracy: {accuracy}")
            if scanner_level >= 1:
                print(f"   ✅ Scanner system active")
        
        # Test scanner scan endpoint
        scan_data = {
            "galaxy": 1,
            "system": 1,
            "position": 8
        }
        success, response = self.run_test("Scanner Scan", "POST", "api/scanner/scan", 200, scan_data, use_auth=True)
        if success and response:
            scan_result = response if isinstance(response, dict) else {}
            scan_success = scan_result.get('success', False)
            scan_details = scan_result.get('planet_data', {})
            print(f"   Scan success: {scan_success}")
            if scan_success and scan_details:
                planet_type = scan_details.get('planet_type', 'Unknown')
                size_estimate = scan_details.get('size_estimate', 'Unknown')
                print(f"   ✓ Scan result: {planet_type}, Size: {size_estimate}")

    def test_v20_commander_system(self):
        """Test Stellar Dominion v2.0 - Commander System"""
        print("\n👤 Testing v2.0 - Commander System...")
        
        if not self.session_token:
            print("❌ Skipping commander tests - no session token")
            return
        
        # Test commander classes (should have 6 classes)
        success, response = self.run_test("Commander Classes", "GET", "api/config/commander-classes", 200, use_auth=True)
        if success and response:
            classes = response if isinstance(response, dict) else {}
            print(f"   Found {len(classes)} commander classes")
            if len(classes) >= 6:
                print(f"   ✅ Expected 6+ commander classes, found {len(classes)}")
                
                # Check sample classes
                sample_classes = list(classes.keys())[:3]
                for class_key in sample_classes:
                    class_data = classes[class_key]
                    class_name = class_data.get('name', 'Unknown')
                    primary_stat = class_data.get('primary_stat', 'Unknown')
                    print(f"   ✓ {class_name}: {primary_stat} focus")
            else:
                print(f"   ⚠️ Expected 6+ commander classes, only found {len(classes)}")
        
        # Test commander skills (should have 24+ skills)
        success, response = self.run_test("Commander Skills", "GET", "api/config/commander-skills", 200, use_auth=True)
        if success and response:
            skills = response if isinstance(response, dict) else {}
            print(f"   Found {len(skills)} commander skills")
            if len(skills) >= 24:
                print(f"   ✅ Expected 24+ commander skills, found {len(skills)}")
            else:
                print(f"   ⚠️ Expected 24+ commander skills, only found {len(skills)}")

    def test_v20_government_system(self):
        """Test Stellar Dominion v2.0 - Government System"""
        print("\n🏛️ Testing v2.0 - Government System...")
        
        if not self.session_token:
            print("❌ Skipping government tests - no session token")
            return
        
        # Test government types (should have 10 types)
        success, response = self.run_test("Government Types", "GET", "api/config/government-types", 200, use_auth=True)
        if success and response:
            gov_types = response if isinstance(response, dict) else {}
            print(f"   Found {len(gov_types)} government types")
            if len(gov_types) >= 10:
                print(f"   ✅ Expected 10+ government types, found {len(gov_types)}")
                
                # Check sample government types
                sample_govs = list(gov_types.keys())[:3]
                for gov_key in sample_govs:
                    gov_data = gov_types[gov_key]
                    gov_name = gov_data.get('name', 'Unknown')
                    bonuses = gov_data.get('bonuses', {})
                    print(f"   ✓ {gov_name}: {len(bonuses)} bonuses")
            else:
                print(f"   ⚠️ Expected 10+ government types, only found {len(gov_types)}")

    def test_v20_population_system(self):
        """Test Stellar Dominion v2.0 - Population System"""
        print("\n👥 Testing v2.0 - Population System...")
        
        if not self.session_token:
            print("❌ Skipping population tests - no session token")
            return
        
        # Test population config (should have 6 classes)
        success, response = self.run_test("Population Config", "GET", "api/config/population", 200, use_auth=True)
        if success and response:
            pop_config = response if isinstance(response, dict) else {}
            classes = pop_config.get('classes', {})
            needs = pop_config.get('needs', {})
            happiness = pop_config.get('happiness_factors', {})
            
            print(f"   Population classes: {len(classes)}")
            print(f"   Population needs: {len(needs)}")
            print(f"   Happiness factors: {len(happiness)}")
            
            if len(classes) >= 6:
                print(f"   ✅ Expected 6+ population classes, found {len(classes)}")
                
                # Check sample population classes
                sample_classes = list(classes.keys())[:3]
                for class_key in sample_classes:
                    class_data = classes[class_key]
                    class_name = class_data.get('name', 'Unknown')
                    productivity = class_data.get('productivity', 1.0)
                    print(f"   ✓ {class_name}: {productivity}x productivity")
            else:
                print(f"   ⚠️ Expected 6+ population classes, only found {len(classes)}")

    def test_v20_station_fields_system(self):
        """Test Stellar Dominion v2.0 - Station Fields System"""
        print("\n🛰️ Testing v2.0 - Station Fields System...")
        
        if not self.session_token:
            print("❌ Skipping station fields tests - no session token")
            return
        
        # Test station fields config
        success, response = self.run_test("Station Fields Config", "GET", "api/config/station-fields", 200, use_auth=True)
        if success and response:
            station_fields = response if isinstance(response, dict) else {}
            station_config = station_fields.get('station_field_config', {})
            moon_config = station_fields.get('moon_field_config', {})
            starbase_facilities = station_fields.get('starbase_facilities', {})
            
            print(f"   Station field types: {len(station_config)}")
            print(f"   Moon field config available: {len(moon_config) > 0}")
            print(f"   Starbase facilities: {len(starbase_facilities)}")
            
            # Check sample station types
            sample_stations = list(station_config.keys())[:3] if station_config else []
            for station_type in sample_stations:
                station_data = station_config[station_type]
                base_fields = station_data.get('base_fields', 0)
                max_fields = station_data.get('max_fields', 0)
                print(f"   ✓ {station_type}: {base_fields}-{max_fields} fields")

    def test_v20_all_config_endpoint(self):
        """Test Stellar Dominion v2.0 - All Config Endpoint"""
        print("\n⚙️ Testing v2.0 - All Config Endpoint...")
        
        if not self.session_token:
            print("❌ Skipping all config tests - no session token")
            return
        
        # Test all config endpoint (comprehensive configuration)
        success, response = self.run_test("All Config Endpoint", "GET", "api/config/all", 200, use_auth=True)
        if success and response:
            all_config = response if isinstance(response, dict) else {}
            config_sections = list(all_config.keys())
            print(f"   Configuration sections: {len(config_sections)}")
            
            # Check for key configuration sections
            expected_sections = [
                'starships', 'motherships', 'universes', 'commander_classes',
                'government_types', 'population', 'scanner', 'station_fields'
            ]
            
            found_sections = 0
            for section in expected_sections:
                if section in config_sections or any(section in key for key in config_sections):
                    found_sections += 1
            
            print(f"   ✅ Found {found_sections}/{len(expected_sections)} expected config sections")
            
            # Show sample config sections
            sample_sections = config_sections[:5] if config_sections else []
            for section in sample_sections:
                section_data = all_config[section]
                if isinstance(section_data, dict):
                    print(f"   ✓ {section}: {len(section_data)} items")
                elif isinstance(section_data, list):
                    print(f"   ✓ {section}: {len(section_data)} items")
                else:
                    print(f"   ✓ {section}: configured")

def main():
    print("🚀 Starting Stellar Dominion v2.0 FastAPI Backend Tests...")
    print("🎯 Focus: 90 Starships, 10 Motherships, 9 Universes, Commander & Government Systems")
    print("=" * 70)
    
    # Setup
    tester = StellarDominionAPITester()
    
    # Test authentication flow with specified credentials
    tester.test_auth_flow()
    
    # Test v2.0 specific features
    tester.test_v20_starships_system()
    tester.test_v20_motherships_system()
    tester.test_v20_universes_system()
    tester.test_v20_planet_scanner_system()
    tester.test_v20_commander_system()
    tester.test_v20_government_system()
    tester.test_v20_population_system()
    tester.test_v20_station_fields_system()
    tester.test_v20_all_config_endpoint()
    
    # Test core game systems
    tester.test_game_state()
    tester.test_buildings_system()

    # Print results
    print("\n" + "=" * 70)
    print(f"📊 Final Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests Details:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"  - {test['name']}: {error_msg}")
            if 'response' in test:
                print(f"    Response: {test['response'][:200]}...")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("🎉 Stellar Dominion v2.0 backend tests mostly successful!")
    elif success_rate >= 50:
        print("⚠️  Backend has some issues but core v2.0 functionality works")
    else:
        print("🚨 Backend has significant issues with v2.0 features")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())