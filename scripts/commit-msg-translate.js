const fs = require('fs')
const path = require('path')

const file = process.argv[2]
if(!file || !fs.existsSync(file)) process.exit(0)

let msg = fs.readFileSync(file, 'utf8')

const replacements = [
  [/^feat\(/i, 'feat('],
  [/add images?/gi, 'adicionar imagens'],
  [/add/gi, 'adicionar'],
  [/update/gi, 'atualizar'],
  [/remove|delete/gi, 'remover'],
  [/upload/gi, 'upload'],
  [/fix/gi, 'corrigir'],
  [/chore/gi, 'chore'],
  [/docs/gi, 'docs'],
  [/ui/gi, 'ui']
]

for(const [re, rep] of replacements){
  msg = msg.replace(re, rep)
}

fs.writeFileSync(file, msg, 'utf8')
process.exit(0)
