param(
    [string]$RepoName = "souza-bebidas",
    [switch]$Private
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "CLI 'gh' não encontrada. Instale e autentique: https://cli.github.com/"
    exit 1
}

if ($Private) {
    gh repo create $RepoName --private --source=. --remote=origin --push
} else {
    gh repo create $RepoName --public --source=. --remote=origin --push
}
