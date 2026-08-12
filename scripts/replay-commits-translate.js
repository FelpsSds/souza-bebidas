const { spawnSync } = require('child_process')

function run(cmd){
  // cmd may be string or array
  if (Array.isArray(cmd)){
    const r = spawnSync(cmd[0], cmd.slice(1), { encoding: 'utf8' })
    if(r.status !== 0) throw new Error(r.stderr || 'command failed')
    return (r.stdout||'').trim()
  } else {
    // split naive: run via shell
    const r = spawnSync(cmd, { encoding: 'utf8', shell: true })
    if(r.status !== 0) throw new Error(r.stderr || 'command failed')
    return (r.stdout||'').trim()
  }
}

// mapping of known messages to more natural Portuguese
const map = [
  { re: /feat\(images\): show thumbnails in admin and fix public products image URLs for uploaded files/i, msg: 'admin(produtos): mostrar miniaturas e corrigir URLs de imagens enviadas' },
  { re: /feat\(ui\): add lightbox\/galeria in ProductCard \(supports multiple images\)/i, msg: 'ui: adicionar lightbox/galeria em ProductCard (suporta múltiplas imagens)' },
  { re: /feat\(admin\): preview, reorder and remove images in AdminProducts; store images as array/i, msg: 'admin(produtos): pré-visualizar, reordenar e remover imagens; imagens como array' },
  { re: /feat\(api\): add categories CRUD endpoints/i, msg: 'api(categorias): CRUD de categorias (listar/criar/editar/remover)' },
  { re: /feat\(uploads\): add image upload endpoint and admin upload UI/i, msg: 'api/uploads: endpoint de upload e interface de upload no admin' },
  { re: /feat\(auth\): add JWT auth, protect orders list, seed admin user/i, msg: 'auth: autenticação JWT; proteger pedidos; criar usuário admin no seed' },
  { re: /feat\(api\): add GET \/api\/products and frontend fetch products with fallback/i, msg: 'api: GET /api/products e fallback no frontend' },
  { re: /chore: adicionar script para reescrever mensagens de commit para português/i, msg: 'chore(git): adicionar script para reescrever mensagens de commit para português' }
]

console.log('Iniciando replay de commits a partir de backup-before-rewrite...')

// create new branch
try{
  run('git branch -D translated-nice || true')
}catch(e){}
run('git checkout --orphan translated-nice')
run('git reset --hard')

const shas = run('git rev-list --reverse backup-before-rewrite').split('\n').filter(Boolean)
console.log(`Found ${shas.length} commits to replay`)

for(const sha of shas){
  const oldMsg = run(`git log --format=%B -n 1 ${sha}`).trim()
  let newMsg = oldMsg
  for(const m of map){ if(m.re.test(oldMsg)){ newMsg = m.msg; break } }
  // generic replacements to portuguese (simple)
  newMsg = newMsg.replace(/\badd\b/gi, 'adicionar').replace(/\bremove\b/gi,'remover').replace(/\bupdate\b/gi,'atualizar')

  const author = run(`git log --format='%an <%ae>' -n 1 ${sha}`)
  const date = run(`git log --format='%aD' -n 1 ${sha}`)

  console.log(`Cherry-picking ${sha} -> commit: ${newMsg}`)
  try{
    run(`git cherry-pick -n ${sha}`)
    // commit preserving author and date
    run(`git commit --author="${author}" --date="${date}" -m "${newMsg.replace(/\"/g,'\\\"')}"`)
  }catch(e){
    console.error('Erro ao cherry-pick:', e.toString())
    console.error('Tentando abortar cherry-pick e sair')
    try{ run('git cherry-pick --abort') }catch(e){}
    process.exit(1)
  }
}

console.log('Replay completo. Branch translated-nice criada.')
console.log('Para forçar o envio para main remoto, execute:')
console.log('  git push --force origin translated-nice:main')
