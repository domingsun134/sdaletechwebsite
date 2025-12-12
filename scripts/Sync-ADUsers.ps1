# Sync-ADUsers.ps1
# This script polls the Web API for pending users and creates them in Active Directory.
# Run this script periodically (e.g., via Task Scheduler) on a server with RSAT-AD-PowerShell installed.

# Configuration
$ApiBaseUrl = "http://localhost:3000/api" # REPLACE THIS with your actual server URL
$DefaultPassword = "Welcome123!" # Change this to a secure default or generate random
$Domain = "techgrp" # REPLACE THIS
$OU = "OU=Users,DC=sunningdale,DC=com" # REPLACE THIS

# Function to Create AD User
function New-OnPremUser {
    param (
        [PSCustomObject]$User
    )

    try {
        $SamAccountName = ($User.firstName.Substring(0, 1) + $User.lastName).ToLower()
        # Check if user exists, append number if needed (simplified logic)
        if (Get-ADUser -Filter {SamAccountName -eq $SamAccountName} -ErrorAction SilentlyContinue) {
            $SamAccountName = $SamAccountName + "1"
        }

        $UserParams = @{
            SamAccountName        = $SamAccountName
            UserPrincipalName     = "$SamAccountName@$Domain"
            Name                  = $User.displayName
            GivenName             = $User.firstName
            Surname               = $User.lastName
            DisplayName           = $User.displayName
            Title                 = $User.jobTitle
            Department            = $User.department
            Company               = $User.company
            Office                = $User.location
            Description           = "Employee ID: $($User.employeeId)"
            Path                  = $OU
            AccountPassword       = (ConvertTo-SecureString $DefaultPassword -AsPlainText -Force)
            Enabled               = $true
            ChangePasswordAtLogon = $true
        }

        # If Manager is provided, try to find them (Assuming Manager field is DisplayName or Email)
        if ($User.manager) {
            $ManagerObj = Get-ADUser -Filter {Name -eq $User.manager -or UserPrincipalName -eq $User.manager_email} -ErrorAction SilentlyContinue
            if ($ManagerObj) {
                $UserParams.Manager = $ManagerObj
            }
        }

        New-ADUser @UserParams
        Write-Host "Created user: $SamAccountName" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "Failed to create user $($User.displayName): $_"
        return $false
    }
}

# Main Logic
try {
    # 1. Get Pending Users
    $Response = Invoke-RestMethod -Uri "$ApiBaseUrl/integrations/ad/pending" -Method Get
    
    if ($Response.Count -eq 0) {
        Write-Host "No pending users found."
        exit
    }

    foreach ($User in $Response) {
        Write-Host "Processing user: $($User.displayName)"

        # 2. Create User in AD
        # Uncomment the line below when running in actual environment
        # $Success = New-OnPremUser -User $User
        
        # For testing without AD, we simulate success
        $Success = $true 
        Write-Host "Simulating creation for $($User.displayName)..."

        # 3. Confirm to API
        if ($Success) {
            $Body = @{
                id = $User.id
                success = $true
            } | ConvertTo-Json

            Invoke-RestMethod -Uri "$ApiBaseUrl/integrations/ad/confirm" -Method Post -Body $Body -ContentType "application/json"
            Write-Host "Confirmed provisioning for $($User.displayName)" -ForegroundColor Cyan
        }
    }
}
catch {
    Write-Error "Script execution failed: $_"
}
