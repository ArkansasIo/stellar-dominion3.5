# Comprehensive API Test Script for Universe Empire Dominion
# Tests all major features and sub-features

$baseUrl = "http://localhost:5001"
$results = @()
$passCount = 0
$failCount = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params -ErrorAction Stop
        $status = "PASS"
        $passCount++
        Write-Host "[PASS] $Name" -ForegroundColor Green
    }
    catch {
        $status = "FAIL"
        $failCount++
        Write-Host "[FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
        $response = $_.Exception.Message
    }
    
    $results += [PSCustomObject]@{
        Feature = $Name
        Method = $Method
        URL = $Url
        Status = $status
        Response = $response
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  API FEATURE TESTING SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ==================== CORE SYSTEM ====================
Write-Host "`n--- Core System ---" -ForegroundColor Yellow

Test-Endpoint -Name "Health Check" -Method "GET" -Url "$baseUrl/api/status/health"
Test-Endpoint -Name "API Status" -Method "GET" -Url "$baseUrl/api/status"
Test-Endpoint -Name "API Version" -Method "GET" -Url "$baseUrl/api/version"
Test-Endpoint -Name "Game Resources" -Method "GET" -Url "$baseUrl/api/game/resources"
Test-Endpoint -Name "Game Fleet" -Method "GET" -Url "$baseUrl/api/game/fleet"
Test-Endpoint -Name "Game Technology" -Method "GET" -Url "$baseUrl/api/game/technology"
Test-Endpoint -Name "Updates Manifest" -Method "GET" -Url "$baseUrl/api/updates/manifest"
Test-Endpoint -Name "Updates Check" -Method "GET" -Url "$baseUrl/api/updates/check"

# ==================== AUTHENTICATION ====================
Write-Host "`n--- Authentication ---" -ForegroundColor Yellow

Test-Endpoint -Name "Auth User" -Method "GET" -Url "$baseUrl/api/auth/user"
Test-Endpoint -Name "Auth Logout" -Method "POST" -Url "$baseUrl/api/auth/logout"

# ==================== ADMIN SYSTEM ====================
Write-Host "`n--- Admin System ---" -ForegroundColor Yellow

Test-Endpoint -Name "Admin Stats" -Method "GET" -Url "$baseUrl/api/admin/stats"
Test-Endpoint -Name "Admin Health" -Method "GET" -Url "$baseUrl/api/admin/health"
Test-Endpoint -Name "Admin Me" -Method "GET" -Url "$baseUrl/api/admin/me"
Test-Endpoint -Name "Admin Settings" -Method "GET" -Url "$baseUrl/api/admin/settings"
Test-Endpoint -Name "Admin Overview" -Method "GET" -Url "$baseUrl/api/admin/overview"
Test-Endpoint -Name "Admin Operations" -Method "GET" -Url "$baseUrl/api/admin/operations"
Test-Endpoint -Name "Admin Server Settings" -Method "GET" -Url "$baseUrl/api/admin/server-settings"
Test-Endpoint -Name "Admin Audit Log" -Method "GET" -Url "$baseUrl/api/admin/audit"
Test-Endpoint -Name "Admin Connections" -Method "GET" -Url "$baseUrl/api/admin/connections"
Test-Endpoint -Name "Admin Error Logs" -Method "GET" -Url "$baseUrl/api/admin/logs/errors"
Test-Endpoint -Name "Admin Access Logs" -Method "GET" -Url "$baseUrl/api/admin/logs/access"
Test-Endpoint -Name "Admin Developer Shortcuts" -Method "GET" -Url "$baseUrl/api/admin/developer-shortcuts"
Test-Endpoint -Name "Admin Rules Content" -Method "GET" -Url "$baseUrl/api/admin/rules-content"
Test-Endpoint -Name "Admin Control Plane" -Method "GET" -Url "$baseUrl/api/admin/control-plane"
Test-Endpoint -Name "Admin Accounts" -Method "GET" -Url "$baseUrl/api/admin/accounts"
Test-Endpoint -Name "Admin Users" -Method "GET" -Url "$baseUrl/api/admin/users"

# ==================== ARMY SYSTEM ====================
Write-Host "`n--- Army System ---" -ForegroundColor Yellow

Test-Endpoint -Name "Army Subsystems" -Method "GET" -Url "$baseUrl/api/army/subsystems"
Test-Endpoint -Name "Army Force" -Method "GET" -Url "$baseUrl/api/army/force"
Test-Endpoint -Name "Army Campaigns" -Method "GET" -Url "$baseUrl/api/army/campaigns"
Test-Endpoint -Name "Army Active Campaigns" -Method "GET" -Url "$baseUrl/api/army/campaigns/active"
Test-Endpoint -Name "Army Combat Power" -Method "GET" -Url "$baseUrl/api/army/units/combat-power"
Test-Endpoint -Name "Army Building Structures Meta" -Method "GET" -Url "$baseUrl/api/army/building-structures/meta"
Test-Endpoint -Name "Army Building Structures Categories" -Method "GET" -Url "$baseUrl/api/army/building-structures/categories"
Test-Endpoint -Name "Army Building Structures Tier Classes" -Method "GET" -Url "$baseUrl/api/army/building-structures/tier-classes"
Test-Endpoint -Name "Army Building Structures Level Config" -Method "GET" -Url "$baseUrl/api/army/building-structures/level-config"
Test-Endpoint -Name "Army Building Structures Available" -Method "GET" -Url "$baseUrl/api/army/building-structures/available"

# ==================== ARTIFACTS/RELICS ====================
Write-Host "`n--- Artifacts & Relics ---" -ForegroundColor Yellow

Test-Endpoint -Name "Artifacts Summary" -Method "GET" -Url "$baseUrl/api/artifacts/summary"
Test-Endpoint -Name "Artifacts Discovery Log" -Method "GET" -Url "$baseUrl/api/artifacts/discovery-log"
Test-Endpoint -Name "Relics Inventory" -Method "GET" -Url "$baseUrl/api/relics/inventory"

# ==================== ALLIANCES ====================
Write-Host "`n--- Alliances ---" -ForegroundColor Yellow

Test-Endpoint -Name "Alliances List" -Method "GET" -Url "$baseUrl/api/alliances"
Test-Endpoint -Name "My Alliance" -Method "GET" -Url "$baseUrl/api/alliances/mine"

# ==================== BANK VAULT ====================
Write-Host "`n--- Bank Vault ---" -ForegroundColor Yellow

Test-Endpoint -Name "Bank Vault Status" -Method "GET" -Url "$baseUrl/api/bank-vault/status"
Test-Endpoint -Name "Bank Vault Currencies" -Method "GET" -Url "$baseUrl/api/bank-vault/currencies"
Test-Endpoint -Name "Bank Vault Stats" -Method "GET" -Url "$baseUrl/api/bank-vault/stats"

# ==================== COMBAT ====================
Write-Host "`n--- Combat ---" -ForegroundColor Yellow

Test-Endpoint -Name "Combat Stats" -Method "GET" -Url "$baseUrl/api/combat/stats"
Test-Endpoint -Name "Combat Battle History" -Method "GET" -Url "$baseUrl/api/combat/battle-history"

# ==================== CONSTRUCTOR YARD ====================
Write-Host "`n--- Constructor Yard ---" -ForegroundColor Yellow

Test-Endpoint -Name "Constructor Yard Meta" -Method "GET" -Url "$baseUrl/api/constructor-yard/meta"
Test-Endpoint -Name "Constructor Yard Catalog" -Method "GET" -Url "$baseUrl/api/constructor-yard/catalog"
Test-Endpoint -Name "Constructor Yard Status" -Method "GET" -Url "$baseUrl/api/constructor-yard/status/me"

# ==================== COMMANDERS ====================
Write-Host "`n--- Commanders ---" -ForegroundColor Yellow

Test-Endpoint -Name "Commanders List" -Method "GET" -Url "$baseUrl/api/commanders"
Test-Endpoint -Name "Commanders Gacha Status" -Method "GET" -Url "$baseUrl/api/commanders/gacha/status"
Test-Endpoint -Name "Commanders Inventory" -Method "GET" -Url "$baseUrl/api/commanders/inventory"
Test-Endpoint -Name "Commanders Profile" -Method "GET" -Url "$baseUrl/api/commanders/profile/me"
Test-Endpoint -Name "Commander Talent Tree" -Method "GET" -Url "$baseUrl/api/commander/talent/tree"

# ==================== CIVILIZATION SYSTEM ====================
Write-Host "`n--- Civilization System ---" -ForegroundColor Yellow

Test-Endpoint -Name "Civilization State" -Method "GET" -Url "$baseUrl/api/civilization/state"
Test-Endpoint -Name "Civilization Subsystems" -Method "GET" -Url "$baseUrl/api/civilization/subsystems"
Test-Endpoint -Name "Civilization Jobs" -Method "GET" -Url "$baseUrl/api/civilization/jobs"
Test-Endpoint -Name "Civilization Jobs Meta" -Method "GET" -Url "$baseUrl/api/config/civilization-jobs"

# ==================== ESPIONAGE ====================
Write-Host "`n--- Espionage ---" -ForegroundColor Yellow

Test-Endpoint -Name "Espionage Stats" -Method "GET" -Url "$baseUrl/api/espionage/stats"
Test-Endpoint -Name "Espionage Missions" -Method "GET" -Url "$baseUrl/api/espionage/missions"

# ==================== EXPEDITIONS ====================
Write-Host "`n--- Expeditions ---" -ForegroundColor Yellow

Test-Endpoint -Name "Expeditions Catalog" -Method "GET" -Url "$baseUrl/api/expeditions/catalog"
Test-Endpoint -Name "Expeditions Tiers" -Method "GET" -Url "$baseUrl/api/expeditions/tiers"
Test-Endpoint -Name "Expeditions Levels" -Method "GET" -Url "$baseUrl/api/expeditions/levels"

# ==================== FORUMS ====================
Write-Host "`n--- Forums ---" -ForegroundColor Yellow

Test-Endpoint -Name "Forums Threads" -Method "GET" -Url "$baseUrl/api/forums/threads"

# ==================== GAME ASSET LIBRARY ====================
Write-Host "`n--- Game Asset Library ---" -ForegroundColor Yellow

Test-Endpoint -Name "Game Asset Library" -Method "GET" -Url "$baseUrl/api/game-asset-library"

# ==================== GOVERNMENT BUILDINGS ====================
Write-Host "`n--- Government Buildings ---" -ForegroundColor Yellow

Test-Endpoint -Name "Government Buildings" -Method "GET" -Url "$baseUrl/api/government-buildings"
Test-Endpoint -Name "Government Buildings Categories" -Method "GET" -Url "$baseUrl/api/government-buildings/categories"
Test-Endpoint -Name "Government Buildings Sub-Categories" -Method "GET" -Url "$baseUrl/api/government-buildings/sub-categories"
Test-Endpoint -Name "Government Buildings Ranks" -Method "GET" -Url "$baseUrl/api/government-buildings/ranks"

# ==================== LIVE OPS / SEASON PASS / BATTLE PASS ====================
Write-Host "`n--- Live Ops ---" -ForegroundColor Yellow

Test-Endpoint -Name "Season Pass Overview" -Method "GET" -Url "$baseUrl/api/season-pass/overview"
Test-Endpoint -Name "Season Pass Progression" -Method "GET" -Url "$baseUrl/api/season-pass/progression"
Test-Endpoint -Name "Battle Pass Overview" -Method "GET" -Url "$baseUrl/api/battle-pass/overview"
Test-Endpoint -Name "Storefront Catalog" -Method "GET" -Url "$baseUrl/api/storefront/catalog"
Test-Endpoint -Name "Storefront Featured" -Method "GET" -Url "$baseUrl/api/storefront/featured"
Test-Endpoint -Name "Storefront Balance" -Method "GET" -Url "$baseUrl/api/storefront/balance"
Test-Endpoint -Name "Story Campaign" -Method "GET" -Url "$baseUrl/api/story/campaign"
Test-Endpoint -Name "Story Missions" -Method "GET" -Url "$baseUrl/api/story/missions"

# ==================== MEGASTRUCTURES ====================
Write-Host "`n--- Megastructures ---" -ForegroundColor Yellow

Test-Endpoint -Name "Megastructures Templates" -Method "GET" -Url "$baseUrl/api/megastructures/templates"
Test-Endpoint -Name "Megastructures Player" -Method "GET" -Url "$baseUrl/api/megastructures/player"

# ==================== MISSING/RAIDS/RELICS/EVENTS ====================
Write-Host "`n--- Raids, Events & Exploration ---" -ForegroundColor Yellow

Test-Endpoint -Name "Raids List" -Method "GET" -Url "$baseUrl/api/raids"
Test-Endpoint -Name "Raid Finder Queue" -Method "GET" -Url "$baseUrl/api/raid-finder/queue"
Test-Endpoint -Name "Relics List" -Method "GET" -Url "$baseUrl/api/relics"
Test-Endpoint -Name "Events List" -Method "GET" -Url "$baseUrl/api/events"
Test-Endpoint -Name "Expeditions Player" -Method "GET" -Url "$baseUrl/api/expeditions"
Test-Endpoint -Name "Exploration State" -Method "GET" -Url "$baseUrl/api/exploration/state"

# ==================== MOONS ====================
Write-Host "`n--- Moons ---" -ForegroundColor Yellow

Test-Endpoint -Name "Moons by Planet" -Method "GET" -Url "$baseUrl/api/moons/planet/1"

# ==================== PROGRESSION COMBAT ====================
Write-Host "`n--- Progression Combat ---" -ForegroundColor Yellow

Test-Endpoint -Name "Progression Combat Meta" -Method "GET" -Url "$baseUrl/api/systems/progression-combat/meta"
Test-Endpoint -Name "Progression Combat Tiers" -Method "GET" -Url "$baseUrl/api/systems/progression-combat/tiers"
Test-Endpoint -Name "Universe Events" -Method "GET" -Url "$baseUrl/api/systems/events"

# ==================== SMITHY ====================
Write-Host "`n--- Smithy ---" -ForegroundColor Yellow

Test-Endpoint -Name "Smithy Status" -Method "GET" -Url "$baseUrl/api/smithy/status"
Test-Endpoint -Name "Smithy Materials" -Method "GET" -Url "$baseUrl/api/smithy/materials"
Test-Endpoint -Name "Smithy Enchantments" -Method "GET" -Url "$baseUrl/api/smithy/enchantments"
Test-Endpoint -Name "Smithy Blueprints" -Method "GET" -Url "$baseUrl/api/smithy/blueprints"
Test-Endpoint -Name "Smithy Stats" -Method "GET" -Url "$baseUrl/api/smithy/stats"

# ==================== SPORE DRIVE ====================
Write-Host "`n--- Spore Drive ---" -ForegroundColor Yellow

Test-Endpoint -Name "Spore Drive Ship" -Method "GET" -Url "$baseUrl/api/spore-drive/ship/1"

# ==================== STATUS ====================
Write-Host "`n--- Status & Metrics ---" -ForegroundColor Yellow

Test-Endpoint -Name "Status Uptime" -Method "GET" -Url "$baseUrl/api/status/uptime"
Test-Endpoint -Name "Status Metrics" -Method "GET" -Url "$baseUrl/api/status/metrics"

# ==================== TURNS ====================
Write-Host "`n--- Turns ---" -ForegroundColor Yellow

Test-Endpoint -Name "Turns" -Method "GET" -Url "$baseUrl/api/turns"

# ==================== SETTINGS ====================
Write-Host "`n--- Settings ---" -ForegroundColor Yellow

Test-Endpoint -Name "Player Settings" -Method "GET" -Url "$baseUrl/api/settings/player/options"

# ==================== POPULATION ====================
Write-Host "`n--- Population ---" -ForegroundColor Yellow

Test-Endpoint -Name "Population Snapshot" -Method "GET" -Url "$baseUrl/api/population/snapshot"

# ==================== GALAXY ====================
Write-Host "`n--- Galaxy ---" -ForegroundColor Yellow

Test-Endpoint -Name "Galaxy System" -Method "GET" -Url "$baseUrl/api/galaxy/1/1/1/1"

# ==================== MISSIONS ====================
Write-Host "`n--- Missions ---" -ForegroundColor Yellow

Test-Endpoint -Name "Missions" -Method "GET" -Url "$baseUrl/api/missions/1"

# ==================== ACCOUNT ====================
Write-Host "`n--- Account ---" -ForegroundColor Yellow

Test-Endpoint -Name "Account Settings" -Method "GET" -Url "$baseUrl/api/account/settings"

# ==================== RESULTS SUMMARY ====================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($passCount + $failCount)"
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($passCount / ($passCount + $failCount)) * 100, 2))%"
Write-Host "========================================`n" -ForegroundColor Cyan

# Export results to CSV
$results | Export-Csv -Path "api-test-results.csv" -NoTypeInformation -Encoding UTF8
Write-Host "Results exported to api-test-results.csv`n" -ForegroundColor Gray

# Show failed tests
if ($failCount -gt 0) {
    Write-Host "`n--- Failed Tests ---" -ForegroundColor Red
    $results | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "[$($_.Method)] $($_.Feature)" -ForegroundColor Red
        Write-Host "  URL: $($_.URL)" -ForegroundColor Gray
    }
}