param(
  [int]$IntervalSeconds = 5,
  [string]$MessagePrefix = "auto:",
  [switch]$Push
)

Write-Host "Iniciando watcher de commits automáticos (intervalo: $IntervalSeconds s)"

while ($true) {
  $status = git status --porcelain
  if ($status) {
    $now = Get-Date -Format "yyyy-MM-dd_HH:mm:ss"
    $msg = "$MessagePrefix $now"
    git add -A
    git commit -m "$msg" | Out-Null
    Write-Host "Committed: $msg"
    if ($Push) {
      git push origin HEAD
      Write-Host "Pushed to origin"
    }
  }
  Start-Sleep -Seconds $IntervalSeconds
}
