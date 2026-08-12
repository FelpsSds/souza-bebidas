param(
  [int]$IntervalSeconds = 5,
  [switch]$Push,
  [string[]]$Exclude = @('.env','*.log','node_modules/*')
)

Write-Host "Iniciando watcher de commits automáticos (intervalo: $IntervalSeconds s)"

while ($true) {
  $status = git status --porcelain
  if ($status) {
    $lines = $status -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' }
    $pathsToStage = @()
    foreach ($line in $lines) {
      # status format: XY <path> or ?? <path>
      $path = $line.Substring(3)
      $ignore = $false
      foreach ($pattern in $Exclude) {
        if ($path -like $pattern) { $ignore = $true; break }
      }
      if (-not $ignore) { $pathsToStage += $path }
    }

    if ($pathsToStage.Count -gt 0) {
      # Detect commit type and scope based on changed paths
      function Get-TypeAndScope($paths) {
        $counts = @{}
        $scopes = @{}
        foreach ($p in $paths) {
          $lower = $p.ToLower()
          if ($lower -like 'frontend/*' -or $lower -like 'src/*' -or $lower -like '*.jsx' -or $lower -like '*.css') {
            $key = 'feat'
            $scope = 'frontend'
          } elseif ($lower -like 'backend/*' -or $lower -like 'server.js' -or $lower -like 'prisma/*' -or $lower -like '*.js') {
            $key = 'feat'
            $scope = 'backend'
          } elseif ($lower -like 'scripts/*' -or $lower -like '*.ps1') {
            $key = 'chore'
            $scope = 'scripts'
          } elseif ($lower -like 'readme*' -or $lower -like 'docs/*') {
            $key = 'docs'
            $scope = 'docs'
          } elseif ($lower -like 'package.json' -or $lower -like 'package-lock.json' -or $lower -like 'yarn.lock') {
            $key = 'chore'
            $scope = 'deps'
          } else {
            $key = 'chore'
            $scope = 'misc'
          }

          if (-not $counts.ContainsKey($key)) { $counts[$key] = 0 }
          $counts[$key] += 1
          if (-not $scopes.ContainsKey($scope)) { $scopes[$scope] = 0 }
          $scopes[$scope] += 1
        }
        # Choose top type and top scope
        $topType = $counts.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 1 | ForEach-Object Name
        $topScope = $scopes.GetEnumerator() | Sort-Object -Property Value -Descending | Select-Object -First 1 | ForEach-Object Name
        return @{ type = $topType; scope = $topScope }
      }

      $meta = Get-TypeAndScope $pathsToStage
      $type = $meta.type
      $scope = $meta.scope

      # Build a short files summary
      $shortNames = $pathsToStage | ForEach-Object { Split-Path $_ -Leaf }
      if ($shortNames.Count -le 3) { $filesSummary = ($shortNames -join ', ') }
      else { $filesSummary = "$($shortNames.Count) files" }

      $msg = "$type($scope): update $filesSummary"

      # Stage only non-excluded paths
      git add -- $pathsToStage
      git commit -m "$msg" | Out-Null
      Write-Host "Committed: $msg -> ($(($pathsToStage -join ', ')))"
      if ($Push) {
        git push origin HEAD
        Write-Host "Pushed to origin"
      }
    } else {
      Write-Host "Changes detected but all matched exclude patterns; skipping commit."
    }
  }
  Start-Sleep -Seconds $IntervalSeconds
}
