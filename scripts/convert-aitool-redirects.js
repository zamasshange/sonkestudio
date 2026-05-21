const fs = require('fs')
const path = require('path')

function walk(dir) {
  const results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results.push(...walk(filePath))
    } else {
      results.push(filePath)
    }
  })
  return results
}

function findFiles(root) {
  const all = walk(root)
  return all.filter((f) => f.endsWith('.tsx'))
}

function extractToolId(content) {
  // matches toolId={"id"} or toolId="id" or toolId={'id'}
  const re = /toolId\s*=\s*(?:\{\s*"([^"]+)"\s*\}|"([^"]+)"|\{\s*'([^']+)'\s*\}|'([^']+)')/m
  const m = content.match(re)
  if (!m) return null
  return m[1] || m[2] || m[3] || m[4] || null
}

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  if (!content.includes("import { AITool } from '@/components/ai-tool'")) return false
  const toolId = extractToolId(content)
  if (!toolId) return false

  const newContent = `import { redirect } from 'next/navigation'\n\nexport default function Page() {\n  redirect('/tools/${toolId}')\n}\n`
  fs.writeFileSync(filePath, newContent, 'utf8')
  return true
}

function main() {
  const root = path.join(process.cwd(), 'app')
  const files = findFiles(root)
  let count = 0
  files.forEach((f) => {
    try {
      const changed = processFile(f)
      if (changed) {
        console.log('Updated:', path.relative(process.cwd(), f))
        count++
      }
    } catch (err) {
      console.error('Error processing', f, err.message)
    }
  })
  console.log('Done. Redirected', count, 'files.')
}

main()
