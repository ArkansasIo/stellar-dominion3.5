from pathlib import Path
import re

root = Path('/home/ubuntu/stellar-dominion3.5/client/src')
for path in sorted(root.rglob('*.tsx')):
    text = path.read_text(errors='ignore')
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if '<Button' not in line and '<button' not in line:
            continue
        start = i
        chunk = line
        depth = line.count('<Button') + line.count('<button') - line.count('</Button>') - line.count('</button>')
        j = i + 1
        while j < len(lines) and depth > 0 and j < i + 18:
            chunk += ' ' + lines[j]
            depth += lines[j].count('<Button') + lines[j].count('<button') - lines[j].count('</Button>') - lines[j].count('</button>')
            j += 1
        has_action = any(token in chunk for token in ('onClick=', 'onSubmit=', 'type="submit"', "type='submit'", '<Link', 'asChild'))
        if not has_action:
            label = re.sub(r'<[^>]+>', ' ', chunk)
            label = re.sub(r'\s+', ' ', label).strip()
            print(f'{path}:{start+1}: {label[:220]}')
