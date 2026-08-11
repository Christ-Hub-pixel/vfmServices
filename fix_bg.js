const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // ONLY replace bg-surface or bg-slate-50 on the BODY tag
  content = content.replace(/<body([^>]*)class="([^"]*)\bbg-surface\b([^"]*)"/g, '<body$1class="$2bg-[#050B14]$3"');
  content = content.replace(/<body([^>]*)class="([^"]*)\bbg-slate-50\b([^"]*)"/g, '<body$1class="$2bg-[#050B14]$3"');
  
  // Now add bg-surface to the MAIN tag to keep the content white
  content = content.replace(/<main([^>]*)class="([^"]*)"([^>]*)>/g, '<main$1class="$2 bg-surface"$3>');
  content = content.replace(/<main(?!.*class)([^>]*)>/g, '<main class="bg-surface"$1>');

  fs.writeFileSync(f, content);
  console.log('Fixed background for ' + f);
});
