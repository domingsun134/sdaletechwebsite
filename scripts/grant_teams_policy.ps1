# PowerShell Script to Grant Application Access Policy for Teams
# This script must be run by a Tenant Administrator in PowerShell.

# 1. Install Microsoft Teams Module (if not installed)
if (-not (Get-Module -ListAvailable -Name MicrosoftTeams)) {
    Write-Host "Installing Microsoft Teams module..."
    Install-Module -Name MicrosoftTeams -Force -AllowClobber
}

# 2. Connect to Microsoft Teams
try {
    Get-CsTenant -ErrorAction Stop | Out-Null
    Write-Host "Already connected to Teams."
} catch {
    Write-Host "Connecting to Microsoft Teams..."
    Connect-MicrosoftTeams
}

# 3. Define Variables (Hardcoded as requested)
$AppId = "d8ff2464-4dab-40b5-9c5f-1eae92070ebc"
$UserEmail = "stl-workflow@sdaletech.com"

Write-Host "Using App ID: $AppId"
Write-Host "Using User Email: $UserEmail"

$PolicyName = "Allow-Meeting-Creation-App-Policy"

# 4. Create the Policy (if it doesn't exist)
$existingPolicy = Get-CsApplicationAccessPolicy -Identity $PolicyName -ErrorAction SilentlyContinue
if ($null -eq $existingPolicy) {
    Write-Host "Creating policy $PolicyName..."
    New-CsApplicationAccessPolicy -Identity $PolicyName -AppIds $AppId -Description "Allows app to create online meetings on behalf of users"
} else {
    Write-Host "Policy $PolicyName already exists."
    # Ensure AppId is in the policy
    if ($existingPolicy.AppIds -notcontains $AppId) {
        Write-Host "Updating policy to include App ID $AppId..."
        Set-CsApplicationAccessPolicy -Identity $PolicyName -AppIds @{Add=$AppId}
    } else {
        Write-Host "Policy already includes App ID $AppId."
    }
}

# 5. Grant the Policy to the User
Write-Host "Granting policy to $UserEmail..."
Grant-CsApplicationAccessPolicy -PolicyName $PolicyName -Identity $UserEmail

# 6. Verification
Write-Host "`n--- Verification ---"
$grantedPolicy = Get-CsUserPolicyAssignment -Identity $UserEmail -PolicyType ApplicationAccessPolicy
if ($grantedPolicy.PolicyName -eq $PolicyName) {
    Write-Host "SUCCESS: Policy '$PolicyName' is successfully assigned to $UserEmail."
    Write-Host "Note: It may take up to 2 hours for the policy to be fully effective in the Teams cloud."
} else {
    Write-Host "WARNING: Policy assignment not found immediately. It might take a moment."
}
