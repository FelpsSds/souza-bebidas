param(
  [int]$IntervalSeconds = 5,
  [string]$MessagePrefix = "auto:",
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
      $now = Get-Date -Format "yyyy-MM-dd_HH:mm:ss"
      $msg = "$MessagePrefix $now"
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
