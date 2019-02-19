"use strict";function _interopDefault(t){return t&&"object"==typeof t&&"default"in t?t.default:t}var fs=_interopDefault(require("fs")),path=_interopDefault(require("path")),PHTML=_interopDefault(require("."));const argo=getArgo(),configPath=!0===argo.config?"phtml.config.js":!!argo.config&&String(argo.config);function getArgo(){return process.argv.slice(2).reduce((t,e,r,o)=>{const n=/^--([^\s]+)$/;return n.test(e)?t[e.replace(n,"$1")]=!(r+1 in o)||o[r+1]:n.test(o[r-1])||("<stdin>"===t.from?t.from=e:"<stdout>"===t.to&&(t.to=e)),t},{from:"<stdin>",to:"<stdout>",plugins:""})}function getStdin(){return new Promise(t=>{let e="";process.stdin.isTTY?t(e):(process.stdin.setEncoding("utf8"),process.stdin.on("readable",()=>{let t;for(;t=process.stdin.read();)e+=t}),process.stdin.on("end",()=>{t(e)}))})}function readFile(t){return new Promise((e,r)=>{fs.readFile(t,"utf8",(t,o)=>{t?r(t):e(o)})})}function writeFile(t,e){return new Promise((r,o)=>{fs.writeFile(t,e,(t,e)=>{t?o(t):r(e)})})}function logInstructions(){console.log(["pHTML\n","  Transform HTML with JavaScript\n","Usage:\n","  phtml SOURCE.html TRANSFORMED.html","  phtml --from=SOURCE.html --to=TRANSFORMED.html",'  echo "<title>html</title>" | phtml\n'].join("\n"))}function safeRequire(t,e){try{return require(t)}catch(r){try{return require(path.resolve(t))}catch(r){if(e)return require(path.resolve(t,e));throw r}}}("<stdin>"===argo.from?getStdin():readFile(argo.from)).then(t=>{try{const e=configPath?safeRequire(configPath):{};return e.plugins=[].concat(e.plugins||[]).map(t=>{return Array.isArray(t)?t.length>1?safeRequire(t[0])(t[1]):safeRequire(t[0]):"string"==typeof t?safeRequire(t):t}),{config:e,html:t}}catch(t){console.log("something went ahh!",t)}return{config:{},html:t}}).then(({config:t,html:e})=>{"<stdin>"!==argo.from||e||(logInstructions(),process.exit(0));const r=Object.assign({from:argo.from,to:argo.to||argo.from},argo.map?{map:JSON.parse(argo.map)}:{},t.options),o=[].concat(t.plugins||[]);return PHTML.use(o).process(e,r).then(t=>"<stdout>"===argo.to?t.html:writeFile(argo.to,t.html).then(()=>`HTML has been written to "${argo.to}"`))}).catch(t=>{if(-2===Object(t).errno)throw new Error(`Sorry, "${t.path}" could not be read.`);throw t}).then(t=>{console.log(t),process.exit(0)},t=>{console.error(Object(t).message||"Something bad happened and we don’t even know what it was."),process.exit(1)});