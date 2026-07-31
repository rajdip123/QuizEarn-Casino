import re
with open('src/App.tsx', 'r') as f:
    c = f.read()

# find all component tags and deduplicate attributes
def replacer(match):
    tag = match.group(0)
    # extract attributes
    attr_pattern = re.compile(r'(\w+)=\{([^}]+)\}')
    attrs = {}
    for attr_match in attr_pattern.finditer(tag):
        k, v = attr_match.groups()
        attrs[k] = v
        
    # rebuild tag
    new_tag = tag.split()[0] + "\n"
    for k, v in attrs.items():
        new_tag += f"            {k}={{{v}}}\n"
    new_tag += "          />"
    # return the new tag, but only if it's a self closing tag like `<... />`
    if tag.endswith('/>'):
        return new_tag
    return tag

# this is risky, let's just do simple replace for the duplicates
c = re.sub(r'currency=\{currency\}[\s\S]*?currency=\{currency\}', 'currency={currency}', c)
c = re.sub(r'lang=\{appLanguage\}[\s\S]*?lang=\{appLanguage\}', 'lang={appLanguage}', c)
c = re.sub(r'adminSettings=\{adminSettings\}[\s\S]*?adminSettings=\{adminSettings\}', 'adminSettings={adminSettings}', c)

with open('src/App.tsx', 'w') as f:
    f.write(c)
